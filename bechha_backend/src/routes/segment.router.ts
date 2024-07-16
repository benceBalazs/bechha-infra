import express, { NextFunction, Request, Response, Router } from "express";

const router: Router = express.Router();

import Segment, { ISegment } from "@Models/segment";
import { LOGGER } from "@Utils";
// import { promises as fs } from "fs";
import path from "path";
import { CONFIG } from "@/app";

// thumbnail
router
	.route("/segment/:id/:fileName")
	.get(async (req: Request, res: Response) => {
		const { id, fileName } = req.params;
		try {
			
			const segmentExists = await Segment.exists({
				extractedFrom: id,
				frameFiles: { $in: [fileName] },
			});

			if (!segmentExists) {
				res.status(404).json({ message: "Segment not found" });
				return;
			}

			const frameImagePath = path.join(CONFIG.PROCESSED_DATASET_PATH, id, fileName);

			res.status(200).sendFile(frameImagePath);
		} catch (err) {
			LOGGER.warn(`/segments Error fetching segments ${err}`);
			res.status(500).json({ error: "Internal Server Error" });
		}
	})
	.all((req: Request, res: Response) => {
		res.sendStatus(405);
	});

export default router;
