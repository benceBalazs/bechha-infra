import express, { NextFunction, Request, Response, Router } from "express";
const router: Router = express.Router();

import videosRouter from "@routes/videos.router";
router.use("/", videosRouter);

import videoPlayerRouter from "@routes/videoplayer.router";
router.use("/", videoPlayerRouter);

import searchRouter from "@routes/search.router";
router.use("/", searchRouter);

import segmentRouter from "@routes/segment.router";
router.use("/", segmentRouter);

import metadataRouter from "@routes/metadata.router";
router.use("/", metadataRouter);

import tasksRouter from "@routes/tasks.router";
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
