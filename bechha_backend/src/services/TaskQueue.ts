import { Queue } from "queue-typescript";
import { Input, Output, Video, Frame, Transition, SegmentFrameInfo, Tag } from "@T/index";

// type Tasks = Task<Input<string>, Output<number>> | Task<Input<number>, Output<boolean>>;

// export class TaskQueue {
// 	task_queue: Queue<Tasks>;
// 	constructor() {
// 		this.task_queue = new Queue<Tasks>();
// 	}
// }



// import path from "path";
// import { mkdir, readdir } from "fs/promises";
// import { exec } from "child_process";
// import { promisify } from "util";
// import task from "@models/task";

// class FrameSlicer implements Task<Input<FrameSlicerTaskInput>, Output<Frame[]>> {
// 	async process(input: Input<FrameSlicerTaskInput>): Promise<Output<Frame[]>> {
// 		let _input = input.in;
// 		let videoPath = _input.videoPath;
// 		let videoId = _input.videoId;
// 		let framesDir = path.join(__dirname, "..", "..", "uploads", "frames", videoId);

// 		// Construct the command to extract frames using FFMPEG
// 		let command = `docker run --rm -v $(pwd):/config linuxserver/ffmpeg -i ${videoPath} ${framesDir}/frame_%04d.png`;

// 		// Promisify exec to use async/await
// 		const execAsync = promisify(exec);

// 		// Execute the command
// 		await execAsync(command);

// 		// Read the frames directory to get the list of generated frames
// 		let files = await readdir(framesDir);

// 		// Filter out only PNG files and create Frame objects
// 		let frames = files
// 			.filter((file) => file.endsWith(".png"))
// 			.map((file) => ({ path: path.join(framesDir, file) } as Frame));

// 		return { out: frames };
// 	}
// }

// class TransNet implements Task<Input<Frame[]>, Output<Transition[]>> {
// 	async process(input: Input<Frame[]>): Promise<Output<Transition[]>> {
// 		let _input = input.in;

// 		// invoke TransNet

// 		return { out: [] };
// 	}
// }

// class CalcSegments implements Task<Input<Transition[]>, Output<SegmentFrameInfo>> {
// 	async process(input: Input<Transition[]>): Promise<Output<SegmentFrameInfo>> {
// 		let _input = input.in;

// 		// Calculate Segments

// 		return {
// 			out: {
// 				starting_frame: 0,
// 				ending_frame: 0,
// 				frames_count: 0,
// 				frames: [], // store Frame
// 			},
// 		};
// 	}
// }

// class Yolo implements Task<Input<SegmentFrameInfo[]>, Output<Tag[]>> {
// 	async process(input: Input<SegmentFrameInfo[]>): Promise<Output<Tag[]>> {
// 		let _input = input.in;

// 		// SegmentFrameInfo
// 		// invoke Yolo
// 		// return Tags with probabilities

// 		return {
// 			out: [],
// 		};
// 	}
// }


import Task, { ITask } from "@models/task";
// JOB_QUEUE.process(async (job) => {
// 	// Process the job
// 	console.log(`Processing job ${job.id} of type ${job.data.type}`);
// 	// Simulate job processing
// 	await new Promise((resolve) => setTimeout(resolve, 1000));

// 	try {
// 		// Update job status to 'completed'
// 		await Task.updateOne({ _id: job.data._id }, { status: "completed" });
// 	} catch (err) {
// 		console.error(err);
// 	}
// });
