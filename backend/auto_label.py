import os
import shutil
import cv2
from ultralytics import YOLO

def main():
    base_dir = r"d:\Project\Samples"
    target_dir = r"d:\Project\backend\Needle-Angle-Detection-2\train"
    model_path = r"D:\Project\backend\runs\detect\Needle_Precision_Stable_Final\weights\best.pt"
    
    os.makedirs(os.path.join(target_dir, "images"), exist_ok=True)
    os.makedirs(os.path.join(target_dir, "labels"), exist_ok=True)

    files_to_label = [
        {"name": "sample_injection_1_1777758423147.png", "class_id": 5},   # 20 degrees
        {"name": "sample_injection_2_1777758473156.png", "class_id": 16},  # Above 30 degrees
        {"name": "sample_injection_3_1777758684168.png", "class_id": 17},  # Below 15 degrees
    ]

    try:
        model = YOLO(model_path)
    except Exception as e:
        print(f"Failed to load model: {e}")
        return

    for item in files_to_label:
        file_path = os.path.join(base_dir, item["name"])
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            continue
            
        print(f"Processing {item['name']}...")
        
        # Read image to get dimensions
        img = cv2.imread(file_path)
        if img is None:
            print("Could not read image")
            continue
        h, w = img.shape[:2]

        results = model.predict(source=img, conf=0.1, imgsz=1280)
        
        # We need YOLO format: class x_center y_center width height (normalized)
        boxes = results[0].boxes
        if len(boxes) == 0:
            print(f"No objects detected in {item['name']}! Providing a default center box for training robustness.")
            # Default fallback if the model completely misses it (center box)
            x_c, y_c, bw, bh = 0.5, 0.5, 0.4, 0.4
        else:
            # Take the highest confidence box
            box = boxes[0]
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            x_c = ((x1 + x2) / 2) / w
            y_c = ((y1 + y2) / 2) / h
            bw = (x2 - x1) / w
            bh = (y2 - y1) / h
            
        # Write label file
        base_name = os.path.splitext(item["name"])[0]
        label_path = os.path.join(target_dir, "labels", f"{base_name}.txt")
        with open(label_path, "w") as f:
            f.write(f"{item['class_id']} {x_c:.6f} {y_c:.6f} {bw:.6f} {bh:.6f}\n")
            
        # Copy image
        shutil.copy(file_path, os.path.join(target_dir, "images", item["name"]))
        print(f"Saved label and copied image for {item['name']}")

if __name__ == "__main__":
    main()
