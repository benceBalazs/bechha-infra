import Segment, { ISegment } from "@Models/segment";
import { filterTokens, LOGGER, parseTime, readDirectoryContents, readJsonFile } from "@Utils";
import path from "path";

/**
 * Creates segments from the given scene data.
 *
 * @param {any[]} sceneData - The scene data.
 * @param {string} id - The ID of the segment.
 * @param {string[]} frameFiles - The frame files.
 * @returns {ISegment[]} The created segments.
 */
function createSegmentsFromSceneData(sceneData: any[], id: string, frameFiles: string[]): ISegment[] {
	const segments: ISegment[] = [];

	// Iterate over each scene in the scene data
	for (const scene of sceneData) {
		const frameFile = scene.frame;
		const description = scene.description ? scene.description : "";

		// Create a segment object and push it to the segments array
		const segment = {
			fileName: frameFile,
			extractedFrom: id,
			starting_frame: scene.starting_frame,
			ending_frame: scene.ending_frame,
			starting_time: parseTime(scene.starting_time),
			ending_time: parseTime(scene.ending_time),
			frames: scene.ending_frame - scene.starting_frame,
			duration: parseTime(scene.ending_time) - parseTime(scene.starting_time),
			frameUrl: `segment/${id}/${frameFile}`,
			frameFiles: frameFiles,
			description: description,
			tokens: [scene.category, ...filterTokens(description)],
			category: scene.category,
		} as ISegment;

		segments.push(segment);
	}

	return segments;
}

/**
 * Processes the files in the given directory asynchronously.
 *
 * @param {string} directoryPath - The path of the directory.
 * @returns {Promise<ISegment[]>} A promise that resolves to the processed segments.
 */
async function processFiles(directoryPath: string): Promise<ISegment[]> {
	try {
		const files = await readDirectoryContents(directoryPath);
		const segments: ISegment[] = [];

		// Filter and process scene JSON files
		const sceneFiles = files.filter((file) =>
			file.endsWith("_scenes_descriptions_categories.json")
		);
		for (const sceneFile of sceneFiles) {
			const id = sceneFile.split("_")[0];
			const sceneData = await readJsonFile(path.join(directoryPath, sceneFile));
			const frameFiles = files.filter((file) => file.startsWith(id) && file.endsWith(".jpg"));

			const newSegments = createSegmentsFromSceneData(sceneData, id, frameFiles);
			segments.push(...newSegments);
		}
		return segments;
	} catch (err) {
		LOGGER.warn(`Error processing files ${err}`);
		throw Error(`Cannot create segment! ${err}`);
	}
}

/**
 * Parses the processed data from the given folder asynchronously.
 *
 * @param {string} folder - The folder path.
 * @returns {Promise<void>} A promise that resolves when the data is parsed.
 */
export async function parseProcessedData(folder: string): Promise<void> {
	LOGGER.info(`Importing process data from "${folder}"`);

	// Process files in the folder and get the segments
	let segments = await processFiles(folder);

	// Find existing segments in the database
	const existingSegments = await Segment.find({
		extractedFrom: { $in: segments.map((segment) => segment.extractedFrom) },
		starting_frame: { $in: segments.map((segment) => segment.starting_frame) },
		ending_frame: { $in: segments.map((segment) => segment.ending_frame) },
	}).exec();

	// Filter out segments that already exist in the database
	const segmentsToSave = segments.filter((segment) => {
		return !existingSegments.some((existingSegment) => {
			return (
				existingSegment.extractedFrom === segment.extractedFrom &&
				existingSegment.starting_frame === segment.starting_frame &&
				existingSegment.ending_frame === segment.ending_frame
			);
		});
	});

	// Save the segments that don't already exist in the database
	await Segment.insertMany(segmentsToSave);

	// Log the new segments found
	let res = segmentsToSave.map((segment: ISegment) => {
		return "\t" + segment.fileName;
	});
	if (res.length === 0) {
		LOGGER.info(`No new segments found from ${folder}`);
	} else {
		LOGGER.info(`Found new segments from ${folder}`);
		LOGGER.info("[\n" + res.join(",\n") + "\n]");
	}
}
