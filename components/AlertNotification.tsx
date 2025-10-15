
import React, { useEffect, useRef } from 'react';
import type { AlertData } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { AlertTriangleIcon } from './Icons';
import { ALERT_SOUND_URL } from '../constants';

interface AlertNotificationProps {
  alert: AlertData;
  onClose: () => void;
}

const AlertNotification: React.FC<AlertNotificationProps> = ({ alert, onClose }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => console.error("Audio play failed:", error));
    }
    const timer = setTimeout(onClose, 8000); // Auto-close after 8 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-5 right-5 z-50 animate-pulse">
      <Card className="w-96 border-destructive bg-destructive/10">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <AlertTriangleIcon className="h-8 w-8 text-destructive" />
            <div>
              <CardTitle className="text-destructive">High-Confidence Match!</CardTitle>
              <CardDescription className="text-destructive/80">Known individual detected.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <img 
              src={alert.face.imageUrls[0]}
              alt={alert.face.name}
              className="h-20 w-20 rounded-lg object-cover border-2 border-destructive"
            />
            <div>
              <p className="text-lg font-bold">{alert.face.name}</p>
              <p className={`font-semibold capitalize ${alert.face.tag === 'banned' ? 'text-red-500' : 'text-amber-500'}`}>
                Status: {alert.face.tag}
              </p>
              <p className="text-sm">Confidence: <span className="font-bold">{Math.round(alert.confidence * 100)}%</span></p>
            </div>
          </div>
          <button onClick={onClose} className="absolute top-2 right-2 text-destructive/50 hover:text-destructive">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </CardContent>
      </Card>
      <audio ref={audioRef} src={ALERT_SOUND_URL} preload="auto" />
    </div>
  );
};

export default AlertNotification;
