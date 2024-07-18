import express, { Request, Response, Router } from "express";

const router: Router = express.Router();

import Segment, { ISegment } from "@Models/segment";
import { LOGGER, RouteNotImplemented } from "@Utils";
import path from "path";
import { CONFIG } from "@/app";

// Retrieve thumbnail function
/**
 * This function retrieves a thumbnail for a segment based on the segment's ID and file name.
 * @param req The request object containing the segment ID and file name.
 * @param res The response object containing the thumbnail image.
 */
const retrieveThumbnail = async (req: Request, res: Response) => {
	const { id, fileName } = req.params;
	try {
		
		// Check if segment exists
		const segmentExists = await Segment.exists({
			extractedFrom: id,
			frameFiles: { $in: [fileName] },
		});

		if (!segmentExists) {
			res.status(404).json({ message: "Segment not found" });
			return;
		}

		// Construct file path
		const frameImagePath = path.join(CONFIG.PROCESSED_DATASET_PATH, id, fileName);

		// Send file
		res.status(200).sendFile(frameImagePath);
	} catch (err) {
		// Log error
		LOGGER.warn(`/segments Error fetching segments ${err}`);
		// Send error response
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Assign function to router
router
	.route("/segment/:id/:fileName")
	.get(retrieveThumbnail)
	.all(RouteNotImplemented);

// Export router
export default router;

