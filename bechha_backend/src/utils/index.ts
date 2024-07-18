import { Dirent, promises as fs } from "fs";
import mongoose from "mongoose";
import winston from "winston";

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

/**
 * A function to extract an ID from the given filename.
 *
 * @param {string} filename - The filename from which to extract the ID.
 * @return {string} The extracted ID.
 */
export function extractIdFromName(filename: string): string {
	const match = filename.match(/^([^\.]+)/);
	return match ? match[1] : filename;
}

/**
 * Splits a filename into its components and extracts the ID and frame index.
 *
 * @param {string} filename - The filename to split.
 * @return {{ id: string, frameIndex: string }} An object containing the ID and frame index.
 */
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

/**
 * Parses a time string in the format "HH:MM:SS.MS" and returns the corresponding
 * number of milliseconds.
 *
 * @param {string} time - The time string to parse.
 * @return {number} The number of milliseconds.
 */
export function parseTime(time: string): number {
	const [hours, minutes, seconds] = time.split(":");
	const [secs, ms] = seconds.split(".");
	return (
		parseInt(hours) * 3600000 + parseInt(minutes) * 60000 + parseInt(secs) * 1000 + parseInt(ms)
	);
}

/**
 * Reads the contents of a directory asynchronously.
 *
 * @param {string} directoryPath - The path of the directory to read.
 * @return {Promise<string[]>} A promise that resolves to an array of file names in the directory.
 * @throws {Error} If there is an error reading the directory.
 */
export async function readDirectoryContents(directoryPath: string): Promise<string[]> {
	try {
		return await fs.readdir(directoryPath);
	} catch (error) {
		LOGGER.error(`Error reading directory: ${error}`);
		throw error;
	}
}

/**
 * Reads a JSON file from the given file path and returns its content as a JavaScript object.
 *
 * @param {string} filePath - The path to the JSON file.
 * @return {Promise<any>} A promise that resolves to the parsed JSON object, or rejects with an error if the file cannot be read or parsed.
 */
export async function readJsonFile(filePath: string): Promise<any> {
	try {
		const data = await fs.readFile(filePath, "utf8");
		return JSON.parse(data);
	} catch (error) {
		LOGGER.error(`Error reading JSON file: ${error}`);
		throw error;
	}
}

/**
 * Filters tokens from a description string based on certain criteria.
 *
 * @param {string} description - The input description string to filter tokens from.
 * @return {string[]} An array of filtered tokens from the description string.
 */
export function filterTokens(description: string): string[] {
	const bindingWords = new Set([
		"",
		" ",
		"and",
		"the",
		"with",
		"of",
		"in",
		"on",
		"for",
		"to",
		"is",
	]);

	let filter_predicate = (word: string) =>
		// Ignore common binding words
		!bindingWords.has(word) &&
		// Ignore single characters
		word.length > 1 &&
		// Ignore numbers
		!/^\d+$/.test(word) &&
		// Ignore single letters
		!/^[a-zA-Z]$/.test(word) &&
		// Ignore whitespace
		!/^[^\S\r\n]*$/.test(word);

	return description
		.split(" ")
		.map((word) => word.toLowerCase().trim())
		.filter(filter_predicate)
		.map((word) => word.replace(/^[^a-zA-Z\u0080-\u024F]+|[^a-zA-Z\u0080-\u024F]+$/g, ""))
		.filter(filter_predicate);
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

import { Request, Response } from "express";
import path from "path";

/**
 * Sends a 405 status code to the client indicating that the requested route is not implemented.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {void} This function does not return anything.
 */
export const RouteNotImplemented = (req: Request, res: Response) => {
	res.sendStatus(405);
};

/**
 * Processes the folders in a given directory asynchronously.
 *
 * @param {string} directoryPath - The path of the directory to process.
 * @param {(folder: string) => Promise<void>} predicate - A function to apply to each folder.
 * @return {Promise<void>} A promise that resolves when all folders are processed.
 */
export const processDataFolder = async (
	directoryPath: string,
	predicate: (folder: string) => Promise<void>
) => {
	let datasetFolders = (await fs.readdir(directoryPath, { withFileTypes: true }))
		.filter((dirent: Dirent) => dirent.isDirectory() && /^\d+$/.test(dirent.name))
		.map((dirent) => dirent.name)
		.map((folder) => predicate(path.join(directoryPath, folder)));

	await Promise.allSettled(datasetFolders);
};
