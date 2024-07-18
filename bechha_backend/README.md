
# What it is

Bechha_Backend is a backend system that searches and retrieves videos from a video dataset. The dataset consists of a collection of videos, each with a unique identifier and a set of associated tags. The system provides an API for searching videos by labels and retrieving video data.

The system is built with [Node.js](https://nodejs.org/en), [Express](https://expressjs.com/), and [MongoDB](https://www.mongodb.com/). The API is documented with [Postman](https://documenter.getpostman.com/view/14526974/2sA3kSniJU).

# Local Installation and Usage

Ensure you have [Node.js](https://nodejs.org/en) and [MongoDB](https://www.mongodb.com/) installed

Specify an `.env` file of the following schema:

```
HOST=localhost
PORT=3000
MONGODB_URI=mongodb://localhost:27017/videosDB
DATASET_PATH=path/to/the/preprocessed_dataset
PROCESSED_DATASET_PATH=path/to/the/processed_dataset
```

The folder structure of the `dataset` folder and `processed_dataset` are the following:
```
preprocessed_dataset
├── 00100
│   ├── 00100.info.json
│   └── 00100.mp4
├── 00101
│   ├── 00101.info.json
│   └── 00101.mp4
└── ...
```

```
processed_dataset
├── 00100
│   ├── 00100_frame0001.jpg
│   ├── 00100_frame0002.jpg
│   ├── ...
│   └── 00100_scenes_descriptions.json
├── 00101
│   ├── 00101_frame0001.jpg
│   ├── 00101_frame0002.jpg
│   ├── ...
│   └── 00101_scenes_descriptions.json
└── ...
```

To execute the application run `npm run dev`

# Installation via Docker compose

Ensure you have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed and the Docker deamon is running on your system.

Specify your env variables in the `docker-compose.yml` and dont forget to share the folders of the dataset and processed_dataset to the docker environment.



