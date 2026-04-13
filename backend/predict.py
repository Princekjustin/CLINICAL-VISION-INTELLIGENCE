# import cv2
# from ultralytics import YOLO

# def main():
#     # 1. Load your newly trained best weights
#     model = YOLO("D:/Project/backend/runs/Injection_Monitoring_v1/weights/best.pt")

#     # 2. Run prediction on a video file
#     results = model.predict(
#         source="D:/Project/test_injection.mp4", 
#         show=True,  # Pop-up video display window     
#         save=True, #Save drawn results to runs/detect/predict/
#         conf=0.25, # 👈 Only show boxes if the AI is 60% sure it's a needle!
#         agnostic_nms=True
#     )

#     # Keep the final frame on screen until you press any key
#     cv2.waitKey(0)
#     cv2.destroyAllWindows()

# if __name__ == '__main__':
#     main()

# import cv2
# from ultralytics import YOLO

# def main():
#     # 1. Load weights
#     model = YOLO("D:/Project/backend/runs/Injection_Monitoring_v1/weights/best.pt")

#     # 2. Open Webcam
#     cap = cv2.VideoCapture(0)

#     # Set to HD resolution to stop the pixelation/blurriness
#     cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
#     cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

#     # 3. Create a manually resizable window
#     window_name = "Clinical Needle Angle Monitoring"
#     cv2.namedWindow(window_name, cv2.WINDOW_NORMAL) 

#     print("\n--- Clinical Live UI Started (Press 'q' on the window to exit) ---")

#     while cap.isOpened():
#         success, frame = cap.read()
#         if not success:
#             break

#         # 🔥 FIX LATERAL INVERSION: Flip the frame horizontally (mirror mode)
#         frame = cv2.flip(frame, 1) # 1 = horizontal flip, 0 = vertical flip

#         # Run prediction on the flipped frame
#         results = model.predict(source=frame, verbose=False)

#         # Draw bounding boxes (Thicker lines for HD screens)
#         annotated_frame = results[0].plot(line_width=2) 

#         cv2.imshow(window_name, annotated_frame)

#         if cv2.waitKey(1) & 0xFF == ord('q'):
#             break

#     cap.release()
#     cv2.destroyAllWindows()

# if __name__ == '__main__':
#     main()




import cv2
from ultralytics import YOLO

def main():
    model = YOLO("D:/Project/backend/runs/Injection_Monitoring_v1/weights/best.pt")

    # Run prediction
    results = model.predict(
        source="D:/Project/test_injection.mp4", 
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