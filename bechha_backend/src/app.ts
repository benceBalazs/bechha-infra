import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "express";
import mainRouter from "@routes/index";
import morgan from "morgan";
import config from "@config/index";
import winston from "winston";
import mongoose from "mongoose";
import { createUploadsFolderIfNone } from "@utils/index";
import createConnectionAsync from "@utils/dbconnectionAsync";
import "@/services/restService";
import "@/services/agenda";

const logFormat = winston.format.combine(
	winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
	winston.format.printf(({ timestamp, level, message }) => {
		if (message instanceof Object) {
			message = JSON.stringify(message, null, 2);
		}
		return `[${level}] ${timestamp} ${message}`;
	})
);

// Console transport with colorization including debug level
const consoleTransport = new winston.transports.Console({
	format: winston.format.combine(
		winston.format.colorize({ all: true }), // Colorize all levels
		logFormat
	),
	level: "debug", // Set console output level to include debug
});

// General Log
const fileTransport = new winston.transports.File({
	dirname: "logs",
	filename: "combined.log",
	format: logFormat,
});

// Error Log
const errorFileTransport = new winston.transports.File({
	level: "error",
	dirname: "logs",
	filename: "combined.log",
	format: logFormat,
});

export const LOGGER = winston.createLogger({
	level: "info",
	transports: [consoleTransport, fileTransport, errorFileTransport],
});

LOGGER.info("Loaded the following configuration: " + JSON.stringify(config, null, 2));

//using the logger and its configured transports, to save the logs created by Morgan

// connect to the video database
mongoose
	.connect(config.mongodb_uri, {})
	.then(() => {
		LOGGER.info(`Successfully connected to the video database ${config.mongodb_uri}`);
	})
	.catch((err) => {
		LOGGER.error(`Error connecting to the video database: ${err}`);
	});
createUploadsFolderIfNone();
// connect to the agenda database
// export const AGENDA_MONGODB_CONNECTION = mongoose.createConnection(config.agenda_mongodb_uri, {});

// Handle connection events
// AGENDA_MONGODB_CONNECTION.on("error", (err) => {
// 	LOGGER.error(`Error connecting to the agenda database: ${err}`);
// });

// AGENDA_MONGODB_CONNECTION.once("open", () => {
// 	LOGGER.info(`Successfully connected to the agenda database ${config.agenda_mongodb_uri}`);
// });

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// })

// (async function () {
// 	try {
// 		await AGENDA.start();
// 		LOGGER.info("Agenda started!");

// 		async function schedulePendingJobs() {
// 			const jobs = await Task.find({ status: "pending" });

// 			for (const job of jobs) {
// 				await AGENDA.schedule(new Date(), "process job", job);
// 				await Task.updateOne({ _id: job._id }, { status: "queued" });
// 			}
// 		}
// 		AGENDA.define("check and process pending jobs", async () => {
// 			LOGGER.info("Checking for pending jobs...");
// 			await schedulePendingJobs();
// 		});

// 		AGENDA.define("process job", async (job: any) => {
// 			const { id, data } = job.attrs;
// 			LOGGER.info(`Processing job ${id} of type ${data.type}`);

// 			// Simulate job processing
// 			await new Promise((resolve) => setTimeout(resolve, 1000));

// 			try {
// 				await Task.updateOne({ _id: id }, { status: "completed" });
// 			} catch (err) {
// 				LOGGER.warn(`Error Processing Tasks ${err}`);
// 			}
// 		});

// 		AGENDA.every("5 seconds", "check and process pending jobs");

// 	} catch (err) {
// 		LOGGER.error(`Agenda could not be started ${err}`);
// 	}
// })();

// const exampleRoutes = require("./routes/exampleRoutes");
// app.use("/api/example", exampleRoutes);

// Start the server
