# Clinical Vision Intelligence
## Setup & Running Instructions

---

## Project Structure

```
clinical_vision_intelligence/
│
├── backend/
│   ├── main.py              ← FastAPI server
│   ├── transforms.py        ← MONAI preprocessing
│   ├── requirements.txt     ← Python dependencies
│   └── best.pt              ← Your trained YOLOv11 weights (add this)
│
├── frontend/
│   └── src/
│       └── App.jsx          ← React dashboard
│
├── train.py                 ← Run once to train model
└── dataset.yaml             ← Roboflow dataset config
```

---

## Step 1 — Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Copy your trained `best.pt` file into the `backend/` folder.

Start the server:
```bash
uvicorn main:app --reload --port 8000
```

Backend runs at: http://localhost:8000
API docs at:     http://localhost:8000/docs

---

## Step 2 — Frontend Setup

```bash
cd frontend
npx create-react-app .
```

Replace `src/App.js` content with `src/App.jsx` content.

Start the React app:
```bash
npm start
```

Frontend runs at: http://localhost:3000

---

## Step 3 — Train Your Model (if not done yet)

```bash
cd ..
python train.py
```

Copy the output `runs/train/injection_monitor/weights/best.pt` to `backend/best.pt`

---

## API Endpoints

| Method | Endpoint     | Description                    |
|--------|-------------|--------------------------------|
| GET    | /health     | Check server is running        |
| POST   | /detect     | Upload image, get detections   |
| GET    | /log        | Get session audit log          |
| DELETE | /log        | Clear session audit log        |
| GET    | /categories | Get the 6 injection categories |

---

## 6 Detection Categories

1. Normal Injection Site
2. Swelling / Inflammation
3. Infection / Abscess
4. Bruising / Haematoma
5. Incorrect Placement
6. Adverse Reaction
