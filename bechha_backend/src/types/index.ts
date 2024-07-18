import { ISegment } from "@Models/segment";

export interface AppConfig {
	HOST: string;
	PORT: number;
	MONGODB_URI: string;
	DATASET_PATH: string;
	PROCESSED_DATASET_PATH: string;
	DRES_USERNAME: string;
	DRES_PASSWORD: string;
}

export class TagSearchParam {
	tags: string[] | null;
	page: number;
	limit: number;
	direction: "desc" | "asc";
	orderBy: keyof ISegment;
}


export class Answer {
	text: string | null;
	mediaItemName: string; // dataset ID e.g. 00100
	mediaItemCollectionName: string;
	start: number; // milliseconds
	end: number; // milliseconds
}

export class AnswerSet {
	taskId: string; // has to be set accordingly
	taskName: string;
	answers: Answer[]
}

export class DRESsubmit {
	answerSets: AnswerSet[];
}
