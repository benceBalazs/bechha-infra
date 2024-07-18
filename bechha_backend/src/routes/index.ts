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
import { LOGGER, RouteNotImplemented } from "@Utils/index";
import axios from "axios";
import { DRESsubmit } from "@Types/index";
import { CONFIG } from "@/app";

// Define a function to get the API status
const getAPIStatus = (req: Request, res: Response) => {
	// Respond with a JSON object containing the status "ok"
	res.status(200).json({ status: "ok" });
};

async function fetchDataWithCookies(
	url: string,
	method: string,
	body: any,
	cookies: string | undefined
): Promise<[string[], any] | undefined> {
	try {
		const response: any = await axios(url, {
			method,
			data: body,
			// Set `withCredentials` to true if you need to send credentials with requests.
			// This is usually needed if you're working with cookies or authentication.
			withCredentials: true,
			// Include `headers` if you need to pass additional headers
			headers: {
				"Content-Type": "application/json",
				Cookie: cookies,
			},
		});

		// Access cookies from the response headers
		const rescookies = response.headers["set-cookie"];

		return [rescookies, response.data];
	} catch (error) {
		LOGGER.error(`Error fetching data: ${error}`);
		return;
	}
}

const submitToDRES = async (submit: DRESsubmit): Promise<void> => {
	try {
		const login_url = "https://vbs.videobrowsing.org/api/v2/login";

		let login_res = await fetchDataWithCookies(
			login_url,
			"POST",
			{
				username: CONFIG.DRES_USERNAME,
				password: CONFIG.DRES_PASSWORD,
			},
			undefined
		);
		const cookie = login_res![0][0];

		const list_url = "https://vbs.videobrowsing.org/api/v2/evaluation/info/list";
		let list_res = (await fetchDataWithCookies(list_url, "GET", undefined, cookie))![1];
		const evaluationId = list_res.find((el: any) => el.name === "IVADL2024").id;
		LOGGER.debug(evaluationId);
		submit.answerSets = submit.answerSets.map((el) => {
			el.taskId = evaluationId;
			return el;
		});

		const submit_url = `https://vbs.videobrowsing.org/api/v2/submit/${evaluationId}`;
		LOGGER.debug(`before submit ${submit}`);
		let submit_res = (await fetchDataWithCookies(submit_url, "POST", submit, cookie))![1];

		LOGGER.info(submit_res);
	} catch (err) {
		LOGGER.error(`Error submitting data: ${err}`);
		return;
	}
};

const submitDataToDRES = async (req: Request, res: Response) => {
	// Get the data from the request body
	const submit = req.body;

	// Call the submitToDRES function with the data and await the result
	const result = await submitToDRES(submit);

	// Send the result back as JSON
	res.json(result);
};
// Add a route to the "/submit" path that handles POST requests and calls the submitDataToDRES function
router.route("/submit").post(submitDataToDRES).all(RouteNotImplemented);

// Add a route to the "/api" path that responds with the API status
router.route("/api").get(getAPIStatus).all(RouteNotImplemented);

// Export the main router
export default router;

// Define a function to handle the POST route for submitting data to DRES
