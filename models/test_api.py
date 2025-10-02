#!/usr/bin/env python3
"""
Test script for YOLOv8 Acne Detection API
"""

import requests
import base64
import json
import time

# API configuration
API_BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("Testing health endpoint...")
    try:
        response = requests.get(f"{API_BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Health check error: {e}")

def test_model_info():
    """Test model info endpoint"""
    print("\nTesting model info endpoint...")
    try:
        response = requests.get(f"{API_BASE_URL}/model-info")
        if response.status_code == 200:
            print("✅ Model info retrieved")
            print(f"Response: {json.dumps(response.json(), indent=2)}")
        else:
            print(f"❌ Model info failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Model info error: {e}")

def create_test_image():
    """Create a simple test image"""
    from PIL import Image, ImageDraw
    import io
    
    # Create a simple test image
    img = Image.new('RGB', (640, 640), color='white')
    draw = ImageDraw.Draw(img)
    
    # Draw some random shapes to simulate skin
    draw.ellipse([100, 100, 200, 200], fill='pink', outline='red')
    draw.ellipse([300, 300, 400, 400], fill='pink', outline='red')
    
    # Convert to base64
    buffer = io.BytesIO()
    img.save(buffer, format='JPEG')
    img_str = base64.b64encode(buffer.getvalue()).decode()
    
    return img_str

def test_prediction():
    """Test prediction endpoint"""
    print("\nTesting prediction endpoint...")
    try:
        # Create test image
        test_image = create_test_image()
        
        # Test base64 prediction
        payload = {
            "image": test_image,
            "confidence": 0.5
        }
        
        response = requests.post(
            f"{API_BASE_URL}/predict-base64",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            print("✅ Prediction successful")
            result = response.json()
            print(f"Detections: {result['count']}")
            print(f"Model: {result['model']}")
            if result['predictions']:
                for i, pred in enumerate(result['predictions']):
                    print(f"  Detection {i+1}: {pred['class']} (confidence: {pred['confidence']:.2f})")
        else:
            print(f"❌ Prediction failed: {response.status_code}")
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"❌ Prediction error: {e}")

def test_stats():
    """Test stats endpoint"""
    print("\nTesting stats endpoint...")
    try:
        response = requests.get(f"{API_BASE_URL}/stats")
        if response.status_code == 200:
            print("✅ Stats retrieved")
            print(f"Response: {response.json()}")
        else:
            print(f"❌ Stats failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Stats error: {e}")

def main():
    """Run all tests"""
    print("🧪 YOLOv8 Acne Detection API Test Suite")
    print("=" * 50)
    
    # Wait a moment for server to start
    print("Waiting for server to be ready...")
    time.sleep(2)
    
    # Run tests
    test_health()
    test_model_info()
    test_prediction()
    test_stats()
    
    print("\n" + "=" * 50)
    print("✅ All tests completed!")

if __name__ == "__main__":
    main()
