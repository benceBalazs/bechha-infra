// src/lib/MockApi.ts
import type { Video, Task, SearchResult } from './types';

export const mockApi = {
    search(tags: string[], page: number = 1, limit: number = 10): Promise<SearchResult> {
        return Promise.resolve({
            results: [
                {
                    fileName: 'Sample Video 1',
                    extractedFrom: 'source1',
                    starting_frame: 0,
                    ending_frame: 100,
                    starting_time: 0,
                    ending_time: 10,
                    frames: 100,
                    duration: 10,
                    frameUrl: 'http://localhost:3000/frame1.jpg',
                    description: 'Description 1',
                    tokens: ['token1', 'token2'],
                    category: ['category1']
                },
                {
                    fileName: 'Sample Video 1',
                    extractedFrom: 'source1',
                    starting_frame: 0,
                    ending_frame: 100,
                    starting_time: 0,
                    ending_time: 10,
                    frames: 100,
                    duration: 10,
                    frameUrl: 'http://localhost:3000/frame1.jpg',
                    description: 'Description 1',
                    tokens: ['token1', 'token2'],
                    category: ['category1']
                },
                {
                    fileName: 'Sample Video 1',
                    extractedFrom: 'source1',
                    starting_frame: 0,
                    ending_frame: 100,
                    starting_time: 0,
                    ending_time: 10,
                    frames: 100,
                    duration: 10,
                    frameUrl: 'http://localhost:3000/frame1.jpg',
                    description: 'Description 1',
                    tokens: ['token1', 'token2'],
                    category: ['category1']
                },
                {
                    fileName: 'Sample Video 1',
                    extractedFrom: 'source1',
                    starting_frame: 0,
                    ending_frame: 100,
                    starting_time: 0,
                    ending_time: 10,
                    frames: 100,
                    duration: 10,
                    frameUrl: 'http://localhost:3000/frame1.jpg',
                    description: 'Description 1',
                    tokens: ['token1', 'token2'],
                    category: ['category1']
                },
                {
                    fileName: 'Sample Video 1',
                    extractedFrom: 'source1',
                    starting_frame: 0,
                    ending_frame: 100,
                    starting_time: 0,
                    ending_time: 10,
                    frames: 100,
                    duration: 10,
                    frameUrl: 'http://localhost:3000/frame1.jpg',
                    description: 'Description 1',
                    tokens: ['token1', 'token2'],
                    category: ['category1']
                },
                {
                    fileName: 'Sample Video 1',
                    extractedFrom: 'source1',
                    starting_frame: 0,
                    ending_frame: 100,
                    starting_time: 0,
                    ending_time: 10,
                    frames: 100,
                    duration: 10,
                    frameUrl: 'http://localhost:3000/frame1.jpg',
                    description: 'Description 1',
                    tokens: ['token1', 'token2'],
                    category: ['category1']
                },
                {
                    fileName: 'Sample Video 1',
                    extractedFrom: 'source1',
                    starting_frame: 0,
                    ending_frame: 100,
                    starting_time: 0,
                    ending_time: 10,
                    frames: 100,
                    duration: 10,
                    frameUrl: 'http://localhost:3000/frame1.jpg',
                    description: 'Description 1',
                    tokens: ['token1', 'token2'],
                    category: ['category1']
                },
                {
                    fileName: 'Sample Video 1',
                    extractedFrom: 'source1',
                    starting_frame: 0,
                    ending_frame: 100,
                    starting_time: 0,
                    ending_time: 10,
                    frames: 100,
                    duration: 10,
                    frameUrl: 'http://localhost:3000/frame1.jpg',
                    description: 'Description 1',
                    tokens: ['token1', 'token2'],
                    category: ['category1']
                },
                {
                    fileName: 'Sample Video 1',
                    extractedFrom: 'source1',
                    starting_frame: 0,
                    ending_frame: 100,
                    starting_time: 0,
                    ending_time: 10,
                    frames: 100,
                    duration: 10,
                    frameUrl: 'http://localhost:3000/frame1.jpg',
                    description: 'Description 1',
                    tokens: ['token1', 'token2'],
                    category: ['category1']
                },
                {
                    fileName: 'Sample Video 1',
                    extractedFrom: 'source1',
                    starting_frame: 0,
                    ending_frame: 100,
                    starting_time: 0,
                    ending_time: 10,
                    frames: 100,
                    duration: 10,
                    frameUrl: 'http://localhost:3000/frame1.jpg',
                    description: 'Description 1',
                    tokens: ['token1', 'token2'],
                    category: ['category1']
                },
            ],
            page: 1,
            limit: 10,
            totalResults: 15
        });
    },

    getVideoStream(videoId: string): string {
        return `No Video available`;
    },

    getVideoMetadata(videoId: string): Promise<Video> {
        return Promise.resolve({
            id: videoId,
            title: 'Sample Video',
            description: 'Sample Description',
            tags: ['tag1', 'tag2'],
            duration: 120,
            uploadDate: Date.now(),
            videoUrl: `http://localhost:3000/mock_videoplayer/${videoId}`
        });
    },

    getVideoInfo(videoId: string): Promise<any> {
        return Promise.resolve({
            _id: { $oid: '6697d8e4627c72c094187c34' },
            datasetId: videoId,
            filename: `${videoId}.mp4`,
            path: `C:\\Users\\thege\\Desktop\\Archiv\\gprojects\\bechha-infra\\bechha_backend\\test_data\\${videoId}\\${videoId}.mp4`,
            __v: 0
        });
    },

    downloadVideo(videoId: string): Promise<Blob> {
        const blob = new Blob(['Mock video content'], { type: 'video/mp4' });
        return Promise.resolve(blob);
    },

    getThumbnail(frame: string): string {
        return `$lib/samples/00100_frame0009.jpg`;
    },

    getTags(): Promise<string[]> {
        return Promise.resolve(['tag1', 'tag2', 'tag3', "tag4", "tag5", "tag6"]);
    },

    checkApiStatus(): Promise<boolean> {
        return Promise.resolve(true);
    },

    getTasks(): Promise<Task[]> {
        return Promise.resolve([
            { id: '1', videoID: '00100', status: 'completed', timestamps: { upload: Date.now(), run: Date.now(), finished: Date.now() } },
            { id: '2', videoID: '00200', status: 'processing', timestamps: { upload: Date.now(), run: Date.now(), finished: null } }
        ]);
    }
};
