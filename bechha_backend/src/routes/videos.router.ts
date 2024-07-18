import express, { NextFunction, Request, Response, Router } from "express";
import Video, { IVideo } from "@Models/video";
import { extractIdFromName, RouteNotImplemented } from "@Utils";
import VideoInfo, { IVideoInfo } from "@Models/videoInfo";
import { LOGGER } from "@Utils";
import fs from "fs";
import path from "path";
import { CONFIG } from "@/app";

const router: Router = express.Router();

/**
 * Streams a video for a given video identifier.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {void} This function does not return anything.
 */
const streamVideo = (req: Request, res: Response) => {
	const { id } = req.params;

	const video = path.join(CONFIG.DATASET_PATH, id, `${id}.mp4`);

	fs.stat(video, (err, stats) => {
		if (err) {
			LOGGER.warn(`/videoplayer/:id Error accessing video file ${err}`);
			res.status(404).send("Video not found");
			return;
		}

		const range = req.headers.range;
		const videoSize = stats.size;
		const chunkSize = 10 ** 6; // 1MB (1 * 1e6)
		const start = Number(range?.replace(/\D/g, "")) || 0;
		const end = Math.min(start + chunkSize, videoSize - 1);
		const contentLength = end - start + 1;

		const headers = {
			"Content-Range": `bytes ${start}-${end}/${videoSize}`,
			"Accept-Ranges": "bytes",
			"Content-Length": contentLength,
			"Content-Type": "video/mp4",
		};

		res.writeHead(206, headers);
		const stream = fs.createReadStream(video, { start, end });
		stream.on("open", () => stream.pipe(res));
		stream.on("error", (streamErr) => {
			LOGGER.warn(`/video/:id/stream Error streaming video ${streamErr}`);
			res.end(streamErr);
		});
	});
};

/**
 * Retrieves a video for a given video identifier.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} This function does not return anything.
 */
const retrieveVideo = async (req: Request, res: Response) => {
	try {
		const video = await Video.findOne({ datasetId: req.params.id });

		if (!video) {
			res.status(404).json({ message: "Video not found" });
			return;
		}

		const filePath = path.resolve(video.path);

		if (!fs.existsSync(filePath)) {
			res.status(404).json({ message: "File not found on server" });
			return;
		}

		res.sendFile(filePath);
	} catch (error) {
		res.status(500).json({ message: "An error occurred", error });
		LOGGER.warn(`/video/:id/videodata ${error}`);
	}
};

/**
 * Retrieves video data for a given video identifier.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} This function does not return anything.
 */
const retrieveVideoData = async (req: Request, res: Response) => {
	try {
		const video = await Video.findOne({ datasetId: req.params.id });

		if (!video) {
			res.status(404).json({ message: "Video not found" });
			return;
		}

		res.status(200).json(video);
	} catch (error) {
		res.status(500).json({ message: "An error occurred", error });
		LOGGER.warn(`/video/:id/videodata ${error}`);
	}
};

/**
 * Retrieves metadata for a given video identifier.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} This function does not return anything.
 */
const retrieveMetadata = async (req: Request, res: Response) => {
	try {
		const videoInfo = await VideoInfo.findOne({ basedOn: req.params.id });

		if (!videoInfo) {
			res.status(404).json({ message: "Video not found" });
			return;
		}

		res.json(videoInfo);
	} catch (error) {
		res.status(500).json({ message: "An error occurred", error });
	}
};

// Video stream endpoint
router
	.route("/video/:id/stream")
	.get(streamVideo) // Stream a video
	.all(RouteNotImplemented); // Handle unimplemented methods

// Video retrieval endpoint
router
	.route("/video/:id/video")
	.get(retrieveVideo) // Retrieve a video
	.all(RouteNotImplemented); // Handle unimplemented methods

// Video data endpoint
router
	.route("/video/:id/videodata")
	.get(retrieveVideoData) // Retrieve video data
	.all(RouteNotImplemented); // Handle unimplemented methods

// Video metadata endpoint
router
	.route("/video/:id/metadata")
	.get(retrieveMetadata) // Retrieve video metadata
	.all(RouteNotImplemented); // Handle unimplemented methods

export default router;
