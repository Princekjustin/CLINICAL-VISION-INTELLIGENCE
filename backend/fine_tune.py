import os
from ultralytics import YOLO

def main():
    # 1. Load the current best checkpoint
    # We use this as our base so we don't lose previous knowledge
    base_weights = r"D:\Project\backend\runs\detect\Needle_Precision_Stable_Final\weights\best.pt"
    dataset_yaml = r"d:\Project\backend\Needle-Angle-Detection-2\data.yaml"
    
    print(f"Loading base model: {base_weights}")
    model = YOLO(base_weights)

    print("Starting fine-tuning with heavy data augmentation for generalization...")
    
    # 2. Train with advanced augmentations
    # By forcing the model to look at heavily augmented images,
    # it learns to generalize to unseen clinics, lighting, and angles.
    results = model.train(
        data=dataset_yaml,
        epochs=10,             # Short fine-tuning
        imgsz=1280,            # High resolution for tiny needles
        batch=2,               # Small batch size to fit in RAM/VRAM
        workers=2,             # Low workers to prevent RAM crashing
        project=r"D:\Project\backend\runs\detect",
        name="Needle_Generalization_FineTune",
        exist_ok=True,
        lr0=0.0001,            # Very low learning rate to prevent catastrophic forgetting
        # -- Advanced Augmentation Hyperparameters --
        mosaic=1.0,            # High mosaic combines 4 images into 1 (improves small object detection)
        mixup=0.2,             # Image mixup (makes model robust to weird backgrounds)
        hsv_h=0.015,           # Color hue augmentation (deals with different lighting)
        hsv_s=0.7,             # Saturation augmentation
        hsv_v=0.4,             # Value (brightness) augmentation
        degrees=15.0,          # Rotation (helps with different camera tilts)
        translate=0.2,         # Translation
        scale=0.5,             # Scaling (simulates different camera distances)
        shear=0.0,
        perspective=0.0001,    # Slight perspective warping
        flipud=0.0,            # Needles are usually right-side up, don't flip UD
        fliplr=0.5,            # Left-to-right flip is fine
        bgr=0.0,               # Don't mess with channels
        copy_paste=0.1         # Segment copy-paste (if applicable, else ignored)
    )
    
    print("Fine-tuning complete!")
    print(f"New weights saved in: {results.save_dir}")

if __name__ == '__main__':
    main()
