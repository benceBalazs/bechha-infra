import { ISegment } from "@Models/segment";

export interface AppConfig {
	HOST: string;
	PORT: number;
	MONGODB_URI: string;
	DATASET_PATH: string;
	PROCESSED_DATASET_PATH: string;
}

export class TagSearchParam {
	tags: string[] | null;
	page: number;
	limit: number;
	direction: "desc" | "asc";
	orderBy: keyof ISegment;
}