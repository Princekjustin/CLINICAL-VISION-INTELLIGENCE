# Clinical Vision Intelligence (CVI) 🩺 🤖

A professional AI-powered monitoring system for detecting medical needle injection angles using **YOLOv11** and **FastAPI**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10-blue.svg)
![React](https://img.shields.io/badge/react-18-61dafb.svg)

## 🌟 Key Features

- **Real-time Needle Detection:** Uses a fine-tuned YOLOv11 model to monitor needle angles during injections.
- **Clinical Alert System:** Automatically flags critical angles (above 30°) or warnings (below 15°) based on medical best practices.
- **Interactive Dashboard:** A premium React-based dashboard with live camera feeds, audit logs, and performance analytics.
- **Audit Logging & Reporting:** Full session history with the ability to export logs to CSV for clinical records.
- **Role-Based Access:** Admin-only access to staff accounts and system settings.
- **Dockerized Architecture:** Seamless deployment using Docker and Docker Compose.

## 🛠️ Tech Stack

- **Frontend:** React, Recharts, Framer Motion, Vanilla CSS (Premium Healthcare Aesthetics).
- **Backend:** FastAPI (Python), Uvicorn.
- **AI/ML:** YOLOv11 (Ultralytics), OpenCV.
- **DevOps:** Docker, Docker Compose.

## 🚀 Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.
- (Optional) Python 3.10+ and Node.js 20+ if running manually.

### Installation & Setup (Docker - Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/clinical-vision-intelligence.git
   cd clinical-vision-intelligence
   ```

2. **Launch with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

3. **Access the Application:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000](http://localhost:8000)

### Manual Setup

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## 🧪 Testing

The backend includes a suite of unit tests using `pytest`.
```bash
cd backend
pytest test_main.py
```

## 📂 Project Structure

```text
├── backend/            # FastAPI Server & YOLO Logic
│   ├── runs/           # YOLO Weights & Training Logs
│   ├── main.py         # Primary API Entry Point
│   └── test_main.py    # Unit Tests
├── frontend/           # React Application
│   ├── src/            # Components & Dashboard Logic
│   └── public/         # Assets
├── docker-compose.yml  # Orchestration
└── README.md           # Documentation
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
