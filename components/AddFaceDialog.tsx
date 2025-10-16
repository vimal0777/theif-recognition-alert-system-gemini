
import React, { useState } from 'react';
import type { KnownFace } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/Dialog';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Select } from './ui/Select';
import { Textarea } from './ui/Textarea';

interface AddFaceDialogProps {
    open: boolean;
    onClose: () => void;
    onAddFace: (newFace: Omit<KnownFace, 'id'>) => void;
}

const AddFaceDialog: React.FC<AddFaceDialogProps> = ({ open, onClose, onAddFace }) => {
    const [name, setName] = useState('');
    const [tag, setTag] = useState<'banned' | 'watchlist' | 'vip'>('watchlist');
    const [notes, setNotes] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const handleSubmit = () => {
        if (!name.trim()) {
            alert('Name is required.');
            return;
        }
        onAddFace({
            name,
            tag,
            notes,
            imageUrls: [imageUrl.trim() || `https://picsum.photos/seed/${name.replace(/\s+/g, '')}/400/400`],
        });
        onClose();
        // Reset form
        setName('');
        setTag('watchlist');
        setNotes('');
        setImageUrl('');
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogHeader>
                <DialogTitle>Add New Face to Gallery</DialogTitle>
                <DialogDescription>
                    Enter the details for the new individual. This will add them to the system's database.
                </DialogDescription>
            </DialogHeader>
            <DialogContent className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
                    <Input id="imageUrl" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="col-span-3" placeholder="Optional: e.g., https://picsum.photos/..." />
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
                    <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} className="col-span-3" placeholder="Additional notes..." />
                </div>
            </DialogContent>
            <DialogFooter>
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Add Face</Button>
            </DialogFooter>
        </Dialog>
    );
};

export default AddFaceDialog;
