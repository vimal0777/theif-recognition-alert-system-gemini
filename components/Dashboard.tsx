
import React from 'react';
import StatCard from './StatCard';
import LiveFeed from './LiveFeed';
import { UsersIcon, AlertTriangleIcon, HistoryIcon } from './Icons';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import type { Detection, KnownFace, Camera } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface DashboardProps {
    detections: Detection[];
    knownFaces: KnownFace[];
    camera: Camera;
}

const RecentDetections: React.FC<{ detections: Detection[] }> = ({ detections }) => {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Recent Detections</CardTitle>
                <CardDescription>The latest high-confidence matches.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {detections.length > 0 ? (
                        [...detections].sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 5).map((detection) => (
                            <div key={detection.id} className="flex items-center space-x-4">
                                <img
                                    src={detection.snapshotUrl}
                                    alt={detection.face.name}
                                    className="h-12 w-12 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <p className="font-semibold">{detection.face.name}</p>
                                    <p className={`text-xs capitalize font-medium ${detection.face.tag === 'banned' ? 'text-red-500' : 'text-amber-500'}`}>
                                        {detection.face.tag}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-mono bg-secondary px-2 py-1 rounded">
                                        {Math.round(detection.confidence * 100)}%
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {formatDistanceToNow(detection.timestamp, { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No detections yet.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ detections, knownFaces, camera }) => {
    const bannedCount = knownFaces.filter(f => f.tag === 'banned').length;
    const totalDetections = detections.length;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Real-time overview of the security system.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="Known Individuals"
                    value={knownFaces.length}
                    icon={<UsersIcon />}
                    description="Total faces in the gallery"
                />
                <StatCard
                    title="Banned Individuals"
                    value={bannedCount}
                    icon={<AlertTriangleIcon />}
                    description="Number of individuals on high-alert"
                />
                <StatCard
                    title="Total Detections (24h)"
                    value={totalDetections}
                    icon={<HistoryIcon />}
                    description="Unique detection events today"
                />
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <LiveFeed camera={camera} />
                </div>
                <div>
                   <RecentDetections detections={detections} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
