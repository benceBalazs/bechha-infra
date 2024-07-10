// src/lib/MockApi.ts

import type { Video, Task, SearchResult } from './types';

const mockSearchResults: SearchResult[] = [
    { id: '1', title: 'Sample Video 1', tags: ['person', 'bicycle'], image: 'sample1.jpg' },
    { id: '2', title: 'Sample Video 2', tags: ['car'], image: 'sample2.jpg' }
];

const mockTasks: Task[] = [
    { id: '1', videoID: '1', status: 'finished', timestamps: { upload: Date.now(), run: Date.now(), finished: Date.now() } },
    { id: '2', videoID: '2', status: 'running', timestamps: { upload: Date.now(), run: Date.now(), finished: null } }
];

const mockVideo: Video = {
    id: '1',
    title: 'Sample Video 1',
    description: 'This is a sample video',
    tags: ['person', 'bicycle'],
    duration: 120,
    uploadDate: Date.now(),
    videoUrl: 'sample_video.mp4'
};

class MockApi {
    async search(tags: string[], page: number, limit: number): Promise<SearchResult[]> {
        return mockSearchResults.filter(result => tags.some(tag => result.tags.includes(tag)));
    }

    async uploadVideo(videoFile: File): Promise<void> {
        console.log('Mock upload video:', videoFile.name);
    }

    getVideoStream(videoId: string): string {
        return `http://mock-url.com/videoplayer/${videoId}`;
    }

    async getVideoMetadata(videoId: string): Promise<Video> {
        return mockVideo;
    }

    async getTasks(): Promise<Task[]> {
        return mockTasks;
    }
}

export const mockApi = new MockApi();
