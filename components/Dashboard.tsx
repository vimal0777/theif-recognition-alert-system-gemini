
import React from 'react';
import StatCard from './StatCard';
import LiveFeed from './LiveFeed';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { UsersIcon, AlertTriangleIcon, HistoryIcon } from './Icons';
import type { Detection, Camera, KnownFace } from '../types';

interface DashboardProps {
    recentDetections: Detection[];
    knownFaces: KnownFace[];
    camera: Camera;
    onNewDetection: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ recentDetections, knownFaces, camera, onNewDetection }) => {
    const totalDetections = recentDetections.length;
    const highConfidenceAlerts = recentDetections.filter(d => d.confidence > 0.9 && d.face.tag !== 'vip').length;

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard 
                    title="Total Individuals" 
                    value={knownFaces.length} 
                    icon={<UsersIcon className="h-5 w-5"/>}
                    description="Number of faces in the gallery."
                />
                <StatCard 
                    title="Recent Detections" 
                    value={totalDetections} 
                    icon={<HistoryIcon className="h-5 w-5"/>}
                    description="Total recognitions in this session."
                />
                <StatCard 
                    title="High-Confidence Alerts" 
                    value={highConfidenceAlerts} 
                    icon={<AlertTriangleIcon className="h-5 w-5"/>}
                    description="Banned or Watchlisted individuals."
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <LiveFeed camera={camera} onNewDetection={onNewDetection} />
                </div>
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Detections</CardTitle>
                            <CardDescription>Latest recognized individuals.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentDetections.slice(0, 5).map(detection => (
                                    <div key={detection.id} className="flex items-center space-x-4">
                                        <img 
                                            src={detection.snapshotUrl} 
                                            alt={detection.face.name}
                                            className="h-12 w-12 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold">{detection.face.name}</p>
                                            <p className="text-sm text-muted-foreground">{detection.timestamp.toLocaleTimeString()}</p>
                                        </div>
                                        <div className="ml-auto text-right">
                                            <p className={`text-sm font-bold capitalize ${
                                                detection.face.tag === 'banned' ? 'text-red-500' : 
                                                detection.face.tag === 'watchlist' ? 'text-amber-500' : 'text-green-500'
                                            }`}>{detection.face.tag}</p>
                                            <p className="text-xs text-muted-foreground">{(detection.confidence * 100).toFixed(1)}%</p>
                                        </div>
                                    </div>
                                ))}
                                {recentDetections.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">No recent detections.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
