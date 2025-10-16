
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { VideoIcon } from './Icons';
import type { Camera } from '../types';

interface LiveFeedProps {
    camera: Camera;
}

const LiveFeed: React.FC<LiveFeedProps> = ({ camera }) => {
    const statusColor = camera.status === 'online' ? 'text-green-500' : 'text-red-500';

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">{camera.name} - Live Feed</CardTitle>
                <VideoIcon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
                <div className="aspect-video w-full bg-secondary rounded-md flex items-center justify-center overflow-hidden relative">
                    {/* In a real application, a <video> or <Webcam> component would be used here. */}
                    <img src="https://picsum.photos/seed/livefeed/1280/720" alt="Live camera feed simulation" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-sm flex items-center">
                        <span className="relative flex h-2 w-2 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        LIVE
                    </div>
                     <p className="absolute text-white/50 text-lg select-none">Live Feed Simulation</p>
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                    Location: {camera.location} | Status: <span className={`${statusColor} font-semibold capitalize`}>{camera.status}</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default LiveFeed;
