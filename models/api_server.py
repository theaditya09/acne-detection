"""
API Server for YOLOv8 Acne Detection Model
Provides REST API endpoints for acne detection
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import base64
import io
from PIL import Image
import numpy as np
from typing import Dict, List, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="YOLOv8 Acne Detection API",
    description="API for detecting acne in skin images using YOLOv8 model",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock model for demonstration
class MockYOLOModel:
    def __init__(self):
        self.is_loaded = True
        self.class_mapping = {0: 'Acne'}
        self.class_ids = ['Acne']
    
    def predict(self, image_data: str, confidence: float = 0.5):
        """Mock prediction function"""
        import random
        
        # Simulate random acne detection for demo
        detections = []
        num_detections = random.randint(0, 3)  # 0-3 acne spots
        
        for _ in range(num_detections):
            detection = {
                'class': 'Acne',
                'confidence': round(random.uniform(0.6, 0.95), 2),
                'bbox': {
                    'xmin': random.randint(50, 300),
                    'ymin': random.randint(50, 300),
                    'xmax': random.randint(350, 590),
                    'ymax': random.randint(350, 590)
                }
            }
            detections.append(detection)
        
        return {
            'predictions': detections,
            'count': len(detections),
            'model': 'YOLOv8-Acne-Detector',
            'version': '1.0.0',
            'confidence_threshold': confidence
        }

# Global model instance
model = MockYOLOModel()

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "YOLOv8 Acne Detection API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model.is_loaded
    }

@app.post("/predict")
async def predict_endpoint(
    image: UploadFile = File(...),
    confidence: float = 0.5
):
    """
    Predict acne in uploaded image
    
    Args:
        image: Uploaded image file
        confidence: Confidence threshold (0.0-1.0)
        
    Returns:
        JSON response with predictions
    """
    try:
        # Validate confidence threshold
        if not 0.0 <= confidence <= 1.0:
            raise HTTPException(
                status_code=400,
                detail="Confidence threshold must be between 0.0 and 1.0"
            )
        
        # Read and validate image
        image_data = await image.read()
        
        # Convert to base64
        base64_image = base64.b64encode(image_data).decode('utf-8')
        
        # Make prediction
        result = model.predict(base64_image, confidence)
        
        logger.info(f"Prediction completed: {result['count']} detections found")
        
        return JSONResponse(content=result)
        
    except Exception as e:
        logger.error(f"Error in prediction: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing image: {str(e)}"
        )

@app.post("/predict-base64")
async def predict_base64_endpoint(
    request: Dict
):
    """
    Predict acne from base64 encoded image
    
    Args:
        request: JSON with 'image' (base64) and optional 'confidence'
        
    Returns:
        JSON response with predictions
    """
    try:
        # Extract parameters
        image_data = request.get('image')
        confidence = request.get('confidence', 0.5)
        
        if not image_data:
            raise HTTPException(
                status_code=400,
                detail="Image data is required"
            )
        
        # Validate confidence threshold
        if not 0.0 <= confidence <= 1.0:
            raise HTTPException(
                status_code=400,
                detail="Confidence threshold must be between 0.0 and 1.0"
            )
        
        # Make prediction
        result = model.predict(image_data, confidence)
        
        logger.info(f"Base64 prediction completed: {result['count']} detections found")
        
        return JSONResponse(content=result)
        
    except Exception as e:
        logger.error(f"Error in base64 prediction: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing image: {str(e)}"
        )

@app.get("/model-info")
async def model_info():
    """Get model information"""
    return {
        "model_name": "YOLOv8-Acne-Detector",
        "version": "1.0.0",
        "classes": model.class_ids,
        "class_mapping": model.class_mapping,
        "is_loaded": model.is_loaded,
        "description": "YOLOv8-based acne detection model trained on custom dataset"
    }

@app.get("/stats")
async def get_stats():
    """Get API statistics"""
    return {
        "total_requests": 0,  # Would be tracked in production
        "model_status": "ready",
        "uptime": "running"
    }

if __name__ == "__main__":
    # Run the server
    uvicorn.run(
        "api_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )