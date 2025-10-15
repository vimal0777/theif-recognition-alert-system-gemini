import type { Camera, KnownFace, Detection } from './types';

export const KNOWN_FACES: KnownFace[] = [
    {
        id: 1,
        name: 'William Miller',
        tag: 'banned',
        notes: 'Previously caught shoplifting electronics. Approach with caution.',
        imageUrls: ['https://picsum.photos/seed/william/400/400'],
    },
    {
        id: 2,
        name: 'Ava Garcia',
        tag: 'watchlist',
        notes: 'Suspected of returning used items. Monitor activity in clothing department.',
        imageUrls: ['https://picsum.photos/seed/ava/400/400'],
    },
    {
        id: 3,
        name: 'James Smith',
        tag: 'banned',
        notes: 'Aggressive behavior towards staff on last visit. Do not engage directly.',
        imageUrls: ['https://picsum.photos/seed/james/400/400'],
    },
];

export const CAMERA: Camera = { id: 1, name: 'Main Entrance', location: 'Front Door', status: 'online' };

export const RECENT_DETECTIONS: Detection[] = [
    {
        id: 1,
        face: KNOWN_FACES[0],
        camera: CAMERA,
        snapshotUrl: 'https://picsum.photos/seed/detection1/200/200',
        confidence: 0.89,
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
        id: 2,
        face: KNOWN_FACES[2],
        camera: CAMERA,
        snapshotUrl: 'https://picsum.photos/seed/detection2/200/200',
        confidence: 0.92,
        timestamp: new Date(Date.now() - 1000 * 60 * 22),
    },
];

export const ALERT_SOUND_URL = 'https://www.soundjay.com/buttons/sounds/beep-07a.mp3';