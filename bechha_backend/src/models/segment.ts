import mongoose, { Document, Schema } from "mongoose";
export interface ISegment extends Document {
    fileName: string;
    extractedFrom: string;
    starting_frame: number;
    ending_frame: number;
    starting_time: number;
    ending_time: number;
    frames: number;
    duration: number;
    frameUrl: string;
    frameFiles: string[];
    description: string;
    tokens: string[];
    category: string[];
}

export const Segment: Schema = new Schema({
    fileName:{ type: String, required: true },
	extractedFrom: { type: String, required: true },
	starting_frame: { type: Number, required: true },
    ending_frame: { type: Number, required: true },
    starting_time: { type: Number, required: true },
    ending_time: { type: Number, required: true },
    frames: { type: Number, required: true },
    duration: { type: Number, required: true },
    frameUrl: { type: String, required: true },
    frameFiles: { type: [String], required: true },
    description: { type: String, required: true },
    tokens: { type: [String], required: true },
    category: { type: [String], required: true },
});

export default mongoose.model<ISegment>('Segment', Segment);