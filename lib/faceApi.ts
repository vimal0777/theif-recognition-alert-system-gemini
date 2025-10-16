
import type { KnownFace, Detection } from '../types';
import { KNOWN_FACES, RECENT_DETECTIONS, CAMERA } from '../constants';

// Simulate a delay for API calls
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

let faces: KnownFace[] = [...KNOWN_FACES];
let detections: Detection[] = [...RECENT_DETECTIONS];
let nextFaceId = faces.length + 1;
let nextDetectionId = detections.length + 1;

export const getKnownFaces = async (): Promise<KnownFace[]> => {
    await delay(500);
    return [...faces];
};

export const addKnownFace = async (faceData: Omit<KnownFace, 'id'>): Promise<KnownFace> => {
    await delay(700);
    const newFace: KnownFace = { ...faceData, id: nextFaceId++, imageUrls: faceData.imageUrls.length > 0 ? faceData.imageUrls : [`https://picsum.photos/seed/${nextFaceId}/400/400`] };
    faces.push(newFace);
    return newFace;
};

export const updateKnownFace = async (faceData: KnownFace): Promise<KnownFace> => {
    await delay(700);
    const index = faces.findIndex(f => f.id === faceData.id);
    if (index === -1) throw new Error('Face not found');
    faces[index] = faceData;
    return faceData;
};

export const deleteKnownFace = async (faceId: number): Promise<{ id: number }> => {
    await delay(700);
    const initialLength = faces.length;
    faces = faces.filter(f => f.id !== faceId);
    if (faces.length === initialLength) throw new Error('Face not found');
    return { id: faceId };
};

// This function simulates a new detection from a live feed
export const simulateDetection = (): Detection | null => {
    // 10% chance of a new detection on each call
    if (Math.random() > 0.1 || faces.length === 0) {
        return null;
    }

    const knownFace = faces[Math.floor(Math.random() * faces.length)];
    const confidence = 0.85 + Math.random() * 0.14; // High confidence for simulation

    const newDetection: Detection = {
        id: nextDetectionId++,
        face: knownFace,
        camera: CAMERA,
        snapshotUrl: `https://picsum.photos/seed/detection${nextDetectionId}/200/200`,
        confidence: parseFloat(confidence.toFixed(2)),
        timestamp: new Date(),
    };

    detections.unshift(newDetection);
    if (detections.length > 50) {
        detections.pop();
    }

    return newDetection;
};
