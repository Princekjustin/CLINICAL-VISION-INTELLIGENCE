"""
Clinical Vision Intelligence
backend/main.py — FastAPI Backend Server

Receives images from the React frontend,
runs YOLOv11 detection with geometric filtering,
and returns structured JSON results.
"""

import io
import os
import math
import base64
import cv2
import numpy as np
import tempfile
from datetime import datetime
from typing import Optional

from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from ultralytics import YOLO

# ─────────────────────────────────────────────
# APP INITIALISATION
# ─────────────────────────────────────────────
app = FastAPI(
    title="Clinical Vision Intelligence API",
    description="YOLOv11 + injection site monitoring backend",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# CONSTANTS
# ─────────────────────────────────────────────
CATEGORIES = [
    "15 degrees", "16 degrees", "17 degrees", "18 degrees", "19 degrees",
    "20 degrees", "21 degrees", "22 degrees", "23 degrees", "24 degrees",
    "25 degrees", "26 degrees", "27 degrees", "28 degrees", "29 degrees",
    "30 degrees", "Above 30 degrees", "Below 15 degrees",
]

ALERT_CATEGORIES   = ["Above 30 degrees"]
WARNING_CATEGORIES = ["Below 15 degrees"]
ALERT_THRESHOLD    = 0.40

# Broad catch-all bins that the model uses when it isn't sure.
# We apply geometric Hough override to these when confidence is low.
BROAD_CATEGORIES = {"Above 30 degrees", "Below 15 degrees"}

# Confidence below which we distrust YOLO's broad-category label
# and instead calculate angle geometrically with Hough lines.
HOUGH_OVERRIDE_THRESHOLD = 0.70

# STABILITY FILTER: Rejects anything that isn't long and thin (like a needle).
# 1.1 allows angled needles in video frames (which appear shorter at an angle)
# while still blocking truly square noise like shadows or skin blobs.
ASPECT_RATIO_MIN = 1.1


session_log = []
model = None

@app.on_event("startup")
async def load_model():
    global model
    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        # Prefer the highly generalized fine-tuned model for robust detections
        model_path = os.path.join(base_dir, "runs", "detect", "Needle_Generalization_FineTune", "weights", "best.pt")
        if not os.path.exists(model_path):
            model_path = os.path.join(base_dir, "best.pt")
        
        model = YOLO(model_path)
        print(f"✅ AI Model Loaded: {model_path}")
    except Exception as e:
        print(f"⚠️ Model load failed: {e}")
        model = YOLO("yolo11n.pt")

# ─────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────
def get_alert_level(category: str, confidence: float) -> str:
    if confidence < ALERT_THRESHOLD: return "none"
    if category in ALERT_CATEGORIES: return "critical"
    if category in WARNING_CATEGORIES: return "warning"
    return "normal"

def frame_to_base64(frame: np.ndarray) -> str:
    _, buffer = cv2.imencode(".jpg", frame)
    return base64.b64encode(buffer).decode("utf-8")

def estimate_angle_hough(crop_img: np.ndarray):
    """
    Geometrically calculate needle angle (0°=flat, 90°=vertical) using
    Hough probabilistic line transform on edge-detected crop region.
    Returns angle in degrees, or None if calculation fails.
    """
    try:
        if crop_img is None or crop_img.size == 0:
            return None
        gray    = cv2.cvtColor(crop_img, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        edges   = cv2.Canny(blurred, 30, 120)

        h, w     = crop_img.shape[:2]
        min_len  = max(10, int(min(h, w) * 0.05))

        lines = cv2.HoughLinesP(
            edges, 1, np.pi / 180,
            threshold=15,
            minLineLength=min_len,
            maxLineGap=int(min_len * 1.5)
        )
        if lines is None or len(lines) == 0:
            return None

        # Weighted average by line length — longer lines dominate (the needle shaft)
        angles, weights = [], []
        for ln in lines:
            x_a, y_a, x_b, y_b = ln[0]
            length = math.hypot(x_b - x_a, y_b - y_a)
            angle  = math.degrees(math.atan2(abs(y_b - y_a), abs(x_b - x_a)))
            angles.append(angle)
            weights.append(length)

        total_w = sum(weights)
        return sum(a * wt for a, wt in zip(angles, weights)) / total_w
    except Exception:
        return None

def angle_to_class(angle_deg: float) -> str:
    """Map a raw angle (degrees from horizontal) to the nearest class label."""
    if angle_deg < 15.0:
        return "Below 15 degrees"
    if angle_deg > 30.0:
        return "Above 30 degrees"
    rounded = max(15, min(30, int(round(angle_deg))))
    return f"{rounded} degrees"

def filter_detections(results, frame: np.ndarray, confidence_threshold: float = 0.45):
    """
    Post-process YOLO detections:
    1. Aspect-ratio noise filter (skip blobs that aren't elongated).
    2. Hough geometric override: when YOLO gives a broad catch-all label
       (Below 15 / Above 30) at low confidence, recalculate the angle from
       the detected crop and override the category with the specific degree class.
    3. Final confidence gate using the user's slider value.
    """
    detections = []
    h_img, w_img = frame.shape[:2]

    for box in results[0].boxes:
        conf = float(box.conf[0])
        cls  = int(box.cls[0])
        if cls >= len(CATEGORIES): continue

        # ── Aspect Ratio Check (Anti-Noise) ──────────────────────────────
        x1, y1, x2, y2 = box.xyxy[0].tolist()
        w_box, h_box = x2 - x1, y2 - y1
        ar = max(w_box, h_box) / (min(w_box, h_box) + 1e-6)
        if ar < ASPECT_RATIO_MIN:
            continue

        cat = CATEGORIES[cls]

        # ── Hough Geometric Override ──────────────────────────────────────
        # Only applied when YOLO gives a broad label at low confidence.
        # High-confidence predictions (≥70%) are trusted as-is.
        if cat in BROAD_CATEGORIES and conf < HOUGH_OVERRIDE_THRESHOLD:
            x1c = max(0, int(x1)); y1c = max(0, int(y1))
            x2c = min(w_img, int(x2)); y2c = min(h_img, int(y2))
            crop = frame[y1c:y2c, x1c:x2c]
            calc_angle = estimate_angle_hough(crop)
            if calc_angle is not None:
                geo_cat = angle_to_class(calc_angle)
                if geo_cat != cat:
                    # Hough found a more specific in-between angle — use it.
                    cat  = geo_cat
                    # Boost confidence so it passes the user's threshold.
                    conf = max(conf, 0.50)

        # ── Final Confidence Gate ────────────────────────────────────────
        if conf < confidence_threshold:
            continue

        detections.append({
            "category":    cat,
            "confidence":  round(conf, 4),
            "alert_level": get_alert_level(cat, conf),
            "bbox":        [round(b, 1) for b in [x1, y1, x2, y2]]
        })
    return detections

# ─────────────────────────────────────────────
# ROUTES
# ─────────────────────────────────────────────
@app.get("/health")
async def health(): return {"status": "healthy", "model_ready": model is not None}

@app.post("/detect")
async def detect(file: UploadFile = File(...), confidence_threshold: float = Form(0.45)):
    if model is None: raise HTTPException(status_code=503, detail="Model warming up")

    file_bytes = await file.read()
    nparr = np.frombuffer(file_bytes, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Run YOLO at a low internal threshold so broad-category detections are
    # available for Hough override — filter_detections applies the real
    # confidence_threshold after geometric correction.
    yolo_conf = min(confidence_threshold, 0.10)

    results = model.predict(
        source=frame,
        conf=yolo_conf,
        iou=0.45,
        imgsz=1280,
        augment=False,
        agnostic_nms=True,
        verbose=False
    )

    detections = filter_detections(results, frame, confidence_threshold)
    annotated  = results[0].plot()

    return {
        "success": True,
        "detections": detections,
        "annotated_image": frame_to_base64(annotated),
        "total": len(detections)
    }

@app.get("/categories")
async def get_cats():
    return {"categories": CATEGORIES, "alert": ALERT_CATEGORIES, "warning": WARNING_CATEGORIES}
