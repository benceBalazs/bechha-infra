// This file exports the main router of the API. It imports the sub-routers for videos, search and segments.
// It also imports the function to get the API status.

import express, { Request, Response, Router } from "express";

// Create a new router
const router: Router = express.Router();

// Import the videos router and add it to the main router
import videosRouter from "@Routes/videos.router";
router.use("/", videosRouter);

// Import the search router and add it to the main router
import searchRouter from "@Routes/search.router";
router.use("/", searchRouter);

// Import the segments router and add it to the main router
import segmentRouter from "@Routes/segment.router";
router.use("/", segmentRouter);

// Import the function to handle the case when a route is not implemented
import { RouteNotImplemented } from "@Utils/index";

// Define a function to get the API status
const getAPIStatus = (req: Request, res: Response) => {
    // Respond with a JSON object containing the status "ok"
    res.status(200).json({ status: "ok" });
};

// Add a route to the "/api" path that responds with the API status
router.route("/api").get(getAPIStatus).all(RouteNotImplemented);

// Export the main router
export default router;

