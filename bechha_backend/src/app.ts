// This file initializes the application and starts the REST API.
// It loads the configuration from the environment variables and the .env file.
// It connects to the MongoDB database and starts the REST API.
// It also imports the data from the dataset folder and the processed dataset folder.

import { connectToDatabase, LOGGER, processDataFolder } from "@Utils";
import "@/services/restService";
import path from "path";

import dotenv from "dotenv";
import { AppConfig, DRESsubmit } from "@Types";

// Load the configuration from the environment variables and the .env file
export const CONFIG = (() => {
	let raw = dotenv.config().parsed as unknown as AppConfig;
	let config = {
		// The host where the REST API is running
		HOST: raw.HOST || "localhost",
		// The port where the REST API is running
		PORT: Number(raw.PORT) || 3000,
		// The MongoDB URI to connect to the database
		MONGODB_URI: raw.MONGODB_URI || "mongodb://localhost/mydb",
		// The path to the dataset folder
		DATASET_PATH: path.resolve(raw.DATASET_PATH),
		// The path to the processed dataset folder
		PROCESSED_DATASET_PATH: path.resolve(raw.PROCESSED_DATASET_PATH),
		// The DRES username
		DRES_USERNAME: raw.DRES_USERNAME || "",
		// The DRES password
		DRES_PASSWORD: raw.DRES_PASSWORD || "",
	};

	// Log the loaded configuration
	LOGGER.info("Loaded the following configuration: " + JSON.stringify(config, null, 2));

	return config;
})();

// Import the REST API service
import REST_API from "@/services/restService";

// Import the functions to import the data from the dataset folders
import { parseUnprocessedData } from "@Services/unprocessedDataImporter";
import { parseProcessedData } from "@Services/processedDataImporter";
import axios from "axios";





// Connect to the MongoDB database and start the REST API
(async () => {
	await connectToDatabase(CONFIG.MONGODB_URI);
	REST_API(CONFIG.PORT);

	// Import the data from the dataset folder
	await processDataFolder(CONFIG.DATASET_PATH, parseUnprocessedData);

	// Import the data from the processed dataset folder
	await processDataFolder(CONFIG.PROCESSED_DATASET_PATH, parseProcessedData);

	// Log that the data importing is finished
	LOGGER.info(`Finished importing data`);
})();
