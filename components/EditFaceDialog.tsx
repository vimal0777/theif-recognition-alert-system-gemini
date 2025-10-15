import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/Dialog';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Select } from './ui/Select';
import { Textarea } from './ui/Textarea';
import type { KnownFace } from '../types';

interface UpdateFaceData {
    name: string;
    tag: 'watchlist' | 'banned' | 'vip';
    notes: string;
    imageFile?: File;
}

interface EditFaceDialogProps {
    open: boolean;
    onClose: () => void;
    face: KnownFace;
    onUpdateFace: (faceId: number, data: UpdateFaceData) => Promise<void>;
}

const EditFaceDialog: React.FC<EditFaceDialogProps> = ({ open, onClose, face, onUpdateFace }) => {
    const [name, setName] = useState(face.name);
    const [tag, setTag] = useState<'watchlist' | 'banned' | 'vip'>(face.tag);
    const [notes, setNotes] = useState(face.notes);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(face.imageUrls[0]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        setName(face.name);
        setTag(face.tag);
        setNotes(face.notes);
        setImageFile(null);
        setImagePreview(face.imageUrls[0]);
    }, [face]);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImageFile(file);
        if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        } else {
            // If user cancels file selection, revert to original image
            setImagePreview(face.imageUrls[0]);
        }
    };

    // Clean up blob URL on unmount
    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) {
            alert('Name is required.');
            return;
        }
        setLoading(true);
        try {
            await onUpdateFace(face.id, { name, tag, notes, imageFile: imageFile || undefined });
            onClose();
        } catch (error) {
            console.error("Failed to update face:", error);
            // Error is alerted to the user in the App component's handler
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogHeader>
                <DialogTitle>Edit Face Details</DialogTitle>
                <DialogDescription>
                    Update the information for {face.name}.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
                <DialogContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="edit-name">Full Name</Label>
                        <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="edit-image-file">Change Photo</Label>
                        <Input id="edit-image-file" type="file" accept="image/*" onChange={handleFileChange} />
                    </div>
                    {imagePreview && (
                        <div className="flex justify-center">
                             <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-md border" />
                        </div>
                    )}
                    <div className="grid gap-2">
                        <Label htmlFor="edit-tag">Tag</Label>
                        <Select id="edit-tag" value={tag} onChange={(e) => setTag(e.target.value as any)}>
                            <option value="watchlist">Watchlist</option>
                            <option value="banned">Banned</option>
                            <option value="vip">VIP</option>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="edit-notes">Notes</Label>
                        <Textarea id="edit-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
                    </div>
                </DialogContent>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
};

export default EditFaceDialog;