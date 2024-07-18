import express from "express";
import cors from "cors";
import mainRouter from "@Routes";
import morgan from "morgan";
import { LOGGER } from "@Utils";

/**
 * This function sets up the REST API service.
 * It uses the logger and its configured transports to save the logs created by Morgan.
 * @param {number} port - The port on which the service will run.
 * @returns {express.Application} - The Express application object.
 */
const REST_API = (port: number) => {
	// Create a stream to log the Morgan logs
	const morganStream = {
		write: (text: string) => {
			LOGGER.info(text);
		},
	};
	const app = express();
	// Use Morgan to log HTTP requests
	app.use(morgan("combined", { stream: morganStream }));
	// Enable CORS with specific options
	app.use(
		cors({
			origin: "*", // Allow requests from any origin
			methods: ["GET", "POST"], // Allow GET and POST requests
			allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
		})
	);
	// Parse incoming JSON requests
	app.use(express.json());
	// Use the main router for all routes starting with "/"
	app.use("/", mainRouter);
	// Start the server and listen on the specified port
	app.listen(port, () => {
		LOGGER.info(`REST service started on port ${port}`);
	});
	return app;
};

export default REST_API;

