import { connectToDatabase, LOGGER } from "@Utils";
import "@/services/restService";
import path from "path";

import dotenv from "dotenv";
import { AppConfig } from "@Types";

export const CONFIG = (() => {
	let raw = dotenv.config().parsed as unknown as AppConfig;
	let config = {
		HOST: raw.HOST || "localhost",
		PORT: Number(raw.PORT) || 3000,
		MONGODB_URI: raw.MONGODB_URI || "mongodb://localhost/mydb",
		DATASET_PATH: path.resolve(raw.DATASET_PATH),
		PROCESSED_DATASET_PATH: path.resolve(raw.PROCESSED_DATASET_PATH),
	};

	LOGGER.info("Loaded the following configuration: " + JSON.stringify(config, null, 2));
	return config;
})();

// createUploadsFolderIfNone();

import REST_API from "@/services/restService";
import { parseUnprocessedData } from "@Services/unprocessedDataImporter";
import { parseProcessedData } from "@Services/processedDataImporter";

(async () => {
	await connectToDatabase(CONFIG.MONGODB_URI);
	REST_API(CONFIG.PORT);
	await parseUnprocessedData(path.join(CONFIG.DATASET_PATH, "00100"));
	await parseProcessedData(path.join(CONFIG.PROCESSED_DATASET_PATH, "00100"));
})();
