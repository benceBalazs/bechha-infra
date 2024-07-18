// src/lib/types.ts
export enum CardType {
  ContentSearch,
  Browse
}

export interface SearchResultDetail {
  fileName: string,
  extractedFrom: string,
  starting_frame: number,
  ending_frame: number,
  starting_time: number,
  ending_time: number,
  frames: number,
  duration: number,
  frameUrl: string,
  description: string,
  tokens: string[],
  category: string[]
}

export interface SearchResult {
    results: SearchResultDetail[],
    page: number,
    limit: number,
    totalResults: number
}

export interface Video {
  id: string;
  title: string;
  description: string;
  tags: string[];
  duration: number;
  uploadDate: number;
  videoUrl: string;
}

export interface Task {
  id: string;
  videoID: string;
  status: string;
  timestamps: {
      upload: number;
      run: number;
      finished: number | null;
  };
}
