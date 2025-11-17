"""
Document Classifier Service
Loads the trained doc_classifier.pkl model and exposes it via Flask API
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js frontend

# Load the trained model
MODEL_PATH = Path(__file__).parent.parent / "doc_classifier.pkl"

# Load category names from config file if available
try:
    from categories_config import CATEGORIES as CATEGORY_NAMES
    logger.info("✅ Loaded category names from categories_config.py")
except ImportError:
    # Default mapping if config file doesn't exist
    CATEGORY_NAMES = {
        '0': 'Business',
        '1': 'Technology', 
        '2': 'Finance',
        '3': 'Science',
        '4': 'Health',
    }
    logger.warning("⚠️ categories_config.py not found, using default categories")

def get_category_name(prediction):
    """Convert numeric prediction to meaningful category name"""
    pred_str = str(prediction)
    return CATEGORY_NAMES.get(pred_str, f"Category {pred_str}")

try:
    model = joblib.load(MODEL_PATH)
    logger.info(f"✅ Model loaded successfully from {MODEL_PATH}")
    
    # Try to detect actual categories from model
    if hasattr(model, 'classes_'):
        logger.info(f"📊 Model classes detected: {model.classes_}")
except Exception as e:
    logger.error(f"❌ Failed to load model: {str(e)}")
    model = None


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'service': 'document_classifier'
    })


@app.route('/classify', methods=['POST'])
def classify_document():
    """
    Classify a document
    
    Expected JSON body:
    {
        "text": "document text to classify",
        "return_probabilities": false  # optional
    }
    
    Returns:
    {
        "success": true,
        "prediction": "category",
        "probabilities": {...},  # if requested
        "confidence": 0.95
    }
    """
    try:
        if model is None:
            return jsonify({
                'success': False,
                'error': 'Model not loaded'
            }), 500
        
        # Get request data
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing required field: text'
            }), 400
        
        text = data['text']
        return_probabilities = data.get('return_probabilities', False)
        
        # Make prediction
        prediction = model.predict([text])[0]
        category_name = get_category_name(prediction)
        
        result = {
            'success': True,
            'prediction': category_name,
            'prediction_id': str(prediction),
            'text_length': len(text)
        }
        
        # Add probabilities if requested and model supports it
        if return_probabilities and hasattr(model, 'predict_proba'):
            probabilities = model.predict_proba([text])[0]
            classes = model.classes_ if hasattr(model, 'classes_') else None
            
            if classes is not None:
                # Map classes to category names with probabilities
                prob_dict = {}
                for cls, prob in zip(classes, probabilities):
                    category = get_category_name(cls)
                    prob_dict[category] = float(prob)
                result['probabilities'] = prob_dict
                result['confidence'] = float(max(probabilities))
            else:
                result['confidence'] = float(max(probabilities))
        
        logger.info(f"✅ Classification successful: {prediction} -> {category_name}")
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"❌ Classification error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/batch-classify', methods=['POST'])
def batch_classify():
    """
    Classify multiple documents at once
    
    Expected JSON body:
    {
        "documents": ["text1", "text2", ...],
        "return_probabilities": false
    }
    """
    try:
        if model is None:
            return jsonify({
                'success': False,
                'error': 'Model not loaded'
            }), 500
        
        data = request.get_json()
        
        if not data or 'documents' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing required field: documents'
            }), 400
        
        documents = data['documents']
        return_probabilities = data.get('return_probabilities', False)
        
        if not isinstance(documents, list):
            return jsonify({
                'success': False,
                'error': 'documents must be a list'
            }), 400
        
        # Make predictions
        predictions = model.predict(documents)
        
        results = []
        for i, (text, pred) in enumerate(zip(documents, predictions)):
            category_name = get_category_name(pred)
            result = {
                'index': i,
                'prediction': category_name,
                'prediction_id': str(pred),
                'text_length': len(text)
            }
            
            if return_probabilities and hasattr(model, 'predict_proba'):
                probabilities = model.predict_proba([text])[0]
                result['confidence'] = float(max(probabilities))
            
            results.append(result)
        
        logger.info(f"✅ Batch classification successful: {len(results)} documents")
        return jsonify({
            'success': True,
            'results': results,
            'total': len(results)
        })
        
    except Exception as e:
        logger.error(f"❌ Batch classification error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/model-info', methods=['GET'])
def model_info():
    """Get information about the loaded model"""
    try:
        if model is None:
            return jsonify({
                'success': False,
                'error': 'Model not loaded'
            }), 500
        
        info = {
            'success': True,
            'model_type': type(model).__name__,
            'has_classes': hasattr(model, 'classes_'),
            'supports_probabilities': hasattr(model, 'predict_proba')
        }
        
        if hasattr(model, 'classes_'):
            info['classes'] = [str(cls) for cls in model.classes_]
            info['num_classes'] = len(model.classes_)
            # Include category name mapping
            info['category_names'] = {str(cls): get_category_name(cls) for cls in model.classes_}
        
        if hasattr(model, 'feature_names_in_'):
            info['num_features'] = len(model.feature_names_in_)
        
        return jsonify(info)
        
    except Exception as e:
        logger.error(f"❌ Error getting model info: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/categories', methods=['GET'])
def get_categories():
    """Get current category name mapping"""
    return jsonify({
        'success': True,
        'categories': CATEGORY_NAMES
    })


@app.route('/categories', methods=['POST'])
def update_categories():
    """
    Update category name mapping
    
    Expected JSON body:
    {
        "0": "Business Documents",
        "1": "Technical Reports",
        "2": "Financial Statements",
        ...
    }
    """
    global CATEGORY_NAMES
    try:
        data = request.get_json()
        
        if not data or not isinstance(data, dict):
            return jsonify({
                'success': False,
                'error': 'Invalid request body. Expected a dictionary of category mappings.'
            }), 400
        
        CATEGORY_NAMES.update(data)
        logger.info(f"✅ Category mappings updated: {CATEGORY_NAMES}")
        
        return jsonify({
            'success': True,
            'categories': CATEGORY_NAMES,
            'message': 'Category mappings updated successfully'
        })
        
    except Exception as e:
        logger.error(f"❌ Error updating categories: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


if __name__ == '__main__':
    port = int(os.environ.get('CLASSIFIER_PORT', 5000))
    logger.info(f"🚀 Starting Document Classifier Service on port {port}")
    logger.info(f"📋 Default category mappings: {CATEGORY_NAMES}")
    logger.info(f"💡 Update category names via POST /categories")
    app.run(host='0.0.0.0', port=port, debug=True)
