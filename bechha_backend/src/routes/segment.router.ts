import express, { NextFunction, Request, Response, Router } from "express";

const router: Router = express.Router();

// Function to generate or retrieve thumbnail URL
async function generateOrRetrieveThumbnail(segment: ISegment): Promise<string> {
	// Logic to generate or retrieve thumbnail URL from a storage location (e.g., file system)

	// Example: Generating a mock thumbnail URL (replace with actual logic)
	const thumbnailUrl = `/thumbnails/${segment._id}.jpg`; // Assuming segment._id is used as unique identifier
	LOGGER.info(`Generating thumbnail /thumbnails/${segment._id}.jpg`);
	return thumbnailUrl;
}

import Segment, { ISegment } from "@models/segment";
import { LOGGER } from "@/app";

router
	.route("/segments")
	.get(async (req: Request, res: Response) => {
		try {
			// Fetch segments from MongoDB
			const segments: ISegment[] = await Segment.find().exec();

			// Prepare response with thumbnails (if not exist, generate and store)
			const response = await Promise.all(
				segments.map(async (segment) => {
					const thumbnailUrl = await generateOrRetrieveThumbnail(segment);
					return {
						video: segment.extractedFrom,
						segment,
						thumbnail_url: thumbnailUrl,
					};
				})
			);

			res.json(response);
		} catch (err) {
			LOGGER.warn(`/segments Error fetching segments ${err}`);
			res.status(500).json({ error: "Internal Server Error" });
		}
	})
	.all((req: Request, res: Response) => {
		res.sendStatus(405);
    });
    
export default router;