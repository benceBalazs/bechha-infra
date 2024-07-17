import express, { NextFunction, Request, Response, Router } from "express";
const router: Router = express.Router();

import videosRouter from "@Routes/videos.router";
router.use("/", videosRouter);

import searchRouter from "@Routes/search.router";
router.use("/", searchRouter);

import segmentRouter from "@Routes/segment.router";
router.use("/", segmentRouter);

import tasksRouter from "unused/tasks.router";
import { RouteNotImplemented } from "@Utils/index";
router.use("/", tasksRouter);

const getAPIStatus = (req: Request, res: Response) => {
	res.status(200).json({ status: "ok" });
};

router
	.route("/api")
	.get(getAPIStatus)
	.all(RouteNotImplemented);

export default router;
