from monai.transforms import (
    Compose,
    ScaleIntensity,
    NormalizeIntensity,
    ToTensor
)

medical_transforms = Compose([
    ScaleIntensity(),
    NormalizeIntensity(),
    ToTensor()
])  