
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Button } from './ui/Button';
import type { UnknownFace } from '../types';
import { PlusCircleIcon } from './Icons';

// Mock data for demonstration purposes, as the app doesn't generate these yet.
const MOCK_UNKNOWN_FACES: UnknownFace[] = [
  { id: 1, snapshotUrl: 'https://picsum.photos/seed/unknown1/400/400', timestamp: new Date(Date.now() - 1000 * 60 * 15) },
  { id: 2, snapshotUrl: 'https://picsum.photos/seed/unknown2/400/400', timestamp: new Date(Date.now() - 1000 * 60 * 45) },
  { id: 3, snapshotUrl: 'https://picsum.photos/seed/unknown3/400/400', timestamp: new Date(Date.now() - 1000 * 60 * 120) },
  { id: 4, snapshotUrl: 'https://picsum.photos/seed/unknown4/400/400', timestamp: new Date(Date.now() - 1000 * 60 * 180) },
];

const UnknownFaceCard: React.FC<{ face: UnknownFace }> = ({ face }) => {
    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0">
                <img src={face.snapshotUrl} alt={`Unknown face ${face.id}`} className="w-full h-48 object-cover" />
                <div className="p-4">
                    <p className="text-sm text-muted-foreground">
                        Detected: {face.timestamp.toLocaleString()}
                    </p>
                    <Button className="w-full mt-3">
                        <PlusCircleIcon className="mr-2 h-4 w-4"/>
                        Add to Gallery
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

const UnknownFaces: React.FC = () => {
  return (
    <div>
        <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight">Unknown Faces</h2>
            <p className="text-muted-foreground">Individuals detected by the system but not found in the gallery.</p>
        </div>
        
        {MOCK_UNKNOWN_FACES.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {MOCK_UNKNOWN_FACES.map(face => (
                    <UnknownFaceCard key={face.id} face={face} />
                ))}
            </div>
        ) : (
            <Card className="flex items-center justify-center h-64">
                <CardContent className="text-center text-muted-foreground">
                    <p>No unknown faces have been detected recently.</p>
                </CardContent>
            </Card>
        )}
    </div>
  );
};

export default UnknownFaces;
