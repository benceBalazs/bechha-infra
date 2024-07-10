import express, { NextFunction, Request, Response, Router } from "express";
import Task, { ITask } from "@models/task";
import { LOGGER } from "@/app";
const router: Router = express.Router();

router
	.route("/tasks")
	.get(async (req: Request, res: Response) => {
		const status = req.query.status as string;

		let filter: any = { "data": { $exists: true } };
		if (status) {
			filter.status = status;
		}

		try {
			const tasks = await Task.find(filter).exec();
			res.json(
				tasks.filter((task)=>task.name != "processJob").map((task) => ({
					videoId: task.data.videoId ?? null,
					taskName: task.name,
					status: task.status,
					lastRunAt: task.lastRunAt,
					lastFinishedAt: task.lastFinishedAt,
					created_at: task.created_at,
				}))
			);
		} catch (err) {
			LOGGER.warn(`/tasks ${err}`);
			res.status(500).json({ error: "An error occurred while fetching tasks" });
		}
	})
	.all((req: Request, res: Response) => {
		res.sendStatus(405);
	});

export default router;
