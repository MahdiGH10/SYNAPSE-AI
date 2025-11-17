# Document Classifier Integration Guide

This guide explains how your trained `doc_classifier.pkl` model has been integrated into the SynapseAI project.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Next.js Frontend                     │
│  ┌────────────────────────────────────────────────┐    │
│  │  /classifier (Demo Page)                        │    │
│  │  DocumentClassifier Component                   │    │
│  └────────────┬───────────────────────────────────┘    │
│               │                                          │
│  ┌────────────▼───────────────────────────────────┐    │
│  │  /api/classifier (Next.js API Route)           │    │
│  │  - POST: Single classification                 │    │
│  │  - GET: Model info                             │    │
│  └────────────┬───────────────────────────────────┘    │
│               │                                          │
│  ┌────────────▼───────────────────────────────────┐    │
│  │  /api/classifier/batch                         │    │
│  │  - POST: Batch classification                  │    │
│  └────────────┬───────────────────────────────────┘    │
└───────────────┼──────────────────────────────────────┘
                │ HTTP
                │
┌───────────────▼──────────────────────────────────────┐
│         Python Flask Service (Port 5000)              │
│  ┌──────────────────────────────────────────────┐   │
│  │  classifier_service.py                        │   │
│  │  - Loads doc_classifier.pkl                   │   │
│  │  - Exposes REST API                           │   │
│  │  - Handles predictions                        │   │
│  └──────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
SynapseAI/
├── doc_classifier.pkl                 # Your trained model
├── python_services/
│   ├── classifier_service.py          # Flask API for model
│   ├── requirements.txt               # Python dependencies
│   └── README.md                      # Python service docs
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── classifier/
│   │   │       ├── route.ts           # Single classification endpoint
│   │   │       └── batch/
│   │   │           └── route.ts       # Batch classification endpoint
│   │   └── classifier/
│   │       └── page.tsx               # Demo page
│   ├── components/
│   │   └── DocumentClassifier.tsx     # UI component
│   └── lib/
│       └── classifier.ts              # Helper functions
└── .env.local                         # Environment variables
```

## 🚀 Setup Instructions

### Step 1: Python Service Setup

1. **Navigate to python_services directory:**
   ```bash
   cd python_services
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   ```bash
   # Windows (PowerShell)
   .\venv\Scripts\Activate.ps1
   
   # Windows (CMD)
   venv\Scripts\activate.bat
   
   # Linux/Mac
   source venv/bin/activate
   ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run the classifier service:**
   ```bash
   python classifier_service.py
   ```
   
   The service will start on `http://localhost:5000`

### Step 2: Next.js Setup

The Next.js side is already configured! Just ensure:

1. **Environment variable is set** (already done in `.env.local`):
   ```env
   CLASSIFIER_SERVICE_URL=http://localhost:5000
   ```

2. **Next.js is running:**
   ```bash
   npm run dev
   ```

## 🎯 Usage Examples

### 1. Using the Demo Page

Visit: `http://localhost:3000/classifier`

Features:
- Upload text files
- Paste text directly
- View classification results
- See confidence scores
- View all category probabilities

### 2. Using the API Directly

#### Classify Single Document
```typescript
// POST /api/classifier
const response = await fetch('/api/classifier', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: "Your document text here",
    return_probabilities: true
  })
});

const result = await response.json();
// {
//   success: true,
//   prediction: "category_name",
//   confidence: 0.95,
//   probabilities: { ... }
// }
```

#### Batch Classification
```typescript
// POST /api/classifier/batch
const response = await fetch('/api/classifier/batch', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    documents: ["text1", "text2", "text3"],
    return_probabilities: true
  })
});

const result = await response.json();
// {
//   success: true,
//   results: [
//     { index: 0, prediction: "cat1", confidence: 0.9 },
//     { index: 1, prediction: "cat2", confidence: 0.85 }
//   ]
// }
```

#### Get Model Info
```typescript
// GET /api/classifier
const response = await fetch('/api/classifier');
const info = await response.json();
// {
//   success: true,
//   model_type: "LogisticRegression",
//   classes: ["class1", "class2", ...],
//   num_classes: 5
// }
```

### 3. Using Helper Functions

```typescript
import { classifyDocument, classifyDocuments, getModelInfo } from '@/lib/classifier';

// Single classification
const result = await classifyDocument("document text", true);

// Batch classification
const results = await classifyDocuments([
  "document 1",
  "document 2"
], true);

// Get model information
const modelInfo = await getModelInfo();
```

## 🔌 Integration Points

### Add to Existing Pages

```tsx
import { classifyDocument } from '@/lib/classifier';

function MyComponent() {
  const handleClassify = async (text: string) => {
    const result = await classifyDocument(text);
    if (result.success) {
      console.log('Category:', result.prediction);
      console.log('Confidence:', result.confidence);
    }
  };
  
  // ... rest of component
}
```

### Add to Chat Interface

You can integrate classification into the chat:

```tsx
// In src/app/chat/page.tsx
import { classifyDocument } from '@/lib/classifier';

// After user sends a message:
const classification = await classifyDocument(userMessage.content);
if (classification.success) {
  // Show category badge or use for routing
}
```

## 🛠️ Running in Production

### Option 1: Separate Services
1. Deploy Python service to a cloud platform (Heroku, Railway, etc.)
2. Update `CLASSIFIER_SERVICE_URL` in `.env.local`
3. Deploy Next.js as usual

### Option 2: Docker Compose
Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  classifier:
    build: ./python_services
    ports:
      - "5000:5000"
  
  nextjs:
    build: .
    ports:
      - "3000:3000"
    environment:
      - CLASSIFIER_SERVICE_URL=http://classifier:5000
    depends_on:
      - classifier
```

## 📊 API Reference

### Python Service Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/classify` | POST | Single document classification |
| `/batch-classify` | POST | Batch classification |
| `/model-info` | GET | Model information |

### Next.js API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/classifier` | POST | Classify single document |
| `/api/classifier` | GET | Get model info |
| `/api/classifier/batch` | POST | Batch classification |

## 🐛 Troubleshooting

### Service Unavailable Error
**Problem:** "Document classifier service is unavailable"

**Solutions:**
1. Check if Python service is running: `http://localhost:5000/health`
2. Verify `CLASSIFIER_SERVICE_URL` in `.env.local`
3. Check Python service logs for errors

### Model Loading Error
**Problem:** Model fails to load

**Solutions:**
1. Verify `doc_classifier.pkl` exists in project root
2. Check Python dependencies are installed
3. Ensure model was saved with compatible scikit-learn version

### CORS Errors
**Problem:** CORS errors when calling Python service

**Solution:** Flask-CORS is already configured in the service

## 📝 Notes

- The Python service must be running for classification to work
- Model is loaded once at startup for better performance
- Supports any scikit-learn classifier (LogisticRegression, RandomForest, SVM, etc.)
- Probabilities only available if model supports `predict_proba()`

## 🎨 Customization

### Change Port
Edit `python_services/classifier_service.py`:
```python
port = int(os.environ.get('CLASSIFIER_PORT', 5000))  # Change 5000 to your port
```

### Add Preprocessing
Edit the `classify_document` function in `classifier_service.py` to add text preprocessing.

### Custom Response Format
Modify the API routes in `src/app/api/classifier/` to change response format.

## 🚀 Next Steps

1. ✅ Start Python service
2. ✅ Visit http://localhost:3000/classifier
3. ✅ Test with sample documents
4. ✅ Integrate into your workflows
5. ✅ Deploy to production

Enjoy your integrated document classifier! 🎉
