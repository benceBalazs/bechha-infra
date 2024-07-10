import { LOGGER } from "@/app";
import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
	name: string;
	type: string;
	data: any;
	priority: number;
	shouldSaveResult: boolean;
	nextRunAt: Date | null;
	lastModifiedBy: string | null;
	lockedAt: Date | null;
	lastRunAt: Date | null;
	status: string;
	lastFinishedAt: Date | null;
	created_at: Date;
}

const Task = new Schema({
	name: { type: String, required: true },
	type: { type: String, default: "normal" },
	data: { type: mongoose.Schema.Types.Mixed, required: true },
	priority: { type: Number, default: 0 },
	shouldSaveResult: { type: Boolean, default: false },
	nextRunAt: { type: Date, default: null },
	lastModifiedBy: { type: String, default: null },
	lockedAt: { type: Date, default: null },
	lastRunAt: { type: Date, default: null },
	status: { type: String, default: "pending" },
	created_at: { type: Date, default: Date.now },
	lastFinishedAt: { type: Date, default: null },
});

export default mongoose.model<ITask>("Task", Task);

// let modelPromise: Promise<mongoose.Model<ITask>> | null = null;

// const getTaskModel = (): Promise<mongoose.Model<ITask>> => {
// 	if (!modelPromise) {
// 		modelPromise = new Promise((resolve, reject) => {
// 			try {
// 				const TaskModel = AGENDA_MONGODB_CONNECTION.model<ITask>("Task", Task);
// 				resolve(TaskModel);
// 			} catch (err) {
// 				LOGGER.error(`Error ${err}`);
// 				reject(err);
// 			}
// 		});
// 	}
// 	return modelPromise;
// };

// export default getTaskModel;

// export default AGENDA_MONGODB_CONNECTION.model('Task', Task);
