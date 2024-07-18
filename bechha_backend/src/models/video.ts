import mongoose, { Document, Schema } from "mongoose";

/**
 * Model for a video.
 *
 * @property {string} datasetId - The identifier of the dataset the video belongs to.
 * @property {string} filename - The name of the video file.
 * @property {string} path - The relative path to the video file.
 */
export interface IVideo extends Document {
	datasetId: string;
	filename: string;
	path: string;
}

// Define the schema for a video
const VideoSchema: Schema = new Schema({
	datasetId: { type: String, required: true }, // The dataset identifier
	filename: { type: String, required: true }, // The video filename
	path: { type: String, required: true }, // The relative path to the video file
});

// Create the Video model from the schema
export default mongoose.model<IVideo>("Video", VideoSchema);

