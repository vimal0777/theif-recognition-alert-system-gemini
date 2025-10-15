import React, { useState, useEffect, useCallback } from 'react';
import './index.css';
import Layout from './components/layout/Layout';
import Dashboard from './components/Dashboard';
import FaceGallery from './components/FaceGallery';
import AlertNotification from './components/AlertNotification';
import type { Page, Theme, User, KnownFace, Detection, AlertData } from './types';
import { CAMERA, KNOWN_FACES, RECENT_DETECTIONS } from './constants';
import { loadModelsAndDescriptors, extractFaceDescriptor } from './lib/faceApi';

// Define the shape of the data for adding a new face
interface AddFaceData {
    name: string;
    tag: 'watchlist' | 'banned' | 'vip';
    notes: string;
    imageFile: File;
}

// Define the shape of the data for updating a face
interface UpdateFaceData {
    name: string;
    tag: 'watchlist' | 'banned' | 'vip';
    notes: string;
    imageFile?: File;
}


const App: React.FC = () => {
    // App State
    const [user] = useState<User>({ id: 1, username: 'Admin', role: 'admin' });
    const [theme, setTheme] = useState<Theme>('dark');
    const [currentPage, setPage] = useState<Page>('Dashboard');
    const [knownFaces, setKnownFaces] = useState<KnownFace[]>([]);
    const [detections, setDetections] = useState<Detection[]>(RECENT_DETECTIONS);
    const [alertData, setAlertData] = useState<AlertData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initialize models and face descriptors
    useEffect(() => {
        const initialize = async () => {
            try {
                setLoading(true);
                setError(null);
                const facesWithDescriptors = await loadModelsAndDescriptors(KNOWN_FACES);
                setKnownFaces(facesWithDescriptors);
            } catch (err: any) {
                console.error("Initialization failed:", err);
                setError(err.message || "An unexpected error occurred during initialization.");
            } finally {
                setLoading(false);
            }
        };
        initialize();
    }, []);

    // Handlers
    const handleAlert = useCallback((data: AlertData) => {
        console.log("ALERT:", data);
        setAlertData(data);
        // Add to recent detections
        const newDetection: Detection = {
            id: Date.now(),
            face: data.face,
            camera: CAMERA,
            snapshotUrl: data.face.imageUrls[0], // Use gallery image as placeholder
            confidence: data.confidence,
            timestamp: new Date(),
        };
        setDetections(prev => [newDetection, ...prev].slice(0, 5)); // Keep last 5
    }, []);

    const handleAddFace = async (data: AddFaceData) => {
        console.log("Adding new face:", data.name);
        try {
            const descriptor = await extractFaceDescriptor(data.imageFile);
            if (!descriptor) {
                throw new Error("Could not detect a face in the provided image. Please use a clear, front-facing photo.");
            }
            const imageUrl = URL.createObjectURL(data.imageFile);
            const faceToAdd: KnownFace = {
                id: Date.now(),
                name: data.name,
                tag: data.tag,
                notes: data.notes,
                imageUrls: [imageUrl],
                descriptors: [descriptor],
            };
            setKnownFaces(prev => [...prev, faceToAdd]);
        } catch (error: any) {
            console.error("Failed to add face:", error);
            alert(`Error: ${error.message}`);
            throw error; // Re-throw to keep dialog loading state correct
        }
    };

    const handleUpdateFace = async (faceId: number, data: UpdateFaceData) => {
        console.log("Updating face:", data.name);
        try {
            const originalFace = knownFaces.find(f => f.id === faceId);
            if (!originalFace) throw new Error("Face not found.");

            let newImageUrl = originalFace.imageUrls[0];
            let newDescriptors = originalFace.descriptors;

            // If a new image file is provided, process it
            if (data.imageFile) {
                const descriptor = await extractFaceDescriptor(data.imageFile);
                if (!descriptor) {
                    throw new Error("Could not detect a face in the new image. Please use a clear, front-facing photo.");
                }
                // Revoke old blob URL to prevent memory leaks, if it is one
                if (originalFace.imageUrls[0].startsWith('blob:')) {
                    URL.revokeObjectURL(originalFace.imageUrls[0]);
                }
                newImageUrl = URL.createObjectURL(data.imageFile);
                newDescriptors = [descriptor];
            }
            
            const updatedFace: KnownFace = {
                ...originalFace,
                name: data.name,
                tag: data.tag,
                notes: data.notes,
                imageUrls: [newImageUrl],
                descriptors: newDescriptors,
            };

            setKnownFaces(prev => prev.map(f => f.id === faceId ? updatedFace : f));
        } catch (error: any) {
            console.error("Failed to update face:", error);
            alert(`Error: ${error.message}`);
            throw error; // Re-throw to keep dialog loading state correct
        }
    };

    const handleDeleteFace = (faceId: number) => {
        if (window.confirm("Are you sure you want to delete this person from the gallery?")) {
            console.log("Deleting face:", faceId);
            const faceToDelete = knownFaces.find(f => f.id === faceId);
            // Clean up blob URL if it exists
            if (faceToDelete && faceToDelete.imageUrls[0].startsWith('blob:')) {
                URL.revokeObjectURL(faceToDelete.imageUrls[0]);
            }
            setKnownFaces(prev => prev.filter(f => f.id !== faceId));
        }
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'Dashboard':
                return <Dashboard camera={CAMERA} detections={detections} knownFaces={knownFaces} onAlert={handleAlert} />;
            case 'Face Gallery':
                return <FaceGallery knownFaces={knownFaces} onAddFace={handleAddFace} onUpdateFace={handleUpdateFace} onDeleteFace={handleDeleteFace} />;
            case 'Detection History':
            case 'Unknown Faces':
            case 'Settings':
                return <div className="text-center p-8 bg-card rounded-lg">
                    <h2 className="text-2xl font-bold">{currentPage}</h2>
                    <p className="text-muted-foreground mt-2">This feature is not yet implemented.</p>
                </div>;
            default:
                return null;
        }
    };

    const onLogout = () => {
        alert("Logout functionality is not implemented in this demo.");
    };
    
    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-background text-foreground"><p>Loading models and preparing system...</p></div>;
    }
    
    if (error) {
        return <div className="flex items-center justify-center h-screen bg-background text-destructive"><p>Error: {error}</p></div>;
    }

    return (
        <>
            <Layout
                user={user}
                theme={theme}
                setTheme={setTheme}
                onLogout={onLogout}
                currentPage={currentPage}
                setPage={setPage}
            >
                {renderPage()}
            </Layout>
            {alertData && (
                <AlertNotification
                    alert={alertData}
                    onClose={() => setAlertData(null)}
                />
            )}
        </>
    );
};

export default App;