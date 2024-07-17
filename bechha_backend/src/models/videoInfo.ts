import mongoose, { Schema, Document } from "mongoose";

// Define interface for TypeScript type checking
export interface IVideoInfo extends Document {
    basedOn: string;
	extractor?: string;
	upload_date?: string | Date;
	height?: number;
	like_count?: number | null;
	duration?: number;
	fulltitle?: string;
	id?: string;
	view_count?: number | null;
	playlist?: any; // This can be of any type or null
	title?: string;
	_filename?: string;
	abr?: number | null;
	playlist_index?: number | null;
	width?: number;
	comment_count?: number | null;
	uploader_url?: string;
	fps?: number | null;
	stretched_ratio?: number | null;
	thumbnail?: string;
	webpage_url_basename?: string;
	acodec?: string;
	display_id?: string;
	description?: string;
	format?: string;
	timestamp?: number;
	uploader?: string;
	format_id?: string;
	uploader_id?: string;
	subtitles?: any; // This can be of any type
	thumbnails?: { url: string; id: string }[];
	license?: string;
	extractor_key?: string;
	vcodec?: string;
	vbr?: number | null;
	ext?: string;
	webpage_url?: string;
	resolution?: number | null;
}

const VideoInfoSchema: Schema = new Schema({
    basedOn: { type: String, required: true },
	extractor: String,
	upload_date: { type: Date, default: null },
	height: Number,
	like_count: { type: Number, default: null },
	duration: Number,
	fulltitle: String,
	id: String,
	view_count: { type: Number, default: null },
	playlist: Schema.Types.Mixed, // Mixed type for flexibility
	title: String,
	_filename: String,
	abr: { type: Number, default: null },
	playlist_index: { type: Number, default: null },
	width: Number,
	comment_count: { type: Number, default: null },
	uploader_url: String,
	fps: { type: Number, default: null },
	stretched_ratio: { type: Number, default: null },
	thumbnail: String,
	webpage_url_basename: String,
	acodec: String,
	display_id: String,
	description: String,
	format: String,
	timestamp: Number,
	uploader: String,
	format_id: String,
	uploader_id: String,
	subtitles: Schema.Types.Mixed, // Mixed type for flexibility
	thumbnails: [{ url: String, id: String }],
	license: String,
	extractor_key: String,
	vcodec: String,
	vbr: { type: Number, default: null },
	ext: String,
	webpage_url: String,
	resolution: { type: Number, default: null },
});


export default mongoose.model<IVideoInfo>('VideoInfo', VideoInfoSchema);