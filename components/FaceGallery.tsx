import React, { useState } from 'react';
import type { KnownFace } from '../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Button } from './ui/Button';
import { PlusCircleIcon, PencilIcon, Trash2Icon } from './Icons';
import AddFaceDialog from './AddFaceDialog';
import EditFaceDialog from './EditFaceDialog';

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

interface FaceGalleryProps {
    knownFaces: KnownFace[];
    onAddFace: (data: AddFaceData) => Promise<void>;
    onUpdateFace: (faceId: number, data: UpdateFaceData) => Promise<void>;
    onDeleteFace: (faceId: number) => void;
}

const FaceCard: React.FC<{ face: KnownFace, onEdit: () => void, onDelete: () => void }> = ({ face, onEdit, onDelete }) => {
    const tagColor = {
        banned: 'border-red-500',
        watchlist: 'border-amber-500',
        vip: 'border-green-500',
    };
    
    return (
        <Card>
            <CardHeader className="p-0">
                 <img src={face.imageUrls[0]} alt={face.name} className={`w-full h-48 object-cover rounded-t-lg border-b-4 ${tagColor[face.tag]}`} />
            </CardHeader>
            <CardContent className="p-4">
                <h3 className="font-bold text-lg">{face.name}</h3>
                <p className={`text-sm font-semibold capitalize ${
                    face.tag === 'banned' ? 'text-red-500' : face.tag === 'watchlist' ? 'text-amber-500' : 'text-green-500'
                }`}>{face.tag}</p>
                <p className="text-xs text-muted-foreground mt-2 h-16 overflow-y-auto">{face.notes || 'No notes available.'}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-end space-x-2">
                <Button variant="ghost" size="icon" onClick={onEdit}><PencilIcon className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={onDelete} className="text-destructive hover:text-destructive"><Trash2Icon className="h-4 w-4" /></Button>
            </CardFooter>
        </Card>
    );
};

const FaceGallery: React.FC<FaceGalleryProps> = ({ knownFaces, onAddFace, onUpdateFace, onDeleteFace }) => {
    const [isAddDialogOpen, setAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedFace, setSelectedFace] = useState<KnownFace | null>(null);

    const handleEditClick = (face: KnownFace) => {
        setSelectedFace(face);
        setEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setEditDialogOpen(false);
        setSelectedFace(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Face Gallery</h2>
                    <p className="text-muted-foreground">Manage known individuals in the system.</p>
                </div>
                <Button onClick={() => setAddDialogOpen(true)}>
                    <PlusCircleIcon className="mr-2 h-4 w-4" /> Add New Person
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {knownFaces.map(face => (
                    <FaceCard 
                        key={face.id} 
                        face={face} 
                        onEdit={() => handleEditClick(face)}
                        onDelete={() => onDeleteFace(face.id)}
                    />
                ))}
            </div>

            {isAddDialogOpen && (
                <AddFaceDialog
                    open={isAddDialogOpen}
                    onClose={() => setAddDialogOpen(false)}
                    onAddFace={onAddFace}
                />
            )}
            
            {isEditDialogOpen && selectedFace && (
                 <EditFaceDialog
                    open={isEditDialogOpen}
                    onClose={handleCloseEditDialog}
                    face={selectedFace}
                    onUpdateFace={onUpdateFace}
                />
            )}
        </div>
    );
};

export default FaceGallery;