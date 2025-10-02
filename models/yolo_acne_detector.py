"""
YOLOv8 Acne Detection Model
Based on the Kaggle implementation for acne detection using YOLOv8
"""

import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import cv2
from tqdm.notebook import tqdm

import tensorflow as tf

from tensorflow.keras import *
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import *
import keras_cv

BATCH_SIZE = 16
AUTO = tf.data.AUTOTUNE

# Preprocessing functions
def parse_txt_annot(img_path, txt_path):
    img = cv2.imread(img_path)
    w = int(img.shape[0])
    h = int(img.shape[1])

    file_label = open(txt_path, "r")
    lines = file_label.read().split('\n')
    
    boxes = []
    classes = []
    
    if lines[0] == '':
        return img_path, classes, boxes
    else:
        for i in range(0, int(len(lines))):
            objbud=lines[i].split(' ')
            class_ = int(objbud[0])
        
            x1 = float(objbud[1])
            y1 = float(objbud[2])
            w1 = float(objbud[3])
            h1 = float(objbud[4])
        
            xmin = int((x1*w) - (w1*w)/2.0)
            ymin = int((y1*h) - (h1*h)/2.0)
            xmax = int((x1*w) + (w1*w)/2.0)
            ymax = int((y1*h) + (h1*h)/2.0)
    
            boxes.append([xmin ,ymin ,xmax ,ymax])
            classes.append(class_)
    
    return img_path, classes, boxes

# Function for creating file paths list 
def create_paths_list(path):
    full_path = []
    images = sorted(os.listdir(path))
    
    for i in images:
        full_path.append(os.path.join(path, i))
        
    return full_path

class_ids = ['Acne']
class_mapping = {0: 'Acne'}

# Function for creating a dict format of files
def creating_files(img_files_paths, annot_files_paths):
    
    img_files = create_paths_list(img_files_paths)
    annot_files = create_paths_list(annot_files_paths)
    
    image_paths = []
    bbox = []
    classes = []
    
    for i in range(0,len(img_files)):
        image_path_, classes_, bbox_ = parse_txt_annot(img_files[i], annot_files[i])
        image_paths.append(image_path_)
        bbox.append(bbox_)
        classes.append(classes_)
        
    image_paths = tf.ragged.constant(image_paths)
    bbox = tf.ragged.constant(bbox)
    classes = tf.ragged.constant(classes)
    
    return image_paths, classes, bbox

# Reading and resizing images
def img_preprocessing(img_path):
    img = tf.io.read_file(img_path)
    img = tf.image.decode_jpeg(img, channels = 3)
    img = tf.cast(img, tf.float32) 
    
    return img

resizing = keras_cv.layers.JitteredResize(
    target_size=(640, 640),
    scale_factor=(0.8, 1.25),
    bounding_box_format="xyxy")

# Loading dataset
def load_ds(img_paths, classes, bbox):
    img = img_preprocessing(img_paths)

    bounding_boxes = {
        "classes": tf.cast(classes, dtype=tf.float32),
        "boxes": bbox }
    
    return {"images": img, "bounding_boxes": bounding_boxes}

def dict_to_tuple(inputs):
    return inputs["images"], inputs["bounding_boxes"]

# YOLOv8 Model Creation
def create_yolo_model():
    """Create the YOLOv8 model architecture"""
    # Creating mirrored strategy
    stg = tf.distribute.MirroredStrategy()

    # Creating yolo backbone
    with stg.scope():
        backbone = keras_cv.models.YOLOV8Backbone.from_preset("yolo_v8_xs_backbone", include_rescaling = True)
        
        YOLOV8_model = keras_cv.models.YOLOV8Detector(num_classes=len(class_mapping),
                                                      bounding_box_format = "xyxy", backbone = backbone, fpn_depth = 5)

        optimizer = Adam(learning_rate=0.0007, weight_decay=0.0009, global_clipnorm = 10.0)
        my_callbacks = [ModelCheckpoint('/kaggle/working/yolo_acne_detection.h5', monitor = 'val_loss',save_best_only = True, save_weights_only = True),
                        ReduceLROnPlateau(monitor='val_loss', factor=0.01, patience=8, verbose=0, min_delta=0.001),
                        EarlyStopping(monitor='val_loss', patience=20)]
        

        YOLOV8_model.compile(optimizer = optimizer, classification_loss = 'binary_crossentropy', box_loss = 'ciou')
    
    return YOLOV8_model, my_callbacks

# Training function
def train_model(model, train_dataset, valid_dataset, callbacks):
    """Train the YOLOv8 model"""
    hist = model.fit(train_dataset, validation_data = valid_dataset, epochs = 140, callbacks = callbacks)
    return hist

# Visualization functions
def visualize_dataset(inputs, value_range, rows, cols, bounding_box_format):
    inputs = next(iter(inputs.take(1)))
    images, bounding_boxes = inputs[0], inputs[1]
    
    keras_cv.visualization.plot_bounding_box_gallery(
        images,
        value_range=value_range,
        rows=rows,
        cols=cols,
        y_true=bounding_boxes,
        scale = 6,
        font_scale = 0.8,
        line_thickness=2,
        dpi = 100,
        bounding_box_format=bounding_box_format,
        class_mapping=class_mapping,
        true_color = (192, 57, 43))

def visualize_predict_detections(model, dataset, bounding_box_format):
    images, y_true = next(iter(dataset.take(1)))

    y_pred = model.predict(images, verbose = 0)
    y_pred = keras_cv.bounding_box.to_ragged(y_pred)
    
    keras_cv.visualization.plot_bounding_box_gallery(
        images,
        value_range=(0, 255),
        bounding_box_format=bounding_box_format,
        y_true=y_true,
        y_pred=y_pred,
        true_color = (192, 57, 43),
        pred_color=(255, 235, 59),
        scale = 8,
        font_scale = 0.8,
        line_thickness=2,
        dpi = 100,
        rows=2,
        cols=2,
        show=True,
        class_mapping=class_mapping,
    )

# Main training pipeline
def main():
    """Main training pipeline"""
    print("Starting YOLOv8 Acne Detection Training Pipeline...")
    
    # Create datasets (you would replace these paths with your actual data paths)
    print("Loading datasets...")
    train_img_paths, train_classes, train_bboxes = creating_files(
        '/kaggle/input/acne-dataset-in-yolov8-format/data-2/train/images', 
        '/kaggle/input/acne-dataset-in-yolov8-format/data-2/train/labels'
    )

    valid_img_paths, valid_classes, valid_bboxes = creating_files(
        '/kaggle/input/acne-dataset-in-yolov8-format/data-2/valid/images',
        '/kaggle/input/acne-dataset-in-yolov8-format/data-2/valid/labels'
    )

    test_img_paths, test_classes, test_bboxes = creating_files(
        '/kaggle/input/acne-dataset-in-yolov8-format/data-2/test/images',
        '/kaggle/input/acne-dataset-in-yolov8-format/data-2/test/labels'
    )

    # Create dataset loaders
    print("Creating dataset loaders...")
    train_loader = tf.data.Dataset.from_tensor_slices((train_img_paths, train_classes, train_bboxes))
    train_dataset = (train_loader
                     .map(load_ds, num_parallel_calls = AUTO)
                     .shuffle(BATCH_SIZE*10)
                     .ragged_batch(BATCH_SIZE, drop_remainder = True)
                     .map(resizing, num_parallel_calls = AUTO)
                     .map(dict_to_tuple, num_parallel_calls = AUTO)
                     .prefetch(AUTO))

    valid_loader = tf.data.Dataset.from_tensor_slices((valid_img_paths, valid_classes, valid_bboxes))
    valid_dataset = (valid_loader
                     .map(load_ds, num_parallel_calls = AUTO)
                     .ragged_batch(BATCH_SIZE, drop_remainder = True)
                     .map(resizing, num_parallel_calls = AUTO)
                     .map(dict_to_tuple, num_parallel_calls = AUTO)
                     .prefetch(AUTO))

    test_loader = tf.data.Dataset.from_tensor_slices((test_img_paths, test_classes, test_bboxes))
    test_dataset = (test_loader
                    .map(load_ds, num_parallel_calls = AUTO)
                    .ragged_batch(BATCH_SIZE, drop_remainder = True)
                    .map(resizing, num_parallel_calls = AUTO)
                    .map(dict_to_tuple, num_parallel_calls = AUTO)
                    .prefetch(AUTO))

    # Create model
    print("Creating YOLOv8 model...")
    model, callbacks = create_yolo_model()
    
    # Train model
    print("Starting training...")
    history = train_model(model, train_dataset, valid_dataset, callbacks)
    
    # Evaluate model
    print("Evaluating model...")
    model.evaluate(test_dataset)
    
    # Load best weights and visualize predictions
    print("Loading best weights and generating predictions...")
    model.load_weights('/kaggle/working/yolo_acne_detection.h5')
    visualize_predict_detections(model, dataset = test_dataset, bounding_box_format="xyxy")
    
    print("Training pipeline completed!")

if __name__ == "__main__":
    main()
