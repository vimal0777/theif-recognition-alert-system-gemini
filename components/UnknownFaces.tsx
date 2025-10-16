
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Button } from './ui/Button';

// Mock data for unknown faces
const mockUnknownFaces = [
    { id: 1, snapshotUrl: 'https://picsum.photos/seed/unknown1/400/400', timestamp: new Date(Date.now() - 1000 * 60 * 15) },
    { id: 2, snapshotUrl: 'https://picsum.photos/seed/unknown2/400/400', timestamp: new Date(Date.now() - 1000 * 60 * 45) },
    { id: 3, snapshotUrl: 'https://picsum.photos/seed/unknown3/400/400', timestamp: new Date(Date.now() - 1000 * 60 * 120) },
];


const UnknownFaces: React.FC = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-3xl font-bold tracking-tight">Unknown Faces</CardTitle>
                <CardDescription>Review individuals detected by the system who are not in the face gallery.</CardDescription>
            </CardHeader>
            <CardContent>
                {mockUnknownFaces.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {mockUnknownFaces.map(face => (
                            <div key={face.id} className="border rounded-lg overflow-hidden">
                                <img src={face.snapshotUrl} alt={`Unknown face ${face.id}`} className="aspect-square w-full object-cover" />
                                <div className="p-2 text-center bg-muted/50">
                                    <p className="text-xs text-muted-foreground">{face.timestamp.toLocaleString()}</p>
                                    <Button size="sm" className="mt-2 w-full">Add to Gallery</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                     <div className="text-center py-16">
                        <p className="text-muted-foreground">No unknown faces have been detected recently.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default UnknownFaces;
