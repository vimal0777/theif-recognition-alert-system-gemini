
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './components/Dashboard';
import FaceGallery from './components/FaceGallery';
import DetectionHistory from './components/DetectionHistory';
import UnknownFaces from './components/UnknownFaces';
import AlertNotification from './components/AlertNotification';
import AddFaceDialog from './components/AddFaceDialog';
import EditFaceDialog from './components/EditFaceDialog';

import type { Page, Theme, User, KnownFace, Detection, AlertData, Camera } from './types';
import { KNOWN_FACES, RECENT_DETECTIONS, CAMERA } from './constants';
import * as faceApi from './lib/faceApi';

const App: React.FC = () => {
    // App State
    const [theme, setTheme] = useState<Theme>('dark');
    const [currentPage, setPage] = useState<Page>('Dashboard');
    const [user] = useState<User>({ username: 'Operator', role: 'operator' });
    
    // Data State
    const [knownFaces, setKnownFaces] = useState<KnownFace[]>(KNOWN_FACES);
    const [detections, setDetections] = useState<Detection[]>(RECENT_DETECTIONS);
    const [camera] = useState<Camera>(CAMERA);
    
    // UI State
    const [alert, setAlert] = useState<AlertData | null>(null);
    const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
    const [isAddFaceDialogOpen, setAddFaceDialogOpen] = useState(false);
    const [isEditFaceDialogOpen, setEditFaceDialogOpen] = useState(false);
    const [faceToEdit, setFaceToEdit] = useState<KnownFace | null>(null);

    // Effect for theme
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);
    
    // Unlock audio context on first user interaction
    const unlockAudio = useCallback(() => {
        if (!isAudioUnlocked) {
            setIsAudioUnlocked(true);
        }
    }, [isAudioUnlocked]);
    
    useEffect(() => {
        window.addEventListener('click', unlockAudio);
        return () => {
            window.removeEventListener('click', unlockAudio);
        };
    }, [unlockAudio]);
    
    // Data Fetching & Simulation
    const handleNewDetection = useCallback(() => {
        const newDetection = faceApi.simulateDetection();
        if (newDetection) {
            setDetections(prev => [newDetection, ...prev]);
            
            if (newDetection.confidence > 0.9 && (newDetection.face.tag === 'banned' || newDetection.face.tag === 'watchlist')) {
                setAlert(newDetection);
            }
        }
    }, []);

    // CRUD operations for faces
    const handleAddFace = async (newFaceData: Omit<KnownFace, 'id'>) => {
        const addedFace = await faceApi.addKnownFace(newFaceData);
        setKnownFaces(prev => [...prev, addedFace]);
    };

    const handleUpdateFace = async (updatedFaceData: KnownFace) => {
        const updatedFace = await faceApi.updateKnownFace(updatedFaceData);
        setKnownFaces(prev => prev.map(f => f.id === updatedFace.id ? updatedFace : f));
    };

    const handleDeleteFace = async (faceId: number) => {
        if (window.confirm("Are you sure you want to delete this person from the gallery?")) {
            await faceApi.deleteKnownFace(faceId);
            setKnownFaces(prev => prev.filter(f => f.id !== faceId));
        }
    };

    const openEditDialog = (face: KnownFace) => {
        setFaceToEdit(face);
        setEditFaceDialogOpen(true);
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'Dashboard':
                return <Dashboard 
                    recentDetections={detections} 
                    knownFaces={knownFaces}
                    camera={camera}
                    onNewDetection={handleNewDetection}
                />;
            case 'Face Gallery':
                return <FaceGallery 
                    faces={knownFaces}
                    onAdd={() => setAddFaceDialogOpen(true)}
                    onEdit={openEditDialog}
                    onDelete={handleDeleteFace}
                />;
            case 'Detection History':
                return <DetectionHistory detections={detections} />;
            case 'Unknown Faces':
                return <UnknownFaces />;
            case 'Settings':
                 return <div className="text-center p-8 bg-card rounded-lg">Settings page is under construction.</div>;
            default:
                return null;
        }
    };

    return (
        <>
            <Layout
                user={user}
                theme={theme}
                setTheme={setTheme}
                onLogout={() => alert('Logout functionality not implemented.')}
                currentPage={currentPage}
                setPage={setPage}
            >
                {renderPage()}
            </Layout>
            
            {alert && (
                <AlertNotification 
                    alert={alert} 
                    onClose={() => setAlert(null)}
                    isAudioUnlocked={isAudioUnlocked} 
                />
            )}

            <AddFaceDialog
                open={isAddFaceDialogOpen}
                onClose={() => setAddFaceDialogOpen(false)}
                onAddFace={handleAddFace}
            />

            <EditFaceDialog
                open={isEditFaceDialogOpen}
                onClose={() => {
                    setEditFaceDialogOpen(false);
                    setFaceToEdit(null);
                }}
                onUpdateFace={handleUpdateFace}
                faceToEdit={faceToEdit}
            />
        </>
    );
};

export default App;
