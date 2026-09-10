import cv2
import os
from ultralytics import YOLO

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_path = os.path.join(base_dir, "backend", "runs", "Injection_Monitoring_v1", "weights", "best.pt")
    video_path = os.path.join(base_dir, "test_injection.mp4")

    model = YOLO(model_path)

    # Run prediction
    results = model.predict(
        source=video_path, 
        show=True,       
        save=True,
        conf=0.25 
    )

    # 📜 Print out what the model thinks it sees!
    for result in results:
        boxes = result.boxes
        for box in boxes:
            cls_id = int(box.cls[0])
            conf_score = float(box.conf[0])
            class_name = model.names[cls_id]
            print(f"🎯 Detected: {class_name} | Confidence: {conf_score:.2f}")

    cv2.waitKey(0)
    cv2.destroyAllWindows()

if __name__ == '__main__':
    main()