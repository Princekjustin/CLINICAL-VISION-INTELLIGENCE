import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    """Test the root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Clinical Vision Intelligence API is running ✅"}

def test_health_check():
    """Test the health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert "timestamp" in response.json()

def test_get_categories():
    """Test retrieving injection categories."""
    response = client.get("/categories")
    assert response.status_code == 200
    data = response.json()
    assert "categories" in data
    assert len(data["categories"]) == 18
    assert "Above 30 degrees" in data["categories"]

def test_get_log():
    """Test retrieving the session log."""
    response = client.get("/log")
    assert response.status_code == 200
    assert "log" in response.json()
    assert isinstance(response.json()["log"], list)
