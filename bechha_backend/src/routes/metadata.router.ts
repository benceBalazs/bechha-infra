import express, { NextFunction, Request, Response, Router } from "express";
import VideoInfo, { IVideoInfo } from "@models/videoInfo";

const router: Router = express.Router();

router
	.route("/metadata/:id")
	.get(async (req: Request, res: Response) => {
		try {
			const videoInfo = await VideoInfo.findOne({ videoId: req.params.id });

			if (!videoInfo) {
				res.status(404).json({ message: "Video not found" });
				return;
			}

            res.json(videoInfo);
		} catch (error) {
			res.status(500).json({ message: "An error occurred", error });
		}
	})
	.all((req: Request, res: Response) => {
		res.sendStatus(405);
    });
    
export default router;