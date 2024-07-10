import cv2
import sys
import json

def detect_shot_boundaries(video_path, thresholds):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Error opening video file")
        return []
    
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    prev_frames = [None] * len(thresholds)
    shot_boundaries = set()

    for frame_idx in range(frame_count):
        ret, frame = cap.read()
        if not ret:
            break
        
        # Convert frame to grayscale
        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        for i, threshold in enumerate(thresholds):
            if prev_frames[i] is not None:
                # Calculate frame difference
                frame_diff = cv2.absdiff(prev_frames[i], gray_frame)
                diff_mean = frame_diff.mean()
                
                # Detect shot boundary based on threshold
                if diff_mean > threshold:
                    # Detected shot boundary at frame_idx
                    shot_boundaries.add(frame_idx)
            
            prev_frames[i] = gray_frame
    
    cap.release()
    
    return sorted(shot_boundaries)

def reduce_boundaries(boundaries):
    if not boundaries:
        return []

    # Remove duplicates and sort
    boundaries = sorted(set(boundaries))

    reduced_boundaries = []
    start = boundaries[0]

    for i in range(1, len(boundaries)):
        if boundaries[i] == boundaries[i-1] + 1:
            # If current frame is consecutive to the previous one, skip adding it
            continue
        
        reduced_boundaries.append(start)
        start = boundaries[i]

    # Add the last pair
    reduced_boundaries.append(start)
    
    return reduced_boundaries

if __name__ == "__main__":
    video_path = sys.argv[1]
    thresholds = [float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4])]  # Pass thresholds via command line
    boundaries = detect_shot_boundaries(video_path, thresholds)
    reduced_boundaries = reduce_boundaries(boundaries)
    
    # Deduplicate the resulting boundaries
    deduplicated_boundaries = list(dict.fromkeys(reduced_boundaries))
    
    print(json.dumps(deduplicated_boundaries))
