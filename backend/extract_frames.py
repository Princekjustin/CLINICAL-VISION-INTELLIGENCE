import os
import cv2
import re
from ultralytics import YOLO

def get_class_id_from_filename(filename):
    """
    Tries to find a number in the filename and map it to our 18 classes.
    Classes:
    0: 15 degrees, 1: 16 degrees ... 15: 30 degrees
    16: Above 30 degrees, 17: Below 15 degrees
    """
    match = re.search(r'(\d+)', filename)
    if not match:
        return None
    
    deg = int(match.group(1))
    
    if deg < 15:
        return 17  # Below 15 degrees
    elif deg > 30:
        return 16  # Above 30 degrees
    else:
        return deg - 15  # 15 deg -> 0, 16 deg -> 1, ..., 30 deg -> 15

def main():
    video_dir = r"D:\Project\Training_Videos"
    out_dir = r"D:\Project\backend\Verification_Queue"
    model_path = r"D:\Project\backend\runs\detect\Needle_Precision_Stable_Final\weights\best.pt"
    
    frames_per_sec = 2  # Extract 2 frames every second
    
    if not os.path.exists(video_dir):
        print(f"Directory {video_dir} not found.")
        return
        
    media_files = [f for f in os.listdir(video_dir) if f.lower().endswith(('.mp4', '.mov', '.avi', '.jpg', '.jpeg', '.png'))]
    if not media_files:
        print("No media files found in Training_Videos folder. Please add videos or images named with the angle (e.g., '15deg_vid.mp4' or '30deg_img.jpg')")
        return
        
    print(f"Loading YOLO model from {model_path}...")
    try:
        model = YOLO(model_path)
    except Exception as e:
        print(f"Failed to load model: {e}")
        return

    os.makedirs(os.path.join(out_dir, "images"), exist_ok=True)
    os.makedirs(os.path.join(out_dir, "labels"), exist_ok=True)

    total_extracted = 0

    for media_file in media_files:
        class_id = get_class_id_from_filename(media_file)
        if class_id is None:
            print(f"Skipping {media_file} — could not parse a valid angle number from the filename.")
            continue
            
        vid_path = os.path.join(video_dir, media_file)
        base_name = os.path.splitext(media_file)[0]
        
        print(f"Processing {media_file} (Assigning Class ID: {class_id})...")
        
        if media_file.lower().endswith(('.mp4', '.mov', '.avi')):
            # Process Video
            cap = cv2.VideoCapture(vid_path)
            fps = cap.get(cv2.CAP_PROP_FPS) or 30
            frame_interval = max(1, int(fps / frames_per_sec))
            
            frame_count = 0
            saved_count = 0
            
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                    
                if frame_count % frame_interval == 0:
                    h, w = frame.shape[:2]
                    if w > 1920:
                        scale = 1920 / w
                        frame = cv2.resize(frame, (int(w * scale), int(h * scale)))
                        h, w = frame.shape[:2]

                    results = model.predict(source=frame, conf=0.10, imgsz=1280, verbose=False)
                    boxes = results[0].boxes
                    
                    if len(boxes) > 0:
                        box = boxes[0]
                        x1, y1, x2, y2 = box.xyxy[0].tolist()
                        
                        x_c = ((x1 + x2) / 2) / w
                        y_c = ((y1 + y2) / 2) / h
                        bw = (x2 - x1) / w
                        bh = (y2 - y1) / h
                        
                        out_name = f"{base_name}_f{frame_count}"
                        img_path = os.path.join(out_dir, "images", f"{out_name}.jpg")
                        lbl_path = os.path.join(out_dir, "labels", f"{out_name}.txt")
                        
                        cv2.imwrite(img_path, frame)
                        with open(lbl_path, "w") as f:
                            f.write(f"{class_id} {x_c:.6f} {y_c:.6f} {bw:.6f} {bh:.6f}\n")
                            
                        saved_count += 1
                        total_extracted += 1
                        
                frame_count += 1
                
            cap.release()
            print(f"  -> Extracted {saved_count} frames from {media_file}")
            
        else:
            # Process Static Image
            frame = cv2.imread(vid_path)
            if frame is None:
                continue
            
            h, w = frame.shape[:2]
            if w > 1920:
                scale = 1920 / w
                frame = cv2.resize(frame, (int(w * scale), int(h * scale)))
                h, w = frame.shape[:2]
                
            results = model.predict(source=frame, conf=0.10, imgsz=1280, verbose=False)
            boxes = results[0].boxes
            
            if len(boxes) > 0:
                box = boxes[0]
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                
                x_c = ((x1 + x2) / 2) / w
                y_c = ((y1 + y2) / 2) / h
                bw = (x2 - x1) / w
                bh = (y2 - y1) / h
                
                out_name = f"{base_name}_img"
                img_path = os.path.join(out_dir, "images", f"{out_name}.jpg")
                lbl_path = os.path.join(out_dir, "labels", f"{out_name}.txt")
                
                cv2.imwrite(img_path, frame)
                with open(lbl_path, "w") as f:
                    f.write(f"{class_id} {x_c:.6f} {y_c:.6f} {bw:.6f} {bh:.6f}\n")
                    
                total_extracted += 1
                print(f"  -> Processed image {media_file}")
            else:
                print(f"  -> No objects detected in {media_file}, skipped.")

    print(f"\nDone! Extracted {total_extracted} total frames to {out_dir}")
    print("Next step: Run python verify_labels.py to quickly approve/reject these frames.")

if __name__ == "__main__":
    main()
