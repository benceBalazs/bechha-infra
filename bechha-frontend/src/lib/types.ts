// src/lib/types.ts

export interface SearchResult {
  id: string;
  title: string;
  tags: string[];
  image: string;
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
