import express, { NextFunction, Request, Response, Router } from "express";
import Video, { IVideo } from "@Models/video";
import { extractIdFromName } from "@Utils";
import VideoInfo, { IVideoInfo } from "@Models/videoInfo";
import { LOGGER } from "@Utils";
import fs from "fs";
import path from "path";

const router: Router = express.Router();

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
