// src/lib/ApiConnector.ts
import type { SearchResult } from './types';
import { mockApi } from './MockApi';

const USE_MOCK_API = false;

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

    async search(tags: string[], page: number = 1, limit: number = 10): Promise<SearchResult> {
        if (USE_MOCK_API) {
            return mockApi.search(tags, page, limit);
        }
        const url = `${this.baseUrl}/search?tags=${tags.join(',')}&page=${page}&limit=${limit}`;
        return this.fetchApi<SearchResult>(url);
    }

    getVideoStream(videoId: string): string {
        if (USE_MOCK_API) {
            return mockApi.getVideoStream(videoId);
        }
        return `${this.baseUrl}/video/${videoId}/stream`;
    }

    async getVideoMetadata(videoId: string): Promise<unknown> {
        if (USE_MOCK_API) {
            return mockApi.getVideoMetadata(videoId);
        }
        const url = `${this.baseUrl}/video/${videoId}/metadata`;
        return this.fetchApi<unknown>(url);
    }

    async getVideoInfo(videoId: string): Promise<unknown> { // Adjust the type as needed
        if (USE_MOCK_API) {
            return mockApi.getVideoInfo(videoId);
        }
        const url = `${this.baseUrl}/video/${videoId}/videodata`;
        return this.fetchApi<unknown>(url); // Adjust the type as needed
    }

    async downloadVideo(videoId: string): Promise<Blob> {
        if (USE_MOCK_API) {
            return mockApi.downloadVideo(videoId);
        }
        const url = `${this.baseUrl}/video/${videoId}/video`;
        const response = await this.fetchApi(url, {}) as any;
        if (!response.ok) {
            throw new Error(`Error downloading video from ${url}: ${response.statusText}`);
        }
        return response.blob();
    }

    getThumbnail(frameUrl: string): string {
        if (USE_MOCK_API) {
            return mockApi.getThumbnail(frameUrl);
        }
        return `${this.baseUrl}/${frameUrl}`;
    }

    async getTags(): Promise<string[]> {
        if (USE_MOCK_API) {
            return mockApi.getTags();
        }
        const url = `${this.baseUrl}/tags`;
        return this.fetchApi<string[]>(url);
    }

    async checkApiStatus(): Promise<boolean> {
        if (USE_MOCK_API) {
            return mockApi.checkApiStatus();
        }
        const url = `${this.baseUrl}/api`;
        const response = await fetch(url);
        return response.ok;
    }
}

const apiConnector = new ApiConnector('http://localhost:3000');
export default apiConnector;
