
import React, { useState, useMemo } from 'react';
import type { KnownFace } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { SearchIcon, PlusIcon, EditIcon, TrashIcon } from './Icons';

interface FaceGalleryProps {
    faces: KnownFace[];
    onAdd: () => void;
    onEdit: (face: KnownFace) => void;
    onDelete: (faceId: number) => void;
}

const FaceCard: React.FC<{ face: KnownFace; onEdit: () => void; onDelete: () => void; }> = ({ face, onEdit, onDelete }) => {
    const tagColor = {
        banned: 'border-red-500',
        watchlist: 'border-amber-500',
        vip: 'border-green-500',
    };
    const tagBgColor = {
        banned: 'bg-red-500',
        watchlist: 'bg-amber-500',
        vip: 'bg-green-500',
    };

    return (
        <Card className="overflow-hidden group">
            <div className="relative">
                <img src={face.imageUrls[0]} alt={face.name} className="aspect-square w-full object-cover" />
                <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold text-white ${tagBgColor[face.tag]}`}>
                    {face.tag.toUpperCase()}
                </div>
                 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <Button size="icon" variant="secondary" onClick={onEdit}><EditIcon className="h-4 w-4"/></Button>
                    <Button size="icon" variant="destructive" onClick={onDelete}><TrashIcon className="h-4 w-4"/></Button>
                </div>
            </div>
            <div className={`p-4 border-t-4 ${tagColor[face.tag]}`}>
                <h3 className="font-bold text-lg">{face.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{face.notes}</p>
            </div>
        </Card>
    );
};


const FaceGallery: React.FC<FaceGalleryProps> = ({ faces, onAdd, onEdit, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFaces = useMemo(() => {
        return faces.filter(face =>
            face.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [faces, searchTerm]);

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <CardTitle className="text-3xl font-bold tracking-tight">Face Gallery</CardTitle>
                        <CardDescription>Manage the individuals known to the system.</CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                         <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name..."
                                className="pl-9 w-full sm:w-64"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button onClick={onAdd} className="w-full sm:w-auto">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Add New Face
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {filteredFaces.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredFaces.map(face => (
                            <FaceCard 
                                key={face.id} 
                                face={face} 
                                onEdit={() => onEdit(face)} 
                                onDelete={() => onDelete(face.id)} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-muted-foreground">No faces found matching your search.</p>
                        <Button variant="link" onClick={() => setSearchTerm('')}>Clear search</Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default FaceGallery;
