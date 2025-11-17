# Document Classifier Python Service

This service loads and serves the trained `doc_classifier.pkl` model via a Flask API.

## Setup

1. **Create a Python virtual environment:**
```bash
cd python_services
python -m venv venv
```

2. **Activate the virtual environment:**
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Run the service:**
```bash
python classifier_service.py
```

The service will start on `http://localhost:5000`

## API Endpoints

### 1. Health Check
```bash
GET /health
```

### 2. Classify Document
```bash
POST /classify
Content-Type: application/json

{
  "text": "Your document text here",
  "return_probabilities": true
}
```

### 3. Batch Classification
```bash
POST /batch-classify
Content-Type: application/json

{
  "documents": ["text1", "text2", "text3"],
  "return_probabilities": true
}
```

### 4. Model Information
```bash
GET /model-info
```

## Environment Variables

- `CLASSIFIER_PORT`: Port to run the service (default: 5000)

## Integration with Next.js

The Next.js API route at `/api/classifier` communicates with this service.
