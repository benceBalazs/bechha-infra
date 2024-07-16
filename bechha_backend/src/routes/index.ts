import express, { NextFunction, Request, Response, Router } from "express";
const router: Router = express.Router();

import videosRouter from "@Routes/videos.router";
router.use("/", videosRouter);

import videoPlayerRouter from "@Routes/videoplayer.router";
router.use("/", videoPlayerRouter);

import searchRouter from "@Routes/search.router";
router.use("/", searchRouter);

import segmentRouter from "@Routes/segment.router";
router.use("/", segmentRouter);

import metadataRouter from "@Routes/metadata.router";
router.use("/", metadataRouter);

import tasksRouter from "unused/tasks.router";
router.use("/", tasksRouter);

router
	.route("/api")
	.get((req: Request, res: Response) => {
		res.status(200).json({ status: "ok" });
	})
	.all((req: Request, res: Response) => {
		res.sendStatus(405);
	});
export default router;
