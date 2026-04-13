"""
Clinical Vision Intelligence
backend/main.py — FastAPI Backend Server

Receives images from the React frontend,
runs MONAI preprocessing + YOLOv11 detection,
and returns structured JSON results.

Run with:
    uvicorn main:app --reload --port 8000
"""

import io
import base64
import cv2
import numpy as np
from datetime import datetime
from typing import Optional

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from ultralytics import YOLO
from transforms import medical_transforms

# ─────────────────────────────────────────────
# APP INITIALISATION
# ─────────────────────────────────────────────
app = FastAPI(
    title="Clinical Vision Intelligence API",
    description="YOLOv11 + MONAI injection site monitoring backend",
    version="1.0.0"
)

# Allow React frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# CONSTANTS
# ─────────────────────────────────────────────
CATEGORIES = [
    "15 degrees",
    "16 degrees",
    "17 degrees",
    "18 degrees",
    "19 degrees",
    "20 degrees",
    "21 degrees",
    "22 degrees",
    "23 degrees",
    "24 degrees",
    "25 degrees",
    "26 degrees",
    "27 degrees",
    "28 degrees",
    "29 degrees",
    "30 degrees",
    "Above 30 degrees",
    "Below 15 degrees",
]

# Clinical alert rules based on needle angle
# Correct IV angle: 15-30 degrees
ALERT_CATEGORIES   = ["Above 30 degrees"]
WARNING_CATEGORIES = ["Below 15 degrees"]
ALERT_THRESHOLD    = 0.40

# In-memory session log (resets when server restarts)
session_log = []

# ─────────────────────────────────────────────
# LOAD MODEL (once at startup)
# ─────────────────────────────────────────────
model = None

@app.on_event("startup")
async def load_model():
    global model
    try:
        model = YOLO("best.pt")
        print("✅ YOLOv11 model loaded successfully")
    except Exception as e:
        print(f"⚠️  Model not found: {e}. Using default YOLOv11n weights.")
        model = YOLO("yolo11n.pt")

# ─────────────────────────────────────────────
# RESPONSE MODELS
# ─────────────────────────────────────────────
class Detection(BaseModel):
    category: str
    confidence: float
    alert_level: str
    bbox: list  # [x1, y1, x2, y2]

class DetectionResponse(BaseModel):
    success: bool
    timestamp: str
    detections: list
    annotated_image: str  # base64 encoded
    total_objects: int
    highest_alert: str

class LogEntry(BaseModel):
    timestamp: str
    category: str
    confidence: float
    alert_level: str
    source: str
    patient_id: Optional[str] = None
    procedure_notes: Optional[str] = None

# ─────────────────────────────────────────────
# HELPER FUNCTIONS
# ─────────────────────────────────────────────
def get_alert_level(category: str, confidence: float) -> str:
    if confidence < ALERT_THRESHOLD:
        return "none"
    if category in ALERT_CATEGORIES:
        return "critical"
    if category in WARNING_CATEGORIES:
        return "warning"
    return "normal"


def get_highest_alert(detections: list) -> str:
    levels = [d["alert_level"] for d in detections]
    if "critical" in levels:
        return "critical"
    if "warning" in levels:
        return "warning"
    if "normal" in levels:
        return "normal"
    return "none"


def frame_to_base64(frame: np.ndarray) -> str:
    """Convert OpenCV frame to base64 string for JSON transport."""
    _, buffer = cv2.imencode(".jpg", frame)
    return base64.b64encode(buffer).decode("utf-8")


def decode_uploaded_image(file_bytes: bytes) -> np.ndarray:
    """Decode uploaded file bytes to OpenCV frame."""
    np_array = np.frombuffer(file_bytes, np.uint8)
    return cv2.imdecode(np_array, cv2.IMREAD_COLOR)

# ─────────────────────────────────────────────
# ROUTES
# ─────────────────────────────────────────────

@app.get("/")
async def root():
    return {"message": "Clinical Vision Intelligence API is running ✅"}


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "timestamp": datetime.now().isoformat()
    }


@app.post("/detect", response_model=DetectionResponse)
async def detect_injection(
    file: UploadFile = File(...),
    confidence_threshold: float = 0.5,
    patient_id: Optional[str] = None,
    procedure_notes: Optional[str] = None
):
    """
    Main detection endpoint.
    Accepts an image, runs MONAI + YOLOv11, returns detections.
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        # Read and decode image
        file_bytes = await file.read()
        frame = decode_uploaded_image(file_bytes)

        if frame is None:
            raise HTTPException(status_code=400, detail="Could not decode image")

        # Apply MONAI medical transforms
        medical_transforms(frame)

        # Run YOLOv11 detection
        results = model.predict(
            source=frame,
            conf=confidence_threshold,
            verbose=False
        )

        # Parse detections
        detections = []
        for box in results[0].boxes:
            confidence = float(box.conf[0])
            class_id   = int(box.cls[0])

            if class_id >= len(CATEGORIES):
                continue

            category    = CATEGORIES[class_id]
            alert_level = get_alert_level(category, confidence)
            bbox        = box.xyxy[0].tolist()  # [x1, y1, x2, y2]

            detection = {
                "category":    category,
                "confidence":  round(confidence, 4),
                "alert_level": alert_level,
                "bbox":        [round(b, 1) for b in bbox]
            }
            detections.append(detection)

            # Log to session
            log_entry = {
                "timestamp":       datetime.now().isoformat(),
                "category":        category,
                "confidence":      round(confidence, 4),
                "alert_level":     alert_level,
                "source":          "Upload",
                "patient_id":      patient_id or "Anonymous",
                "procedure_notes": procedure_notes or ""
            }
            session_log.append(log_entry)

        # Generate annotated image
        annotated_frame = results[0].plot()
        annotated_b64   = frame_to_base64(annotated_frame)

        return DetectionResponse(
            success=True,
            timestamp=datetime.now().isoformat(),
            detections=detections,
            annotated_image=annotated_b64,
            total_objects=len(detections),
            highest_alert=get_highest_alert(detections)
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")


@app.get("/log")
async def get_session_log():
    """Return the full session audit log."""
    return {
        "total_entries":    len(session_log),
        "total_alerts":     sum(1 for e in session_log if e["alert_level"] in ("critical", "warning")),
        "log":              session_log
    }


@app.delete("/log")
async def clear_session_log():
    """Clear the session audit log."""
    session_log.clear()
    return {"message": "Session log cleared", "timestamp": datetime.now().isoformat()}


@app.get("/categories")
async def get_categories():
    """Return the 6 injection site categories."""
    return {
        "categories":          CATEGORIES,
        "alert_categories":    ALERT_CATEGORIES,
        "warning_categories":  WARNING_CATEGORIES,
        "alert_threshold":     ALERT_THRESHOLD
    }
