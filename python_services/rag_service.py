"""
RAG Service - Document Processing & Semantic Search
Integrates with your trained ML classifier for intelligent document handling
"""

import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
from PyPDF2 import PdfReader
import numpy as np
from typing import List, Dict, Any
import json
from datetime import datetime
import joblib

# Initialize Flask
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(levelname)s:%(name)s:%(message)s'
)
logger = logging.getLogger(__name__)

# Load models
logger.info("🚀 Loading models...")
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')  # Fast, 384-dim embeddings

# Load classifier model
classifier_path = os.path.join(os.path.dirname(__file__), '..', 'doc_classifier.pkl')
classifier_model = joblib.load(classifier_path)
logger.info("✅ Models loaded successfully")

# In-memory vector store (will upgrade to MongoDB Atlas later)
document_store = {
    'documents': [],
    'embeddings': [],
    'metadata': []
}

def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from PDF file"""
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        logger.error(f"PDF extraction error: {e}")
        raise

def smart_chunk_text(text: str, category: str, chunk_size: int = 500) -> List[str]:
    """
    Category-aware text chunking
    Different categories need different splitting strategies
    """
    chunks = []
    
    if category in ['Technical Reports', 'Scientific Papers']:
        # Preserve code blocks and technical sections
        # Split on double newlines (paragraphs)
        paragraphs = text.split('\n\n')
        current_chunk = ""
        
        for para in paragraphs:
            if len(current_chunk) + len(para) < chunk_size:
                current_chunk += para + "\n\n"
            else:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                current_chunk = para + "\n\n"
        
        if current_chunk:
            chunks.append(current_chunk.strip())
    
    elif category in ['Financial Analysis', 'Business Documents']:
        # Preserve tables and financial data
        lines = text.split('\n')
        current_chunk = ""
        
        for line in lines:
            if len(current_chunk) + len(line) < chunk_size:
                current_chunk += line + "\n"
            else:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                current_chunk = line + "\n"
        
        if current_chunk:
            chunks.append(current_chunk.strip())
    
    else:
        # Default: Simple sliding window
        words = text.split()
        for i in range(0, len(words), chunk_size // 2):  # 50% overlap
            chunk = ' '.join(words[i:i + chunk_size])
            if chunk:
                chunks.append(chunk)
    
    return [c for c in chunks if len(c.strip()) > 50]  # Filter tiny chunks

def classify_document(text: str) -> Dict[str, Any]:
    """Use your trained classifier to categorize the document"""
    try:
        prediction = classifier_model.predict([text])[0]
        probabilities = classifier_model.predict_proba([text])[0]
        
        # Get category name from categories_config
        from categories_config import CATEGORIES
        category_name = CATEGORIES.get(str(prediction), f"Category {prediction}")
        
        return {
            'category': category_name,
            'category_id': int(prediction),
            'confidence': float(max(probabilities)),
            'all_probabilities': {CATEGORIES.get(str(i), f"Cat{i}"): float(p) 
                                 for i, p in enumerate(probabilities)}
        }
    except Exception as e:
        logger.error(f"Classification error: {e}")
        return {
            'category': 'Unknown',
            'category_id': -1,
            'confidence': 0.0,
            'all_probabilities': {}
        }

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'service': 'RAG Service',
        'documents_indexed': len(document_store['documents']),
        'embedding_model': 'all-MiniLM-L6-v2',
        'classifier_loaded': classifier_model is not None
    })

@app.route('/upload-document', methods=['POST'])
def upload_document():
    """
    Upload and process a document:
    1. Extract text (PDF or plain text)
    2. Classify using your ML model
    3. Smart chunking based on category
    4. Generate embeddings
    5. Store in vector database
    """
    try:
        # Get file or text
        if 'file' in request.files:
            file = request.files['file']
            
            # Use system temp directory (works on Windows and Unix)
            import tempfile
            temp_dir = tempfile.gettempdir()
            temp_path = os.path.join(temp_dir, file.filename)
            file.save(temp_path)
            
            if file.filename.endswith('.pdf'):
                text = extract_text_from_pdf(temp_path)
            else:
                text = open(temp_path, 'r', encoding='utf-8').read()
            
            os.remove(temp_path)
            doc_name = file.filename
        elif request.json and 'text' in request.json:
            text = request.json['text']
            doc_name = request.json.get('name', 'text_document.txt')
        else:
            return jsonify({'error': 'No file or text provided'}), 400
        
        # Step 1: Classify the document using YOUR ML model 🎯
        classification = classify_document(text)
        logger.info(f"📊 Classified as: {classification['category']} ({classification['confidence']:.2%})")
        
        # Step 2: Smart chunking based on category
        chunks = smart_chunk_text(text, classification['category'])
        logger.info(f"📄 Created {len(chunks)} chunks")
        
        # Step 3: Generate embeddings for each chunk
        chunk_embeddings = embedding_model.encode(chunks, show_progress_bar=False)
        
        # Step 4: Store document
        doc_id = len(document_store['documents'])
        document_store['documents'].extend(chunks)
        document_store['embeddings'].extend(chunk_embeddings.tolist())
        
        # Store metadata for each chunk
        for i, chunk in enumerate(chunks):
            document_store['metadata'].append({
                'doc_id': doc_id,
                'doc_name': doc_name,
                'chunk_index': i,
                'total_chunks': len(chunks),
                'category': classification['category'],
                'category_id': classification['category_id'],
                'confidence': classification['confidence'],
                'timestamp': datetime.now().isoformat(),
                'text_preview': chunk[:200]
            })
        
        return jsonify({
            'success': True,
            'doc_id': doc_id,
            'doc_name': doc_name,
            'classification': classification,
            'chunks_created': len(chunks),
            'total_documents': len(set(m['doc_id'] for m in document_store['metadata'])),
            'message': f"Document classified as '{classification['category']}' and indexed successfully"
        })
    
    except Exception as e:
        logger.error(f"Upload error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/search', methods=['POST'])
def semantic_search():
    """
    Semantic search with category filtering
    Your classifier enables smart filtering!
    """
    try:
        data = request.json
        query = data.get('query', '')
        category_filter = data.get('category')  # Optional: filter by category
        top_k = data.get('top_k', 5)
        
        if not query:
            return jsonify({'error': 'Query required'}), 400
        
        if not document_store['documents']:
            return jsonify({'results': [], 'message': 'No documents indexed yet'})
        
        # Generate query embedding
        query_embedding = embedding_model.encode([query])[0]
        
        # Calculate similarities
        embeddings_array = np.array(document_store['embeddings'])
        similarities = np.dot(embeddings_array, query_embedding)
        
        # Get top results
        top_indices = np.argsort(similarities)[::-1]
        
        results = []
        for idx in top_indices:
            metadata = document_store['metadata'][idx]
            
            # Apply category filter if specified
            if category_filter and metadata['category'] != category_filter:
                continue
            
            results.append({
                'text': document_store['documents'][idx],
                'similarity': float(similarities[idx]),
                'metadata': metadata
            })
            
            if len(results) >= top_k:
                break
        
        return jsonify({
            'success': True,
            'query': query,
            'results': results,
            'total_found': len(results),
            'category_filter': category_filter
        })
    
    except Exception as e:
        logger.error(f"Search error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/query', methods=['POST'])
def query_document():
    """
    Full RAG pipeline: Retrieve relevant chunks + Generate answer
    """
    try:
        data = request.json
        question = data.get('question', '')
        category_filter = data.get('category')
        
        if not question:
            return jsonify({'error': 'Question required'}), 400
        
        # Step 1: Semantic search for relevant context
        search_results = semantic_search_internal(question, category_filter, top_k=3)
        
        if not search_results:
            return jsonify({
                'success': True,
                'answer': "I couldn't find relevant information in the uploaded documents.",
                'sources': []
            })
        
        # Step 2: Build context from retrieved chunks
        context = "\n\n".join([
            f"[Source: {r['metadata']['doc_name']} - {r['metadata']['category']}]\n{r['text']}"
            for r in search_results
        ])
        
        # Step 3: Get category for specialized prompting
        primary_category = search_results[0]['metadata']['category']
        
        # Step 4: Return context + metadata (LLM call will be on Next.js side)
        return jsonify({
            'success': True,
            'context': context,
            'category': primary_category,
            'sources': [{
                'doc_name': r['metadata']['doc_name'],
                'category': r['metadata']['category'],
                'chunk_index': r['metadata']['chunk_index'],
                'similarity': r['similarity'],
                'preview': r['text'][:200]
            } for r in search_results],
            'question': question
        })
    
    except Exception as e:
        logger.error(f"Query error: {e}")
        return jsonify({'error': str(e)}), 500

def semantic_search_internal(query: str, category_filter: str = None, top_k: int = 5):
    """Internal search function for RAG pipeline"""
    if not document_store['documents']:
        return []
    
    query_embedding = embedding_model.encode([query])[0]
    embeddings_array = np.array(document_store['embeddings'])
    similarities = np.dot(embeddings_array, query_embedding)
    top_indices = np.argsort(similarities)[::-1]
    
    results = []
    for idx in top_indices:
        metadata = document_store['metadata'][idx]
        
        if category_filter and metadata['category'] != category_filter:
            continue
        
        results.append({
            'text': document_store['documents'][idx],
            'similarity': float(similarities[idx]),
            'metadata': metadata
        })
        
        if len(results) >= top_k:
            break
    
    return results

@app.route('/documents', methods=['GET'])
def list_documents():
    """List all indexed documents"""
    unique_docs = {}
    for meta in document_store['metadata']:
        doc_id = meta['doc_id']
        if doc_id not in unique_docs:
            unique_docs[doc_id] = {
                'doc_id': doc_id,
                'doc_name': meta['doc_name'],
                'category': meta['category'],
                'confidence': meta['confidence'],
                'chunks': meta['total_chunks'],
                'timestamp': meta['timestamp']
            }
    
    return jsonify({
        'success': True,
        'documents': list(unique_docs.values()),
        'total': len(unique_docs)
    })

if __name__ == '__main__':
    logger.info("=" * 60)
    logger.info("🚀 RAG Service with ML Classifier Integration")
    logger.info("=" * 60)
    logger.info("📊 Your classifier guides intelligent document processing")
    logger.info("🔍 Semantic search enabled")
    logger.info("💬 Ready for questions!")
    logger.info("=" * 60)
    app.run(host='0.0.0.0', port=5001, debug=True)
