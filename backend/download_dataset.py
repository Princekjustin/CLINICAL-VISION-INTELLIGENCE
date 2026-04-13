from roboflow import Roboflow

# 1. Initialize Roboflow
rf = Roboflow(api_key="jQXDR1JRYmr5ac8TOElZ")

# 2. Grab your Needle Angle project
project = rf.workspace("dataset-nta0w").project("needle-angle-detection-gw4m1")
version = project.version(2)

# 3. Download it directly into the backend folder
dataset = version.download("yolov11")

print(f"\n✅ Dataset downloaded successfully to: {dataset.location}")