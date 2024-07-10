// /**
//  * @param starting_frame start frame index of the segment
//  * @param ending_frame end frame index of the segment
//  * @param starting_time start time of the segment
//  * @param ending_time end time of the segment
//  * @param frames total frames in the segment
//  * @param duration duration in milliseconds between starting and end time
//  * @param tags occuring tags in the segment
//  */
// export class Tag {
//     name: string;
//     probability: number;
// }

// export class Frame {
//     path: string;
// }
// class SegmentInfo {
//     starting_frame: number;
//     ending_frame: number;
//     frames_count: number;
//     frames: Frame[];
//     starting_time: number;
//     ending_time: number;
//     duration: number;
//     fps: number;
//     tags: Tag[];
// }

class Tracking {
    videoId: string;
    noneProcessed: boolean;
    fullyProcessed: boolean;
    hasBoundaries: boolean;
    hasTags: boolean;
    hasHistogram: boolean;
}

export class Video {
    path: string;
}

export class Frame {
    path: string;
}

export class Transition {
    frames: Frame[];
}

export class Tag {
    name: string;
    probability: number;
}

/** 
 * @param starting_frame start frame index of the segment
 * @param ending_frame end frame index of the segment
 * @param frames total frames in the segment
 */ 
export class SegmentFrameInfo {
    starting_frame: number;
    ending_frame: number;
    frames_count: number;
    frames:  Frame[];
}

/** 
 * @param starting_time start time of the segment
 * @param ending_time end time of the segment
 * @param duration duration in milliseconds between starting and end time
 */ 
export class SegmentVideoInfo {
    starting_time: number;
    ending_time: number;
    duration: number;
    fps: number;
}

/** 
 * @param tags occuring tags in the segment
 */ 
export class SegmentTags {
    tags: string[];
}

export type Segment = SegmentFrameInfo & SegmentVideoInfo & SegmentTags;


export interface Task<Input, Output> {
    process(input: Input): Promise<Output>;
}

export interface Input<InputType> {
    in: InputType;
}
  
export interface Output<OutputType> {
    out: OutputType;
}


class Return {
    videoId: string // filename of the video

}

export class FrameSlicerTaskInput {
    videoId: string;
    videoPath: string;
    frames?: Frame[];
} 


export class TransNetTaskInput {
    videoId: string;
    framesPath: string;
    frames?: Frame[];
}

export class ShotBoundaryDetectionInput {
    videoPath: string;
    videoId: string;
}

export class YoloObjectDetectionInput {
    videoId: string;
    videoPath: string;
    shotBoundaries: number[];
}
// list all matching segments ✅

// GET /search?tags=?page=1?limit=10

export class TagSearchParam {
    tags: string[];
    page: number;
    limit: number;
}

// 0-10

// mongoose schema
// export interface SegmentInfo extends Document {
//     extractedFrom: string // video name
//     starting_frame: number
//     ending_frame: number
//     starting_time: number
//     ending_time: number
//     frames: number;
//     duration: number;
//     tags: string[];
// }

// {
//     video: string; // video name
//     segment: SegmentInfo; // SegmentInfo
//     thumbnail_url: string;
// }[]

// click on segment opening a modal
// show actual video metadata (segment_metadata) display video, you know which segment you wanna see
// over the segment player are the segments of the actual video
// on click the segment start and end time has to be changed of the videoplayer (change modal info)



// 
// TagInfo {
//    tagName:cat
//}
// tags: Entry[]

// dog as Entry

// dog 1..=3
// dog 5..=6

// dog dog dog baby dog dog dog

// tagName = dog
// intervals[start, end]

// tagName = dog
// [start, end]