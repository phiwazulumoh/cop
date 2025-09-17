import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Play, Clock, Search, Filter, BookOpen, Video } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface MediaItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  type: 'video' | 'document';
  thumbnail: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const mockMedia: MediaItem[] = [
  {
    id: '1',
    title: 'Labor Stages and Management',
    description: 'Comprehensive guide to the three stages of labor and best practices for each phase.',
    duration: '25:30',
    category: 'Labor & Delivery',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1659353888306-e06177765540?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZWR1Y2F0aW9uJTIwdmlkZW98ZW58MXx8fHwxNzU1ODQ5MTI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    difficulty: 'Intermediate',
  },
  {
    id: '2',
    title: 'Prenatal Ultrasound Interpretation',
    description: 'Learn to interpret common ultrasound findings during pregnancy.',
    duration: '18:45',
    category: 'Prenatal Care',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1563066328-386736ee19d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVnbmFuY3klMjB1bHRyYXNvdW5kfGVufDF8fHx8MTc1NTg0OTEyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    difficulty: 'Advanced',
  },
  {
    id: '3',
    title: 'Newborn Care Essentials',
    description: 'Complete guide to immediate newborn care and assessment.',
    duration: '22:15',
    category: 'Postpartum Care',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1635770608350-0636bd391ea7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdib3JuJTIwYmFieSUyMGNhcmV8ZW58MXx8fHwxNzU1NzkyMzk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    difficulty: 'Beginner',
  },
  {
    id: '4',
    title: 'Emergency Procedures Protocol',
    description: 'Step-by-step emergency procedures for obstetric complications.',
    duration: '45 pages',
    category: 'Emergency Care',
    type: 'document',
    thumbnail: 'https://images.unsplash.com/photo-1659353888306-e06177765540?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZWR1Y2F0aW9uJTIwdmlkZW98ZW58MXx8fHwxNzU1ODQ5MTI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    difficulty: 'Advanced',
  },
  {
    id: '5',
    title: 'Pain Management Techniques',
    description: 'Natural and medical pain relief options during labor.',
    duration: '32:10',
    category: 'Labor & Delivery',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1563066328-386736ee19d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVnbmFuY3klMjB1bHRyYXNvdW5kfGVufDF8fHx8MTc1NTg0OTEyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    difficulty: 'Intermediate',
  },
];

const categories = ['All', 'Labor & Delivery', 'Prenatal Care', 'Postpartum Care', 'Emergency Care'];

export function MediaLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [media] = useState(mockMedia);

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-24">
      <div className="text-center mb-8">
        <h1 className="mb-2">Media Library</h1>
        <p className="text-muted-foreground">Educational videos and reference materials for midwifery practice</p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search videos and documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-5">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedia.map((item) => (
          <Card key={item.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
            <div className="relative overflow-hidden rounded-t-lg">
              <ImageWithFallback
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {item.type === 'video' ? (
                  <Play className="w-12 h-12 text-white" />
                ) : (
                  <BookOpen className="w-12 h-12 text-white" />
                )}
              </div>
              <div className="absolute top-2 left-2">
                <Badge className={`${getDifficultyColor(item.difficulty)} text-white`}>
                  {item.difficulty}
                </Badge>
              </div>
              <div className="absolute top-2 right-2">
                {item.type === 'video' ? (
                  <Video className="w-5 h-5 text-white" />
                ) : (
                  <BookOpen className="w-5 h-5 text-white" />
                )}
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{item.duration}</span>
                <Badge variant="secondary" className="text-xs">
                  {item.category}
                </Badge>
              </div>
              
              <h3 className="font-medium mb-2 line-clamp-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
              
              <Button className="w-full mt-4" size="sm">
                {item.type === 'video' ? 'Watch Video' : 'Read Document'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No media found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
}