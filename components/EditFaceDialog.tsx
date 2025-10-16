
import React, { useState, useEffect } from 'react';
import type { KnownFace } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/Dialog';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Select } from './ui/Select';
import { Textarea } from './ui/Textarea';

interface EditFaceDialogProps {
    open: boolean;
    onClose: () => void;
    onUpdateFace: (updatedFace: KnownFace) => void;
    faceToEdit: KnownFace | null;
}

const EditFaceDialog: React.FC<EditFaceDialogProps> = ({ open, onClose, onUpdateFace, faceToEdit }) => {
    const [name, setName] = useState('');
    const [tag, setTag] = useState<'banned' | 'watchlist' | 'vip'>('watchlist');
    const [notes, setNotes] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        if (faceToEdit) {
            setName(faceToEdit.name);
            setTag(faceToEdit.tag);
            setNotes(faceToEdit.notes);
            setImageUrl(faceToEdit.imageUrls[0] || '');
        }
    }, [faceToEdit]);

    const handleSubmit = () => {
        if (!faceToEdit) return;
        
        if (!name.trim()) {
            alert('Name is required.');
            return;
        }

        onUpdateFace({
            ...faceToEdit,
            name,
            tag,
            notes,
            imageUrls: [imageUrl.trim() || faceToEdit.imageUrls[0]],
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogHeader>
                <DialogTitle>Edit Face Details</DialogTitle>
                <DialogDescription>
                    Update the information for {faceToEdit?.name || 'this individual'}.
                </DialogDescription>
            </DialogHeader>
            <DialogContent className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
                    <Input id="imageUrl" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="col-span-3" />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tag" className="text-right">Tag</Label>
                    <Select id="tag" value={tag} onChange={e => setTag(e.target.value as any)} className="col-span-3">
                        <option value="watchlist">Watchlist</option>
                        <option value="banned">Banned</option>
                        <option value="vip">VIP</option>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">Notes</Label>
                    <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} className="col-span-3" />
                </div>
            </DialogContent>
            <DialogFooter>
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Save Changes</Button>
            </DialogFooter>
        </Dialog>
    );
};

export default EditFaceDialog;
