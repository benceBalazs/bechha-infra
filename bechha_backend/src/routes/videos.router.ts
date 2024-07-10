import express, { NextFunction, Request, Response, Router } from "express";
import { upload } from "@middleware/upload";
import config from "@config/index";
import Video, { IVideo } from "@models/video";
import { extractIdFromName } from "@utils/index";
import VideoInfo, { IVideoInfo } from "@models/videoInfo";
import { LOGGER } from "@/app";
import fs from "fs";
import path from "path";

import { FrameSlicerTaskInput } from "@T/index";
import AGENDA from "@/services/agenda";

const router: Router = express.Router();

router
	.route("/videos")
	.get((req: Request, res: Response) => {
		res.sendStatus(501);
	})
	.post(
		upload.array("videos", config.max_videos_per_upload),
		async (req: Request, res: Response) => {
			try {
				// Check if any files were uploaded
				if (!req.files || req.files.length === 0) {
					res.status(400).json({ error: "No files were uploaded." });
					return;
				}
				const files = req.files as Express.Multer.File[];
				const videoDocsPromises = files.map(async (file) => {
					if (file.mimetype.startsWith("video/")) {
						const video = new Video({
							datasetId: extractIdFromName(file.originalname),
							filename: file.filename,
							originalFilename: file.originalname,
							path: file.path,
							size: file.size,
							mimetype: file.mimetype,
						});
						const job = await AGENDA.now("FrameSlicer Task", { videoId: file.filename, videoPath: file.path });
						(job.attrs as any).status = 'pending';
						await job.save();
						return await video.save();
					} else if (file.mimetype === "application/json") {
						const jsonData = require(file.path);
						jsonData.videoId = extractIdFromName(file.originalname);
						const videoInfo = new VideoInfo(jsonData);
						return await videoInfo.save();
					} else {
						return Promise.reject(new Error("Unsupported mimetype"));
					}
				});
				const results = await Promise.all(videoDocsPromises);
				res.status(201).json(results);
			} catch (error: any) {
				res.status(500).json({ error: error.message });
				LOGGER.warn(`POST /videos ${error.message}`);
			}
		}
	)
	.all((req: Request, res: Response) => {
		res.sendStatus(405);
	});

router
	.route("/video/:id")
	.get(async (req: Request, res: Response) => {
		try {
			const video = await Video.findOne({ videoId: req.params.id });

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
			LOGGER.warn(`/video/:id ${error}`);
		}
	})
	.all((req: Request, res: Response) => {
		res.sendStatus(405);
	});

export default router;
