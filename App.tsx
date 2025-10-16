
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './components/Dashboard';
import FaceGallery from './components/FaceGallery';
import DetectionHistory from './components/DetectionHistory';
import UnknownFaces from './components/UnknownFaces';
import AlertNotification from './components/AlertNotification';
import type { Page, Theme, User, KnownFace, Detection, AlertData } from './types';
import { KNOWN_FACES as initialFaces, RECENT_DETECTIONS as initialDetections, CAMERA } from './constants';
import * as faceApi from './lib/faceApi';

// These types are used by child components, but the data is managed in App.tsx
// It's good practice to define them where the handler functions are.
interface AddFaceData {
    name: string;
    tag: 'watchlist' | 'banned' | 'vip';
    notes: string;
    imageFile: File;
}

interface UpdateFaceData {
    name: string;
    tag: 'watchlist' | 'banned' | 'vip';
    notes: string;
    imageFile?: File;
}

const App: React.FC = () => {
    const [page, setPage] = useState<Page>('Dashboard');
    const [theme, setTheme] = useState<Theme>('dark');
    const [user] = useState<User>({ id: 1, username: 'Admin', role: 'admin' });
    const [knownFaces, setKnownFaces] = useState<KnownFace[]>(initialFaces);
    const [detections, setDetections] = useState<Detection[]>(initialDetections);
    const [alert, setAlert] = useState<AlertData | null>(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);

    // Load face-api models on component mount
    useEffect(() => {
        const load = async () => {
            await faceApi.loadModels();
            setModelsLoaded(true);
        };
        load();
    }, []);
    
    // Simulate new detections periodically to make the app feel alive
    useEffect(() => {
        if (!modelsLoaded || knownFaces.length === 0) return;

        const interval = setInterval(() => {
            const randomFace = knownFaces[Math.floor(Math.random() * knownFaces.length)];
            const newDetection: Detection = {
                id: Date.now(),
                face: randomFace,
                camera: CAMERA,
                snapshotUrl: `https://picsum.photos/seed/${Date.now()}/200/200`,
                confidence: 0.85 + Math.random() * 0.14, // High confidence
                timestamp: new Date(),
            };
            
            setDetections(prev => [newDetection, ...prev]);

            // Trigger an alert for banned or watchlist individuals
            if (newDetection.face.tag === 'banned' || newDetection.face.tag === 'watchlist') {
                setAlert({ face: newDetection.face, confidence: newDetection.confidence });
            }

        }, 20000); // New detection every 20 seconds

        return () => clearInterval(interval);
    }, [modelsLoaded, knownFaces]);

    const handleAddFace = useCallback(async (data: AddFaceData) => {
        try {
            console.log("Adding face:", data.name);
            const descriptor = await faceApi.createDescriptorFromFile(data.imageFile);
            const newFace: KnownFace = {
                id: Date.now(),
                name: data.name,
                tag: data.tag,
                notes: data.notes,
                imageUrls: [URL.createObjectURL(data.imageFile)], // Display uploaded image immediately
                descriptors: [descriptor],
                imageFile: data.imageFile,
            };
            setKnownFaces(prev => [...prev, newFace]);
        } catch (err) {
            console.error(err);
            alert("Error adding face. See console for details.");
            throw err; // Re-throw to be caught by dialog
        }
    }, []);

    const handleUpdateFace = useCallback(async (faceId: number, data: UpdateFaceData) => {
        try {
            console.log("Updating face:", data.name);
            
             const updatedFaces = await Promise.all(knownFaces.map(async face => {
                if (face.id === faceId) {
                    let newDescriptor = face.descriptors?.[0];
                    let newImageUrl = face.imageUrls[0];
                    if (data.imageFile) {
                        newDescriptor = await faceApi.createDescriptorFromFile(data.imageFile);
                        newImageUrl = URL.createObjectURL(data.imageFile);
                    }
                    return {
                        ...face,
                        name: data.name,
                        tag: data.tag,
                        notes: data.notes,
                        imageUrls: [newImageUrl],
                        descriptors: newDescriptor ? [newDescriptor] : [],
                    };
                }
                return face;
             }));
             setKnownFaces(updatedFaces);

        } catch (err) {
            console.error(err);
            alert("Error updating face. See console for details.");
            throw err; // Re-throw to be caught by dialog
        }
    }, [knownFaces]);

    const handleDeleteFace = useCallback((faceId: number) => {
        if (window.confirm("Are you sure you want to delete this person?")) {
            setKnownFaces(prev => prev.filter(face => face.id !== faceId));
        }
    }, []);

    const renderPage = () => {
        switch (page) {
            case 'Dashboard':
                return <Dashboard detections={detections} knownFaces={knownFaces} camera={CAMERA} />;
            case 'Face Gallery':
                return <FaceGallery knownFaces={knownFaces} onAddFace={handleAddFace} onUpdateFace={handleUpdateFace} onDeleteFace={handleDeleteFace}/>;
            case 'Detection History':
                return <DetectionHistory detections={detections} />;
            case 'Unknown Faces':
                return <UnknownFaces />;
            case 'Settings':
                return <div className="text-center p-8"><h2 className="text-2xl">Settings</h2><p className="text-muted-foreground">This page is under construction.</p></div>;
            default:
                return <Dashboard detections={detections} knownFaces={knownFaces} camera={CAMERA}/>;
        }
    };

    return (
        <>
            <Layout
                user={user}
                theme={theme}
                setTheme={setTheme}
                onLogout={() => alert('Logout clicked!')}
                currentPage={page}
                setPage={setPage}
            >
                {renderPage()}
            </Layout>
            {alert && <AlertNotification alert={alert} onClose={() => setAlert(null)} />}
        </>
    );
};

export default App;
