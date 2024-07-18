import mongoose, { Schema, Document } from "mongoose";

/**
 * The schema for storing video info.
 * 
 * @property {string} basedOn - The identifier of the video.
 * @property {string | undefined} extractor - The extractor used to extract the video info.
 * @property {Date | string | undefined} upload_date - The date the video was uploaded.
 * @property {number | undefined} height - The height of the video.
 * @property {number | null | undefined} like_count - The number of likes the video has.
 * @property {number | undefined} duration - The duration of the video.
 * @property {string | undefined} fulltitle - The full title of the video.
 * @property {string | undefined} id - The unique identifier of the video.
 * @property {number | null | undefined} view_count - The number of views the video has.
 * @property {any | undefined} playlist - The playlist the video belongs to.
 * @property {string | undefined} title - The title of the video.
 * @property {string | undefined} _filename - The filename of the video.
 * @property {number | null | undefined} abr - The average bitrate of the video.
 * @property {number | null | undefined} playlist_index - The index of the video in the playlist.
 * @property {number | undefined} width - The width of the video.
 * @property {number | null | undefined} comment_count - The number of comments on the video.
 * @property {string | undefined} uploader_url - The URL of the video's uploader.
 * @property {number | null | undefined} fps - The frames per second of the video.
 * @property {number | null | undefined} stretched_ratio - The stretched ratio of the video.
 * @property {string | undefined} thumbnail - The URL of the video's thumbnail.
 * @property {string | undefined} webpage_url_basename - The basename of the video's webpage URL.
 * @property {string | undefined} acodec - The audio codec of the video.
 * @property {string | undefined} display_id - The display ID of the video.
 * @property {string | undefined} description - The description of the video.
 * @property {string | undefined} format - The format of the video.
 * @property {number | undefined} timestamp - The timestamp of the video.
 * @property {string | undefined} uploader - The uploader of the video.
 * @property {string | undefined} format_id - The format ID of the video.
 * @property {string | undefined} uploader_id - The ID of the uploader.
 * @property {any | undefined} subtitles - The subtitles of the video.
 * @property {Array<{url: string, id: string}> | undefined} thumbnails - The thumbnails of the video.
 * @property {string | undefined} license - The license of the video.
 * @property {string | undefined} extractor_key - The extractor key of the video.
 * @property {string | undefined} vcodec - The video codec of the video.
 * @property {number | null | undefined} vbr - The variable bitrate of the video.
 * @property {string | undefined} ext - The extension of the video.
 * @property {string | undefined} webpage_url - The URL of the video's webpage.
 * @property {number | null | undefined} resolution - The resolution of the video.
 */
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
	playlist: Schema.Types.Mixed, 
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

// Create the VideoInfo model from the schema
export default mongoose.model<IVideoInfo>('VideoInfo', VideoInfoSchema);
