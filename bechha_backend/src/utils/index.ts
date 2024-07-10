import fs from "fs";
import path from "path";
import { LOGGER } from "@/app";

function createPathIfNone(path: string) {
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path);
		LOGGER.info(`created ${path}`);
	}
}

export function createUploadsFolderIfNone() {
	createPathIfNone(path.join(__dirname, "..", "..", "uploads"));
	createPathIfNone(path.join(__dirname, "..", "..", "uploads", "videos"));
	createPathIfNone(path.join(__dirname, "..", "..", "uploads", "json"));
	createPathIfNone(path.join(__dirname, "..", "..", "uploads", "thumbnails"));
	createPathIfNone(path.join(__dirname, "..", "..", "uploads", "frames"));
}

export function extractIdFromName(filename: string): string {
	const match = filename.match(/^([^\.]+)/);
	return match ? match[1] : filename;
}

// export function calcSegmentFromVideoTransitions(
// 	video: Video,
// 	transitions: Transition[]
// ): SegmentInfo {

// }
