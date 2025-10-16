
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/Dialog';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Select } from './ui/Select';
import { Textarea } from './ui/Textarea';

interface AddFaceData {
    name: string;
    tag: 'watchlist' | 'banned' | 'vip';
    notes: string;
    imageFile: File;
}

interface AddFaceDialogProps {
    open: boolean;
    onClose: () => void;
    onAddFace: (data: AddFaceData) => Promise<void>;
}

const AddFaceDialog: React.FC<AddFaceDialogProps> = ({ open, onClose, onAddFace }) => {
    const [name, setName] = useState('');
    const [tag, setTag] = useState<'watchlist' | 'banned' | 'vip'>('watchlist');
    const [notes, setNotes] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Cleanup function to revoke blob URL
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);
    
    const resetForm = () => {
        setName('');
        setTag('watchlist');
        setNotes('');
        setImageFile(null);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(null);
    };

    const handleClose = () => {
        if (loading) return;
        resetForm();
        onClose();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImageFile(file);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImagePreview(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !imageFile) {
            alert('Name and image are required.');
            return;
        }
        setLoading(true);
        try {
            await onAddFace({ name, tag, notes, imageFile });
            handleClose();
        } catch (error) {
            console.error("Failed to add face:", error);
            // Error is alerted to the user in the App component's handler
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogHeader>
                <DialogTitle>Add New Person</DialogTitle>
                <DialogDescription>
                    Add a new individual to the face gallery. Fill in their details below.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
                <DialogContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="image-file">Photo</Label>
                        <Input id="image-file" type="file" accept="image/*" onChange={handleFileChange} required />
                    </div>
                    {imagePreview && (
                        <div className="flex justify-center">
                             <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-md border" />
                        </div>
                    )}
                    <div className="grid gap-2">
                        <Label htmlFor="tag">Tag</Label>
                        <Select id="tag" value={tag} onChange={(e) => setTag(e.target.value as any)}>
                            <option value="watchlist">Watchlist</option>
                            <option value="banned">Banned</option>
                            <option value="vip">VIP</option>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea id="notes" placeholder="Any relevant notes..." value={notes} onChange={(e) => setNotes(e.target.value)} />
                    </div>
                </DialogContent>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={handleClose} disabled={loading}>Cancel</Button>
                    <Button type="submit" disabled={!name || !imageFile || loading}>
                        {loading ? 'Adding...' : 'Add Person'}
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
};

export default AddFaceDialog;
