import { LOGGER } from "@/app";
import express, { NextFunction, Request, Response, Router } from "express";
import fs from "fs";
import path from "path";

const router: Router = express.Router();

router.route("/videoplayer/:id").get((req: Request, res: Response) => {
	const { id } = req.params;
	const videoDirectory = path.join(__dirname, "../../uploads/videos");
	const videoPath = path.join(videoDirectory, `${id}.mp4`);

	fs.stat(videoPath, (err, stats) => {
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
		const stream = fs.createReadStream(videoPath, { start, end });
		stream.on("open", () => stream.pipe(res));
		stream.on("error", (streamErr) => {
			LOGGER.warn(`/videoplayer/:id Error streaming video ${streamErr}`);
			res.end(streamErr);
		});
	});
});

export default router;