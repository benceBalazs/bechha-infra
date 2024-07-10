import express, { NextFunction, Request, Response, Router } from "express";
import { TagSearchParam } from "@T/index";

const router: Router = express.Router();

router
	.route("/search")
	.get((req: Request, res: Response) => {
		// Parsing tags as an array of strings
		const tagsArray = req.query.tags ? (req.query.tags as string).split(",") : [];

		let params: TagSearchParam = {
			tags: tagsArray,
			page: parseInt(req.query.page as string) ?? 1,
			limit: parseInt(req.query.limit as string) ?? 10,
		};

		// // Example: filtering dummy data based on tags
		// const filteredData = dummyData.filter((item) =>
		// 	tagsArray.every((tag) => item.tags.includes(tag))
		// );

		// Example: pagination
		const startIndex = (params.page - 1) * params.limit;
		// const paginatedData = filteredData.slice(startIndex, startIndex + params.limit);

		// res.json({
		// 	results: paginatedData,
		// 	page: params.page,
		// 	limit: params.limit,
		// 	totalResults: filteredData.length,
		// });
	})
	.all((req: Request, res: Response) => {
		res.sendStatus(405);
	});

export default router;