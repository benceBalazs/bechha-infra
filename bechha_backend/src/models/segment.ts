// Defines the schema for the Segment model in MongoDB.
// This schema stores information about a segment of a video.
// The fields are:
// - fileName: the name of the file containing the segment
// - extractedFrom: the name of the video the segment was extracted from
// - starting_frame, ending_frame: the frame numbers of the start and end of the segment
// - starting_time, ending_time: the time of the start and end of the segment in milliseconds
// - frames: the number of frames in the segment
// - duration: the duration of the segment in seconds
// - frameUrl: the URL of the segment's frame image
// - frameFiles: the names of all the frame images in the segment
// - description: a brief description of the segment
// - tokens: a list of tokens describing the segment
// - category: a list of categories describing the segment

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
    // The name of the file containing the segment
    fileName:{ type: String, required: true },
    // The name of the video the segment was extracted from
    extractedFrom: { type: String, required: true },
    // The frame number of the start of the segment
    starting_frame: { type: Number, required: true },
    // The frame number of the end of the segment
    ending_frame: { type: Number, required: true },
    // The time of the start of the segment in milliseconds
    starting_time: { type: Number, required: true },
    // The time of the end of the segment in milliseconds
    ending_time: { type: Number, required: true },
    // The number of frames in the segment
    frames: { type: Number, required: true },
    // The duration of the segment in seconds
    duration: { type: Number, required: true },
    // The URL of the segment's frame image
    frameUrl: { type: String, required: true },
    // The names of all the frame images in the segment
    frameFiles: { type: [String], required: true },
    // A brief description of the segment
    description: { type: String, required: true },
    // A list of tokens describing the segment
    tokens: { type: [String], required: true },
    // A list of categories describing the segment
    category: { type: [String], required: true },
});

// Export the Segment model
export default mongoose.model<ISegment>('Segment', Segment);
