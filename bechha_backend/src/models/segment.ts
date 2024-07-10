import mongoose, { Document, Schema } from "mongoose";
export interface ISegment extends Document {
    extractedFrom: string
    starting_frame: number
    ending_frame: number
    starting_time: number
    ending_time: number
    frames: number;
    duration: number;
    tags: string[];
}

export const Segment: Schema = new Schema({
	extractedFrom: { type: String, required: true },
	starting_frame: { type: Number, required: true },
    ending_frame: { type: Number, required: true },
    starting_time: { type: Number, required: true },
    ending_time: { type: Number, required: true },
    frames: { type: Number, required: true },
    duration: { type: Number, required: true },
    tags: { type: [String], required: true },
});

export default mongoose.model<ISegment>('Segment', Segment);