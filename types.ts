// FIX: Removed self-import of 'KnownFace' which was causing a conflict as the type is defined within this file.
export type UserRole = 'admin' | 'staff';

export interface User {
  id: number;
  username: string;
  role: UserRole;
}

export type CameraStatus = 'online' | 'offline';

export interface Camera {
  id: number;
  name: string;
  location: string;
  status: CameraStatus;
}

export interface KnownFace {
  id: number;
  name: string;
  tag: 'watchlist' | 'banned' | 'vip';
  notes: string;
  imageUrls: string[];
  descriptors?: Float32Array[];
  imageFile?: File; // For handling file uploads
}

export interface Detection {
  id: number;
  face: KnownFace;
  camera: Camera;
  snapshotUrl: string;
  confidence: number;
  timestamp: Date;
}

export interface UnknownFace {
  id: number;
  snapshotUrl: string;
  timestamp: Date;
}

export type Theme = 'light' | 'dark';

export type Page = 'Dashboard' | 'Face Gallery' | 'Detection History' | 'Unknown Faces' | 'Settings';

export interface AlertData {
  face: KnownFace;
  confidence: number;
}