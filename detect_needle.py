import cv2
import os
from ultralytics import YOLO

def main():
    # Load the trained model
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, "backend", "runs", "Injection_Monitoring_v1", "weights", "best.pt")
    model = YOLO(model_path)

    # Define paths
    video_path = os.path.join(base_dir, "test_injection.mp4")
        
        # Run prediction on the video file
    results = model.predict(
            source=video_path,
            show=True,       # Display the video while processing
            save=True,       # Save the output video to runs/detect/predict/
            conf=0.25,       # Confidence threshold
            stream=True      # Process the frames in a streaming fashion to avoid MemoryError on large videos
        )

        # Note: when using stream=True, results are generated lazily as an iterator.
        # We must iterate over them to trigger the prediction and show/save functionality.
    for result in results:
            # Each 'result' corresponds to one frame of the video
            # The ultralytics library handles showing and saving if configured in predict()
        boxes = result.boxes
        if len(boxes) > 0:
            for box in boxes:
                cls_id = int(box.cls[0])
                conf_score = float(box.conf[0])
                class_name = model.names[cls_id]
                print(f"Frame {result.frame}: Detected: {class_name} | Confidence: {conf_score:.2f}")

    cv2.destroyAllWindows()

if __name__ == '__main__':
    main()
