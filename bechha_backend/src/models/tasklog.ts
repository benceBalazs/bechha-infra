import mongoose, { Document, Schema } from "mongoose";
import { IVideo } from '@models/video';

export interface ITaskLog extends Document {
    video: IVideo['_id'];
    noneProcessed: boolean;
    fullyProcessed: boolean;
    hasBoundaries: boolean;
    hasTags: boolean;
    hasHistogram: boolean;
}

// const TaskLog: Schema = new Schema({
//     video: { type: Schema.Types.ObjectId, ref: 'Video', required: true },
//     noneProcessed: { type: Boolean, required: true },
//     fullyProcessed: boolean;
//     hasBoundaries: boolean;
//     hasTags: boolean;
//     hasHistogram: boolean;
// 	extractedFrom: { type: String, required: true },
// 	starting_frame: { type: Number, required: true },
//     ending_frame: { type: Number, required: true },
//     starting_time: { type: Number, required: true },
//     ending_time: { type: Number, required: true },
//     frames: { type: Number, required: true },
//     duration: { type: Number, required: true },
//     tags: { type: [String], required: true },
// });

// export default mongoose.model<ITaskLog>('TaskLog', TaskLog);