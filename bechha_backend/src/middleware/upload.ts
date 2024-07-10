import multer from "multer";
import { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { extractIdFromName } from "@utils/index";
import { LOGGER } from "@/app";

const storage = multer.diskStorage({
	destination: function (req: Request, file: Express.Multer.File, cb: any) {
		if (file.mimetype.startsWith("video/")) {
			LOGGER.info(`Created Video File "${file.originalname}"`);
			cb(null, path.join(__dirname, "..", "..", "uploads", "videos"));
		} else if (file.mimetype === "application/json") {
			cb(null, path.join(__dirname, "..", "..", "uploads", "json"));
		} else {
			LOGGER.warn(`Multer found invalid mimetype ${file.mimetype}`);
			cb(new Error("Invalid file type"));
		}
	},
	filename: function (req: Request, file: Express.Multer.File, cb: any) {
		cb(
			null,
			extractIdFromName(file.originalname) + "_" + uuidv4() + path.extname(file.originalname)
		);
	},
});

// Multer file filter to accept only video files and JSON files
const fileFilter = function (req: Request, file: Express.Multer.File, cb: Function) {
	if (file.mimetype.startsWith("video/") || file.mimetype === "application/json") {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

export const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 1024 * 1024 * 500, // 500 MB max file size (adjust as needed)
	},
});
