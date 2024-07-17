import fsSync from "fs";
import winston from "winston";

import { promises as fs } from "fs";
import mongoose from "mongoose";

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


function createPathIfNone(path: string) {
	if (!fsSync.existsSync(path)) {
		fsSync.mkdirSync(path);
		LOGGER.info(`created ${path}`);
	}
}

// export function createUploadsFolderIfNone() {
// 	createPathIfNone(path.join(__dirname, "..", "..", "uploads"));
// 	createPathIfNone(path.join(__dirname, "..", "..", "uploads", "videos"));
// 	createPathIfNone(path.join(__dirname, "..", "..", "uploads", "json"));
// 	createPathIfNone(path.join(__dirname, "..", "..", "uploads", "thumbnails"));
// 	createPathIfNone(path.join(__dirname, "..", "..", "uploads", "frames"));
// 	createPathIfNone(path.join(__dirname, "..", "..", "uploads", "segments"));
// }

export function extractIdFromName(filename: string): string {
	const match = filename.match(/^([^\.]+)/);
	return match ? match[1] : filename;
}


export function splitFilename(filename: string): { id: string; frameIndex: string } {
	// Remove the file extension
	const baseName = filename.split(".")[0];

	// Split by underscore
	const parts = baseName.split("_");

	// Extract ID and frame index
	const idPart = parts[0];
	const frameIndexPart = parts[1].replace("frame", "");

	return { id: idPart, frameIndex: frameIndexPart };
}

export function parseTime(time: string): number {
	const [hours, minutes, seconds] = time.split(":");
	const [secs, ms] = seconds.split(".");
	return (
		parseInt(hours) * 3600000 + parseInt(minutes) * 60000 + parseInt(secs) * 1000 + parseInt(ms)
	);
}



export async function readDirectoryContents(directoryPath: string): Promise<string[]> {
	try {
		return await fs.readdir(directoryPath);
	} catch (error) {
		console.error(`Error reading directory: ${error}`);
		throw error;
	}
}

export async function readJsonFile(filePath: string): Promise<any> {
	try {
		const data = await fs.readFile(filePath, "utf8");
		return JSON.parse(data);
	} catch (error) {
		console.error(`Error reading JSON file: ${error}`);
		throw error;
	}
}

export function filterTokens(description: string): string[] {
	const bindingWords = new Set(["-", "a", "and", "the", "with", "of", "in", "on", "for", "to", "is"]);
	return description.split(" ").filter((word) => !bindingWords.has(word.toLowerCase()));
}


/**
 * Connects to the MongoDB database and returns a promise that resolves when
 * the connection is established successfully.
 *
 * @returns A promise that resolves when the connection is established.
 */
export async function connectToDatabase(url: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		mongoose
			.connect(url, {})
			.then(() => {
				LOGGER.info(`Successfully connected to the video database ${url}`);
				resolve();
			})
			.catch((err) => {
				LOGGER.error(`Error connecting to the video database: ${err}`);
				reject(err);
			});
	});
}

import {Request, Response} from "express";
export const RouteNotImplemented = (req: Request, res: Response) => {
	res.sendStatus(405);
};