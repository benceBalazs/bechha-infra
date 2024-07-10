# Use official TensorFlow Docker image
FROM tensorflow/tensorflow:2.9.1

# Set working directory
WORKDIR /app

# Copy the Python script and model weights to the container
COPY main.py /app/
COPY saved_model.pb /app/

RUN mkdir -p /frames && chmod -R 777 /frames

# Install OpenCV
RUN apt-get update && \
    apt-get install -y python3-opencv

# Entry point
ENTRYPOINT ["python3", "main.py"]