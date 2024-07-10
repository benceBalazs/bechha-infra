#!/usr/bin/env python3
import sys
import json
import torch
import cv2

def load_yolo_model():
    # Load YOLOv5 model
    model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)
    device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')
    model.to(device)
    return model

def detect_objects(frame, model):
    # Perform object detection
    results = model(frame)

    # Process results
    objects_detected = []
    for obj in results.pandas().xyxy[0].to_dict(orient='records'):
        objects_detected.append({
            "class": obj['name'],
            "confidence": obj['confidence']
        })

    return objects_detected

def process_segments(video_path, segments, model):
    cap = cv2.VideoCapture(video_path)
    objects_in_segments = []

    for i in range(len(segments) - 1):
        start_frame = segments[i]
        end_frame = segments[i + 1] - 1
        cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)

        for frame_idx in range(start_frame, end_frame + 1):
            ret, frame = cap.read()
            if not ret:
                break

            objects_detected = detect_objects(frame, model)
            objects_in_segments.append({
                "frame": frame_idx,
                "objects": objects_detected
            })

    cap.release()
    return objects_in_segments

if __name__ == "__main__":
    config_file = sys.argv[1]

    # Read configuration from JSON file
    with open(config_file, 'r') as f:
        config = json.load(f)

    video_path = config["video_path"]
    segments = config["segments"]

    model = load_yolo_model()
    objects_in_segments = process_segments(video_path, segments, model)

    print(json.dumps(objects_in_segments))