import Segment, { ISegment } from "@Models/segment";
import { filterTokens, LOGGER, parseTime, readDirectoryContents, readJsonFile } from "@Utils";
import path from "path";

function createSegmentsFromSceneData(sceneData: any, id: string, frameFiles: string[]): ISegment[] {
	const segments: any[] = [];

	for (const scene of sceneData) {
		const frameFile = scene.frame;

		const description = scene.description ? scene.description : "";

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
		};

		segments.push(segment);
	}

	return segments;
}

async function processFiles(directoryPath: string): Promise<ISegment[]> {
	try {
		const files = await readDirectoryContents(directoryPath);
		const segments: any[] = [];

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

export async function parseProcessedData(folder: string) {
	LOGGER.info(`Importing process data from "${folder}"`);
	let segments = await processFiles(folder);

	const existingSegments = await Segment.find({
		extractedFrom: { $in: segments.map((segment) => segment.extractedFrom) },
		starting_frame: { $in: segments.map((segment) => segment.starting_frame) },
		ending_frame: { $in: segments.map((segment) => segment.ending_frame) },
	}).exec();

	const segmentsToSave = segments.filter((segment) => {
		return !existingSegments.some((existingSegment) => {
			return (
				existingSegment.extractedFrom === segment.extractedFrom &&
				existingSegment.starting_frame === segment.starting_frame &&
				existingSegment.ending_frame === segment.ending_frame
			);
		});
	});

	await Segment.insertMany(segmentsToSave);
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
