import os
import shutil
from pymongo import MongoClient

def remove_uploads_folder(folder_path):
    if os.path.exists(folder_path):
        shutil.rmtree(folder_path)
        print(f"Successfully removed the folder: {folder_path}")
    else:
        print(f"The folder {folder_path} does not exist")

def drop_videosDB_database(mongo_uri, db_name):
    try:
        client = MongoClient(mongo_uri)
        client.drop_database(db_name)
        print(f"Successfully dropped the database: {db_name}")
    except Exception as e:
        print(f"An error occurred while dropping the database: {e}")

if __name__ == "__main__":
    # Define the path to the "uploads" folder
    uploads_folder_path = "uploads"

    # Define the MongoDB URI and the database name
    mongo_uri = "mongodb://localhost:27017/"
    db_name = "videosDB"

    # Remove the "uploads" folder and its contents
    remove_uploads_folder(uploads_folder_path)

    # Drop the "videosDB" MongoDB database
    drop_videosDB_database(mongo_uri, db_name)
