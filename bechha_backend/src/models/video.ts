import mongoose, { Document, Schema } from "mongoose";
export interface IVideo extends Document {
	datasetId: string;
	filename: string;
	originalFilename: string;
	path: string;
	size: number;
	mimetype: string;
	uploadDate: Date;
}

const VideoSchema: Schema = new Schema({
	datasetId: { type: String, required: true },
	filename: { type: String, required: true },
	originalFilename: { type: String, required: true },
	path: { type: String, required: true },
	size: { type: Number, required: true },
	mimetype: { type: String, required: true },
	uploadDate: { type: Date, default: Date.now },
});

export default mongoose.model<IVideo>("Video", VideoSchema);
