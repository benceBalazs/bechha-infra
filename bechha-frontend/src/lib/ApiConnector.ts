// src/lib/ApiConnector.ts
import type { Video, Task, SearchResult } from './types';
import { mockApi } from './MockApi';

const USE_MOCK_API = true;

class ApiConnector {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async fetchApi<T>(url: string, options: RequestInit = {}): Promise<T> {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Error fetching ${url}: ${response.statusText}`);
        }
        return response.json();
    }

    async search(tags: string[], page: number = 1, limit: number = 10): Promise<SearchResult[]> {
        if (USE_MOCK_API) {
            return mockApi.search(tags, page, limit);
        }
        const url = `${this.baseUrl}/search?tags=${tags.join(',')}&page=${page}&limit=${limit}`;
        return this.fetchApi<SearchResult[]>(url);
    }

    async uploadVideo(videoFile: File): Promise<void> {
        if (USE_MOCK_API) {
            return mockApi.uploadVideo(videoFile);
        }
        const formData = new FormData();
        formData.append('video', videoFile);
        const url = `${this.baseUrl}/videos`;
        await this.fetchApi<void>(url, {
            method: 'POST',
            body: formData
        });
    }

    getVideoStream(videoId: string): string {
        if (USE_MOCK_API) {
            return mockApi.getVideoStream(videoId);
        }
        return `${this.baseUrl}/videoplayer/${videoId}`;
    }

    async getVideoMetadata(videoId: string): Promise<Video> {
        if (USE_MOCK_API) {
            return mockApi.getVideoMetadata(videoId);
        }
        const url = `${this.baseUrl}/video/${videoId}`;
        return this.fetchApi<Video>(url);
    }

    async getTasks(): Promise<Task[]> {
        if (USE_MOCK_API) {
            return mockApi.getTasks();
        }
        const url = `${this.baseUrl}/tasks`;
        return this.fetchApi<Task[]>(url);
    }
}

const apiConnector = new ApiConnector('http://localhost:3000');
export default apiConnector;
