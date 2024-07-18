/**
 * Handles the search routes.
 * - /search: searches for segments based on tags, page and limit.
 * - /tags: returns all distinct tags.
 */
import Segment, { ISegment } from "@Models/segment";
import { TagSearchParam } from "@Types";
import { RouteNotImplemented } from "@Utils";
import express, { Request, Response, Router } from "express";

const router: Router = express.Router();

/**
 * Processes the search query.
 * @param req The request object.
 * @param res The response object.
 */
const processSearchQuery = async (req: Request, res: Response) => {
	// Parsing tags as an array of strings
	const tagsArray = req.query.tags ? (req.query.tags as string).split(",") : null;
	let params: TagSearchParam = {
		tags: tagsArray,
		page: parseInt((req.query.page as string) ?? "1"),
		limit: parseInt((req.query.limit as string) ?? "10"),
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
		? await Segment.countDocuments({ tokens: { $all: tagsArray } })
		: await Segment.countDocuments();

	let result = filteredData.map((segment: any) => {
		(segment as any).videoplayerUrl = `/video/${segment.extractedFrom}/stream`;
		return segment;
	});
	res.status(200).json({
		results: result,
		page: params.page,
		limit: params.limit,
		totalResults: totalResults,
	});
};

/**
 * Returns all distinct tags.
 *
 * @param req The request object.
 * @param res The response object.
 */
const getTags = async (req: Request, res: Response) => {
	let tags = await Segment.distinct("tokens");
	res.status(200).json(tags);
};

router.route("/search").get(processSearchQuery).all(RouteNotImplemented);

router.route("/tags").get(getTags).all(RouteNotImplemented);

export default router;