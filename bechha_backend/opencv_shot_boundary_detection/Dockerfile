# Use an official Python runtime as a parent image
FROM python:3.8-slim-buster

# Install necessary system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    libjpeg-dev \
    libpng-dev \
    libtiff-dev \
    libavcodec-dev \
    libavformat-dev \
    libswscale-dev \
    libv4l-dev \
    libxvidcore-dev \
    libx264-dev \
    libgtk-3-dev \
    libatlas-base-dev \
    gfortran \
    && rm -rf /var/lib/apt/lists/*

# Install OpenCV and numpy
RUN pip install --upgrade pip
RUN pip install opencv-python-headless numpy

# Set the working directory in the container
WORKDIR /app

# Copy the Python script into the container
COPY detect_shot_boundaries.py /app/detect_shot_boundaries.py

# Set the entrypoint to the Python script
ENTRYPOINT ["python3", "detect_shot_boundaries.py"]
