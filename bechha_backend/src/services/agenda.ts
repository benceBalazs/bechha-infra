import { LOGGER } from "@/app";
import config from "@config";
import Agenda from "agenda";
import Task, { ITask } from "@models/task";
import mongoose from "mongoose";

// createConnectionAsync(config.agenda_mongodb_uri, {})
// 	.then((con) => {
// 		AGENDA_MONGODB_CONNECTION = con;
// 		LOGGER.info(`Successfully connected to the agenda database ${config.agenda_mongodb_uri}`);
// 	})
// 	.catch((err) => {
// 		LOGGER.error(`Error connecting to the agenda database: ${err}`);
// 	});

const AGENDA = new Agenda({
	db: { address: config.mongodb_uri, collection: "tasks" },
});

// async function schedulePendingJobs() {
// 	try {
// 		const tasks = await Task.find({ status: "pending" });
// 		LOGGER.info(`Found ${tasks.length} pending jobs`);

// 		for (const task of tasks) {
// 			await AGENDA.schedule(new Date(), "process job", task);
// 			await Task.updateOne({ _id: task._id }, { status: "queued" });
// 			LOGGER.info(`Task ${task._id} scheduled`);
// 		}
// 	} catch (err) {
// 		LOGGER.error(`Error scheduling pending jobs: ${err}`);
// 	}
// }

// AGENDA.define("check and process pending jobs", async () => {
// 	LOGGER.info("Checking for pending jobs...");
// 	await schedulePendingJobs();
// });

// AGENDA.define("process job", async (job: any) => {
// 	const { id, data } = job.attrs;
// 	LOGGER.info(`Processing job ${id} of type ${data.type}`);

// 	switch (data.type) {
// 		case "FrameSlicer Task":
// 			await AGENDA.schedule(new Date(), "FrameSlicer Task", job);
// 			break;
// 		// case "FrameSlicer Task":
// 		// 	await AGENDA.schedule(new Date(), "FrameSlicer Task", job);
// 		// 	break;
// 		default:
// 			LOGGER.warn(`TaskType ${data.type} not valid`);
// 			break;
// 	}
// 	try {
// 		await Task.updateOne({ _id: id }, { status: "completed" });
// 		LOGGER.info(`Job ${id} completed`);
// 	} catch (err) {
// 		LOGGER.warn(`Error Processing Task ${id}: ${err}`);
// 	}
// });

function parseFrameList(stdout: string): Frame[] {
	const frameList: Frame[] = [];
	const lines = stdout.split("\n");

	for (const line of lines) {
		// Assuming frame names are output in format "frame_0001.png", adjust if necessary
		const match = line.match(/frame_\d{4}\.png/);
		if (match) {
			frameList.push({ path: match[0] });
		}
	}

	return frameList;
}

import {
	Frame,
	FrameSlicerTaskInput,
	ShotBoundaryDetectionInput,
	TransNetTaskInput,
	YoloObjectDetectionInput,
} from "@T/index";
import path from "path";
import { mkdir, readdir, writeFile, unlink } from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";
import { createInterface } from "readline";
import { createReadStream } from "fs";
import { extractIdFromName } from "@utils/index";

AGENDA.define<YoloObjectDetectionInput>(
	"YoloObjectDetection Task",
	async (task: any, done: any) => {
		const { videoId, shotBoundaries } = task.attrs.data;
		LOGGER.info(`YoloObjectDetection Task for "${videoId}"`);
		let videoPath = path.join(__dirname, "..", "..", "uploads", "videos");
		const command = `docker run --rm -v ${videoPath}:/video yolo-object-detection /video/${videoId}_config.json`;

		let config = { video_path: `/video/${videoId}`, segments: shotBoundaries };
		let configPath = path.join(videoPath, `${videoId}_config.json`);
		await writeFile(configPath, JSON.stringify(config));
		try {
			const execAsync = promisify(exec);
			const startTime = process.hrtime();
			const { stdout, stderr } = await execAsync(command);
			const elapsed = process.hrtime(startTime);
			(task.attrs.data as any).detectedObjects = JSON.parse(stdout);
			task.attrs.status = "completed";
			LOGGER.info(
				`YoloObjectDetection Task for "${videoId}" in ${elapsed[0]}s ${elapsed[1] / 1000000}ms`
			);
			await task.save();
			await unlink(configPath);
			done();
		} catch (err) {
			LOGGER.warn(`YoloObjectDetection Task has encountered the following error ${err}`);
			done(err);
		}
	}
);

AGENDA.define<ShotBoundaryDetectionInput>(
	"ShotBoundaryDetection Task",
	async (task: any, done: any) => {
		const { videoPath, videoId } = task.attrs.data;
		LOGGER.info(`ShotBoundaryDetection Task for "${videoId}"`);
		const command = `docker run --rm -v ${videoPath}:/video opencv-shotdetection /video/${videoId} 35.0 25.0 5.0`;
		try {
			const execAsync = promisify(exec);
			const startTime = process.hrtime();
			const { stdout, stderr } = await execAsync(command);
			const elapsed = process.hrtime(startTime);
			const res = JSON.parse(stdout);
			(task.attrs.data as any).shotBoundaries = res;
			task.attrs.status = "completed";
			LOGGER.info(
				`ShotBoundaryDetection Task for "${videoId}" in ${elapsed[0]}s ${elapsed[1] / 1000000}ms`
			);
			const job = await AGENDA.now("YoloObjectDetection Task", {
				videoId: videoId,
				videoPath: videoPath,
				shotBoundaries: res,
			});
			(job.attrs as any).status = "pending";
			await job.save();
			await task.save();
			done();
		} catch (err) {
			LOGGER.warn(`ShotBoundaryDetection Task has encountered the following error ${err}`);
			done(err);
		}
	}
);

AGENDA.define<TransNetTaskInput>("TransNet Task", async (task: any, done: any) => {
	const { videoId, framesPath, frames } = task.attrs.data;
	LOGGER.info(`Invoked TransNet Task for "${videoId}"`);
	const command = `docker run --rm -v ${framesPath}:/frames transnet-detector /frames/${videoId}`;

	try {
		const execAsync = promisify(exec);
		const startTime = process.hrtime();
		const { stdout, stderr } = await execAsync(command);
		LOGGER.info(stdout);
		const elapsed = process.hrtime(startTime);
		LOGGER.info(
			`Completed TransNet Task for "${videoId}" in ${elapsed[0]}s ${elapsed[1] / 1000000}ms`
		);
		done();
	} catch (err) {
		LOGGER.warn(`TransNet Task has encountered the following error ${err}`);
		done(err);
	}
});

AGENDA.define<FrameSlicerTaskInput>("FrameSlicer Task", async (task: any, done: any) => {
	const { videoPath, videoId } = task.attrs.data;
	LOGGER.info(`Invoked FrameSlicer Task for "${videoId}"`);
	const outputDir = path.join(
		__dirname,
		"..",
		"..",
		"uploads",
		"frames",
		extractIdFromName(videoId)
	);
	const videosPath = path.join(__dirname, "..", "..", "uploads", "videos");

	// Construct the command to extract frames using FFMPEG
	const command = `docker run --rm --cpus=6 --memory=4g --memory-swap=4g --gpus all -v ${videosPath}:/input -v ${outputDir}:/output linuxserver/ffmpeg -i /input/${videoId} -compression_level 50 -vsync vfr -preset ultrafast /output/frame_%04d.png`;

	try {
		const execAsync = promisify(exec);
		// Execute the command
		const startTime = process.hrtime();
		const { stdout, stderr } = await execAsync(command);
		const elapsed = process.hrtime(startTime);
		const frames = parseFrameList(stdout);

		// const frameFiles = files.filter((file) => file.endsWith('.png'));

		// let frames: Frame[] = [];
		// Filter out only PNG files and create Frame objects
		// for (const file of frameFiles) {
		//     const framePath = path.join(outputDir, file);

		//     // Process each frame file here (example: save to database, perform analysis, etc.)
		//     LOGGER.info(`Processing frame: ${framePath}`);

		//     // Example: Save frame to database or perform any other operation
		// 	// await saveFrameToDatabase(framePath);
		// 	frames.push({ path: path.join(outputDir, file) });
		// }

		(task.attrs.data as any).frames = frames;
		task.attrs.status = "completed";
		LOGGER.info(
			`Completed FrameSlicer Task for "${videoId}" in ${elapsed[0]}s ${elapsed[1] / 1000000}ms`
		);
		await task.save();
		done();
	} catch (err) {
		LOGGER.warn(`FrameSlicer Task has encountered the following error ${err}`);
		done(err);
	}
});

AGENDA.define("processJob", async () => {
	const Task = mongoose.model("Task");

	const taskTypes = ["FrameSlicer Task", "ShotBoundaryDetection Task", "YoloObjectDetection Task"];

	for (const taskType of taskTypes) {
		const tasks = await Task.find({ type: taskType, status: "pending" });
		if (tasks) {
			for (const task of tasks) {
				if (task) {
					task.status = "scheduled";
					await task.save();
					LOGGER.info(`Scheduled ${task.type}`);
					await AGENDA.now(task.type, task.payload);
				}
			}
		}
	}
});

(async function () {
	try {
		await AGENDA.start();
		LOGGER.info("Agenda started!");
		await AGENDA.every("*/5 * * * * *", "processJob");
		await AGENDA.now("ShotBoundaryDetection Task", {
			videoId: "00101_b2b06e87-6a30-47f1-b518-f58f8b7ce5cf.mp4",
			videoPath: path.join(__dirname, "..", "..", "uploads", "videos"),
		} as ShotBoundaryDetectionInput);
		LOGGER.info("Scheduled job check every 5 seconds");
	} catch (err) {
		LOGGER.error(`Agenda could not be started: ${err}`);
	}
	// Gracefully stop the agenda
	process.on("SIGTERM", async () => {
		await AGENDA.stop();
		process.exit(0);
	});
})();

export default AGENDA;
