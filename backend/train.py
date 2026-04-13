from ultralytics import YOLO

def main():
    # 1. Load your saved checkpoint
    model = YOLO("D:/Project/backend/runs/Injection_Monitoring_v1/weights/last.pt")

    # 2. Resume while forcing low RAM workers
    model.train(
        resume=True,
        workers=2
    )

if __name__ == '__main__':
    main()