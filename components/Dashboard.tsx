import React from 'react';
import StatCard from './StatCard';
import LiveFeed from './LiveFeed';
import { VideoIcon, UsersIcon, HistoryIcon, AlertTriangleIcon } from './Icons';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import type { Camera, Detection, AlertData, KnownFace } from '../types';

interface DashboardProps {
    camera: Camera;
    detections: Detection[];
    knownFaces: KnownFace[];
    onAlert: (alert: AlertData) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ camera, detections, knownFaces, onAlert }) => {
    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Live Feed Section (Main Content) */}
            <div className="lg:flex-grow w-full">
                 <h2 className="text-2xl font-bold tracking-tight mb-4">Live Feed</h2>
                 <LiveFeed camera={camera} knownFaces={knownFaces} onAlert={onAlert} />
            </div>

            {/* Sidebar Section (Stats & Detections) */}
            <div className="lg:w-96 w-full flex-shrink-0 space-y-6">
                 <h2 className="text-2xl font-bold tracking-tight mb-4">System Status</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                    <StatCard 
                        title="Camera Status" 
                        value={camera.status === 'online' ? 'Online' : 'Offline'}
                        icon={<VideoIcon className="h-4 w-4" />}
                        description={camera.location}
                    />
                    <StatCard 
                        title="Known Faces" 
                        value={knownFaces.length}
                        icon={<UsersIcon className="h-4 w-4" />}
                        description="Individuals in the gallery"
                    />
                    <StatCard 
                        title="Detections (24h)" 
                        value={detections.length}
                        icon={<HistoryIcon className="h-4 w-4" />}
                        description="Matches in the last day"
                    />
                    <StatCard 
                        title="High-Risk Alerts" 
                        value={detections.filter(d => d.face.tag === 'banned').length}
                        icon={<AlertTriangleIcon className="h-4 w-4" />}
                        description="Banned individuals detected"
                    />
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Detections</CardTitle>
                        <CardDescription>Latest recognized individuals.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {detections.map(detection => (
                                <div key={detection.id} className="flex items-center space-x-4">
                                    <img src={detection.snapshotUrl} alt="detection" className="h-12 w-12 rounded-full" />
                                    <div className="flex-1">
                                        <p className="font-semibold">{detection.face.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Detected at {detection.camera.name}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">{detection.timestamp.toLocaleTimeString()}</p>
                                        <p className={`text-xs font-bold ${detection.face.tag === 'banned' ? 'text-red-500' : 'text-amber-500'}`}>{detection.face.tag.toUpperCase()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;