import cv2
import sys
import json

def detect_shot_boundaries(video_path):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Error opening video file")
        return []
    
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)

    prev_frame = None
    shot_boundaries = []

    for frame_idx in range(frame_count):
        ret, frame = cap.read()
        if not ret:
            break
        
        # Convert frame to grayscale
        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        if prev_frame is not None:
            # Calculate frame difference
            frame_diff = cv2.absdiff(prev_frame, gray_frame)
            diff_mean = frame_diff.mean()
            
            # Define a threshold for shot boundary detection (adjust as needed)
            threshold = 30.0
            
            if diff_mean > threshold:
                # Detected shot boundary at frame_idx
                shot_boundaries.append(frame_idx)
        
        prev_frame = gray_frame
    
    cap.release()
    
    return shot_boundaries

if __name__ == "__main__":
    video_path = sys.argv[1]
    boundaries = detect_shot_boundaries(video_path)
    print(json.dumps(boundaries))
