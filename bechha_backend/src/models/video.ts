import mongoose, { Document, Schema } from "mongoose";
export interface IVideo extends Document {
	datasetId: string;
	filename: string;
	path: string;

}

const VideoSchema: Schema = new Schema({
	datasetId: { type: String, required: true },
	filename: { type: String, required: true },
	path: { type: String, required: true },
});

export default mongoose.model<IVideo>("Video", VideoSchema);
