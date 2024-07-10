import os
import subprocess

def build_docker_images():
    # Define the folders and commands
    folders_and_commands = {
        "yolo_classification": "docker build -t yolo-object-detection .",
        "opencv_shot_boundary_detection": "docker build -t opencv-shotdetection ."
    }

    # Get the current directory
    current_dir = os.getcwd()

    # Navigate into each folder and execute the command
    for folder, command in folders_and_commands.items():
        folder_path = os.path.join(current_dir, folder)
        
        # Check if the folder exists
        if os.path.exists(folder_path) and os.path.isdir(folder_path):
            print(f"Building Docker image in {folder}...")
            
            # Change directory to the folder
            os.chdir(folder_path)
            
            # Execute the Docker build command
            subprocess.run(command, shell=True, check=True)
            
            # Change directory back to the original
            os.chdir(current_dir)
            
            print(f"Docker image built successfully in {folder}")
        else:
            print(f"Folder '{folder}' not found or is not a directory.")

if __name__ == "__main__":
    build_docker_images()