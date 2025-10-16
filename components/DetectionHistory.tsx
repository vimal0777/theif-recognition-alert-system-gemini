import React, { useState, useMemo } from 'react';
import type { Detection } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { SearchIcon, ArrowDownIcon, ArrowUpIcon } from './Icons';

interface DetectionHistoryProps {
    detections: Detection[];
}

type SortOrder = 'asc' | 'desc';

const DetectionHistory: React.FC<DetectionHistoryProps> = ({ detections }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [tagFilter, setTagFilter] = useState<'all' | 'banned' | 'watchlist' | 'vip'>('all');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    const handleSort = () => {
        setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
    };

    const filteredAndSortedDetections = useMemo(() => {
        return detections
            .filter(d => {
                const nameMatch = d.face.name.toLowerCase().includes(searchTerm.toLowerCase());
                const tagMatch = tagFilter === 'all' || d.face.tag === tagFilter;
                return nameMatch && tagMatch;
            })
            .sort((a, b) => {
                if (sortOrder === 'desc') {
                    return b.timestamp.getTime() - a.timestamp.getTime();
                }
                return a.timestamp.getTime() - b.timestamp.getTime();
            });
    }, [detections, searchTerm, tagFilter, sortOrder]);
    
    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <CardTitle className="text-3xl font-bold tracking-tight">Detection History</CardTitle>
                        <CardDescription>A log of all recognized individuals detected by the system.</CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search by name..." 
                                className="pl-9 w-full sm:w-auto"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select 
                            value={tagFilter}
                            onChange={e => setTagFilter(e.target.value as any)}
                        >
                            <option value="all">All Tags</option>
                            <option value="banned">Banned</option>
                            <option value="watchlist">Watchlist</option>
                            <option value="vip">VIP</option>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg overflow-hidden">
                    <div className="hidden md:grid md:grid-cols-6 items-center p-4 font-bold bg-muted/50 border-b">
                        <div className="col-span-2">Individual</div>
                        <div className="text-center">Confidence</div>
                        <div>Camera</div>
                        <div className="col-span-2">
                            <Button variant="ghost" size="sm" onClick={handleSort} className="w-full justify-start px-0 hover:bg-transparent">
                                Timestamp
                                {sortOrder === 'desc' 
                                    ? <ArrowDownIcon className="ml-2 h-4 w-4" /> 
                                    : <ArrowUpIcon className="ml-2 h-4 w-4" />
                                }
                            </Button>
                        </div>
                    </div>
                    <div className="divide-y">
                        {filteredAndSortedDetections.length > 0 ? (
                            filteredAndSortedDetections.map(detection => (
                                <div key={detection.id} className="grid grid-cols-1 md:grid-cols-6 items-center p-4 gap-4 md:gap-0">
                                    <div className="md:col-span-2 flex items-center space-x-4">
                                        <img src={detection.snapshotUrl} alt={detection.face.name} className="h-12 w-12 rounded-full object-cover" />
                                        <div>
                                            <p className="font-semibold">{detection.face.name}</p>
                                            <p className={`text-xs font-bold capitalize ${
                                                detection.face.tag === 'banned' ? 'text-red-500' : 
                                                detection.face.tag === 'watchlist' ? 'text-amber-500' : 'text-green-500'
                                            }`}>
                                                {detection.face.tag}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-left md:text-center">
                                         <span className="font-mono text-sm bg-secondary px-2 py-1 rounded">
                                            {(detection.confidence * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm">{detection.camera.name}</p>
                                        <p className="text-xs text-muted-foreground">{detection.camera.location}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-sm">{detection.timestamp.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-muted-foreground">
                                No detections found matching your criteria.
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default DetectionHistory;