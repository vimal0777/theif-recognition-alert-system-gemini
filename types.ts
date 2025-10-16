
export type Theme = 'light' | 'dark';

export type Page = 'Dashboard' | 'Face Gallery' | 'Detection History' | 'Unknown Faces' | 'Settings';

export interface User {
    username: string;
    role: 'admin' | 'operator';
}

export interface KnownFace {
    id: number;
    name: string;
    tag: 'banned' | 'watchlist' | 'vip';
    notes: string;
    imageUrls: string[];
}

export interface Camera {
    id: number;
    name: string;
    location: string;
    status: 'online' | 'offline';
}

export interface Detection {
    id: number;
    face: KnownFace;
    camera: Camera;
    snapshotUrl: string;
    confidence: number;
    timestamp: Date;
}

export type AlertData = Detection;
