
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { VideoIcon } from './Icons';
import type { Camera } from '../types';

interface LiveFeedProps {
    camera: Camera;
    onNewDetection: () => void;
}

const LiveFeed: React.FC<LiveFeedProps> = ({ camera, onNewDetection }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getCameraStream = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error("Error accessing webcam:", err);
                setError("Could not access camera. Please check permissions.");
            }
        };

        getCameraStream();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            onNewDetection();
        }, 5000); // Check for new detections every 5 seconds
        return () => clearInterval(interval);
    }, [onNewDetection]);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center">
                            <VideoIcon className="mr-2 h-5 w-5"/>
                            Live Feed
                        </CardTitle>
                        <CardDescription>{camera.name} - {camera.location}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-sm font-medium text-green-600">Online</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="aspect-video w-full overflow-hidden rounded-md bg-muted">
                    {error ? (
                         <div className="flex items-center justify-center h-full text-destructive p-4 text-center">{error}</div>
                    ) : (
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            muted
                            className="h-full w-full object-cover"
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default LiveFeed;
