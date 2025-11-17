# 🚀 Quick Start - Document Classifier

## Fastest Way to Get Started

### Step 1: Start the Classifier Service

```powershell
cd python_services
.\start_classifier.ps1
```

This will:
- ✅ Create Python virtual environment
- ✅ Install dependencies
- ✅ Load your `doc_classifier.pkl` model
- ✅ Start Flask API on port 5000

### Step 2: Test the Service

Open a new terminal and test:

```powershell
# Health check
curl http://localhost:5000/health

# Get model info
curl http://localhost:5000/model-info
```

### Step 3: Use the Demo Page

Visit: **http://localhost:3000/classifier**

Upload a text file or paste text to classify!

## 📚 Full Documentation

See [`CLASSIFIER_INTEGRATION.md`](CLASSIFIER_INTEGRATION.md) for complete documentation.

## 🎯 Quick Examples

### In Your Code

```typescript
import { classifyDocument } from '@/lib/classifier';

const result = await classifyDocument("Your text here");
console.log(result.prediction);  // "category_name"
console.log(result.confidence);  // 0.95
```

### Via API

```bash
curl -X POST http://localhost:3000/api/classifier \
  -H "Content-Type: application/json" \
  -d '{"text": "Document to classify"}'
```

## 🛠️ Files Created

```
├── doc_classifier.pkl                      # Your model (already exists)
├── python_services/
│   ├── classifier_service.py               # Flask API
│   ├── requirements.txt                    # Python deps
│   ├── start_classifier.ps1                # Quick start script
│   └── README.md
├── src/
│   ├── app/api/classifier/
│   │   ├── route.ts                        # Next.js API
│   │   └── batch/route.ts                  # Batch API
│   ├── app/classifier/page.tsx             # Demo page
│   ├── components/DocumentClassifier.tsx   # UI component
│   └── lib/classifier.ts                   # Helper functions
├── CLASSIFIER_INTEGRATION.md               # Full docs
└── start_all.ps1                           # Start both services
```

## 💡 Tips

- **Python service must be running** for classification to work
- Model is loaded once at startup for speed
- Demo page is at `/classifier`
- API endpoint is `/api/classifier`

That's it! Your model is integrated! 🎉
