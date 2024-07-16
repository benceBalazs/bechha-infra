import Segment, { ISegment } from "@Models/segment";
import { LOGGER } from "@Utils";
import express, { NextFunction, Request, Response, Router } from "express";

const router: Router = express.Router();

export class TagSearchParam {
	tags: string[] | null;
	page: number;
	limit: number;
	direction: "desc" | "asc";
	orderBy: keyof ISegment;
}

router
	.route("/search")
	.get(async (req: Request, res: Response) => {
		//localhost:3000/search?page=1&orderBy=00100&direction=desc&limit=10

		// Parsing tags as an array of strings
		const tagsArray = req.query.tags ? (req.query.tags as string).split(",") : null;
		let params: TagSearchParam = {
			tags: tagsArray,
			page: parseInt(req.query.page as string ?? "1"),
			limit: parseInt(req.query.limit as string ?? "10"),
			direction: (req.query.direction as "desc" | "asc") ?? "desc",
			orderBy: (req.query.orderBy as keyof ISegment) ?? "extractedFrom",
		};
		//get all segments from database where the token attribute contains all of the tags
		const filteredData = tagsArray
			? await Segment.find({ tokens: { $all: tagsArray } })
					.select({ _id: 0, frameFiles: 0, __v: 0 })
					.sort({ [params.orderBy]: params.direction })
					.skip((params.page - 1) * params.limit)
					.limit(params.limit)
			: await Segment.find()
					.select({ _id: 0, frameFiles: 0, __v: 0 })
					.sort({ [params.orderBy]: params.direction })
					.skip((params.page - 1) * params.limit)
					.limit(params.limit);

		// get the total number of segments matching the tags
		const totalResults = tagsArray
			? await Segment.countDocuments({ tags: { $all: tagsArray } })
			: await Segment.countDocuments();

		let result = filteredData.map((segment: any) => {
			(segment as any).videoplayerUrl = `/videoplayer/${segment.extractedFrom}`;
			return segment;
		});
		res.status(200).json({
			results: result,
			page: params.page,
			limit: params.limit,
			totalResults: totalResults,
		});
	})
	.all((req: Request, res: Response) => {
		res.sendStatus(405);
	});

export default router;
