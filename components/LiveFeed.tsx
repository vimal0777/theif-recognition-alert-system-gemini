import React, { useEffect, useRef, useState } from 'react';
// @ts-nocheck
// face-api.js doesn't have great TypeScript support, so we'll use @ts-nocheck to avoid noisy errors.
import type { Camera, AlertData, KnownFace } from '../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/Card';

// FIX: Declare faceapi as a global constant to resolve "Cannot find name 'faceapi'" errors.
// This is necessary because face-api.js is loaded via a script tag and does not have proper TypeScript types.
declare const faceapi: any;

interface LiveFeedProps {
  camera: Camera;
  knownFaces: KnownFace[];
  onAlert: (alert: AlertData) => void;
}

const LiveFeed: React.FC<LiveFeedProps> = ({ camera, knownFaces, onAlert }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [faceMatcher, setFaceMatcher] = useState(null);
  const intervalRef = useRef<number | null>(null);
  const alertCooldown = useRef(new Set());

  // Create or update the FaceMatcher when knownFaces change
  useEffect(() => {
    const createMatcher = () => {
        if (knownFaces.length > 0) {
            const labeledFaceDescriptors = knownFaces
                .filter(face => face.descriptors && face.descriptors.length > 0)
                .map(face => new faceapi.LabeledFaceDescriptors(
                    face.name,
                    face.descriptors
                ));
            
            if (labeledFaceDescriptors.length > 0) {
                const matcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6); // 0.6 is the distance threshold
                setFaceMatcher(matcher);
                console.log(`FaceMatcher updated for camera ${camera.name}.`);
            }
        }
    };
    createMatcher();
  }, [knownFaces, camera.name]);
  
  // Start video stream
  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error("Error accessing camera:", err);
      });
  };

  // Stop video stream
  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };
  
  useEffect(() => {
    if (camera.status === 'online') {
      startVideo();
    } else {
      stopVideo();
    }
    
    return () => {
      stopVideo();
    };
  }, [camera.status]);

  const handlePlay = () => {
    if (!faceMatcher || intervalRef.current) return;

    intervalRef.current = window.setInterval(async () => {
      if (videoRef.current && canvasRef.current && faceMatcher) {
        const videoEl = videoRef.current;
        const canvasEl = canvasRef.current;

        if (videoEl.paused || videoEl.ended) {
            return;
        }

        const displaySize = { width: videoEl.clientWidth, height: videoEl.clientHeight };
        faceapi.matchDimensions(canvasEl, displaySize);

        const detections = await faceapi.detectAllFaces(videoEl, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors();
        
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        const ctx = canvasEl.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        }

        if (resizedDetections) {
          resizedDetections.forEach(detection => {
            const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
            const box = detection.detection.box;
            const knownFace = knownFaces.find(f => f.name === bestMatch.label);
            
            let color = 'rgb(50, 205, 50)'; // Green for unknown/vip
            if (knownFace) {
                if (knownFace.tag === 'banned') color = 'rgb(255, 0, 0)'; // Red for banned
                if (knownFace.tag === 'watchlist') color = 'rgb(255, 165, 0)'; // Orange for watchlist
            }

            const drawBox = new faceapi.draw.DrawBox(box, { 
                label: bestMatch.toString(),
                boxColor: color,
            });
            drawBox.draw(canvasEl);

            if (knownFace && bestMatch.distance < 0.5 && (knownFace.tag === 'banned' || knownFace.tag === 'watchlist')) {
                if (!alertCooldown.current.has(knownFace.id)) {
                    onAlert({ face: knownFace, confidence: 1 - bestMatch.distance });
                    alertCooldown.current.add(knownFace.id);
                    // Remove from cooldown after 30 seconds
                    setTimeout(() => alertCooldown.current.delete(knownFace.id), 30000);
                }
            }
          });
        }
      }
    }, 300); // Detect every 300ms for performance
  };
  
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
        videoElement.addEventListener('play', handlePlay);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (videoElement) {
        videoElement.removeEventListener('play', handlePlay);
      }
    };
  }, [faceMatcher]); // Re-attach listener if faceMatcher changes

  const getStatusColor = () => {
    return camera.status === 'online' ? 'bg-green-500' : 'bg-red-500';
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center justify-between">
          {camera.name}
          <span className={`h-3 w-3 rounded-full ${getStatusColor()}`}></span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0 relative">
        <div className="aspect-video bg-secondary flex items-center justify-center">
            {camera.status === 'online' ? (
                <>
                    <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
                    <canvas ref={canvasRef} className="absolute top-0 left-0" />
                </>
            ) : (
                <p className="text-destructive-foreground bg-destructive/80 px-4 py-2 rounded-md">OFFLINE</p>
            )}
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-2 pb-4 px-4">
        {camera.location}
      </CardFooter>
    </Card>
  );
};

export default LiveFeed;
