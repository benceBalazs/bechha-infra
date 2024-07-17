import { extractIdFromName, LOGGER, readJsonFile } from "@Utils";
import { promises as fs } from "fs";
import VideoInfo, { IVideoInfo } from "@Models/videoInfo";
import Video, { IVideo } from "@Models/video";
import path from "path";

export async function parseUnprocessedData(folder: string) {
	LOGGER.info(`Importing video data from "${folder}"`);

	const files = await fs.readdir(folder);
	const infoFile = files.find((file) => file.endsWith(".json"));
	const id = infoFile ? extractIdFromName(infoFile) : null;

	if (!id) {
		LOGGER.warn(`Unable to parse .json in ${folder}`);
		return;
	}

	const jsonData = await readJsonFile(path.join(folder, `${id}.info.json`));
	LOGGER.debug(jsonData);
	const videoInfo = new VideoInfo({ basedOn: id, ...jsonData });

	let exists = await VideoInfo.exists({ basedOn: id });
	if (exists) {
		LOGGER.info(`VideoInfo already exists in database: ${id}`);
	} else {
		LOGGER.info(`Inserting VideoInfo in database: ${id}`);
		await videoInfo.save();
	}

	const videoFile = files.find((file) => file.endsWith(`${id}.mp4`));
	if (videoFile) {
		const video = new Video({
			datasetId: id,
			path: path.join(folder, videoFile),
			filename: videoFile,
		});

		let exists = await Video.exists({ datasetId: id });
		if (exists) {
			LOGGER.info(`Video already exists in database: ${id}`);
		} else {
			LOGGER.info(`Inserting Video in database: ${id}`);
			await video.save();
		}
	}

	return;
}
