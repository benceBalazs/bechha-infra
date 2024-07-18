import { extractIdFromName, LOGGER, readJsonFile } from "@Utils";
import { promises as fs } from "fs";
import VideoInfo, { IVideoInfo } from "@Models/videoInfo";
import Video, { IVideo } from "@Models/video";
import path from "path";

/**
 * Parses the unprocessed data from a folder, extracts the video info and saves it to the database.
 * @param {string} folder - The folder containing the unprocessed data.
 */
export async function parseUnprocessedData(folder: string) {
	// Log the start of the import process
	LOGGER.info(`Importing video data from "${folder}"`);

	// Get the list of files in the folder
	const files = await fs.readdir(folder);
	
	// Find the info file
	const infoFile = files.find((file) => file.endsWith(".json"));
	const id = infoFile ? extractIdFromName(infoFile) : null;

	// If no info file is found, log an error and return
	if (!id) {
		LOGGER.error(`Unable to parse .json in ${folder}`);
		return;
	}

	// Read the video info from the file
	const jsonData = await readJsonFile(path.join(folder, `${id}.info.json`));
	
	// Create a new VideoInfo object with the extracted data
	const videoInfo = new VideoInfo({ basedOn: id, ...jsonData });

	// Check if the video info already exists in the database
	let exists = await VideoInfo.exists({ basedOn: id });
	if (exists) {
		// If it exists, log a message
		LOGGER.info(`VideoInfo already exists in database: ${id}`);
	} else {
		// If it doesn't exist, save it to the database
		LOGGER.info(`Inserting VideoInfo in database: ${id}`);
		await videoInfo.save();
	}

	// Find the video file
	const videoFile = files.find((file) => file.endsWith(`${id}.mp4`));
	if (videoFile) {
		// If the video file is found, create a new Video object with the extracted data
		const video = new Video({
			datasetId: id,
			path: path.join(folder, videoFile),
			filename: videoFile,
		});

		// Check if the video already exists in the database
		exists = await Video.exists({ datasetId: id });
		if (exists) {
			// If it exists, log a message
			LOGGER.info(`Video already exists in database: ${id}`);
		} else {
			// If it doesn't exist, save it to the database
			LOGGER.info(`Inserting Video in database: ${id}`);
			await video.save();
		}
	}

	// Return
	return;
}

