# Use an official Python runtime as a parent image
FROM python:3.8-slim-buster

# Set the working directory in the container
WORKDIR /app

# # Install necessary dependencies
# RUN apt-get update && apt-get install -y \
#     libgl1-mesa-glx \
#     && rm -rf /var/lib/apt/lists/*

# Install YOLOv5 and other dependencies
RUN pip install torch torchvision torchaudio
RUN pip install yolov5 opencv-python-headless

# Copy the Python script into the container
COPY yolo_object_detection.py /app/yolo_object_detection.py
# COPY config.json /app/config.json  # Copy the JSON configuration file

# Command to run the script
CMD ["python", "/app/yolo_object_detection.py"]
