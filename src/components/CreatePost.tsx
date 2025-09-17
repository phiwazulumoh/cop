import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImagePlus, Send, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const postCategories = [
  'General Discussion',
  'Birth Stories',
  'Clinical Questions',
  'Professional Development',
  'Education & Training',
  'Equipment & Tools',
  'Support & Encouragement',
];

export function CreatePost() {
  const [postContent, setPostContent] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview('');
  };

  const handleSubmit = () => {
    if (postTitle.trim() && postContent.trim() && selectedCategory) {
      // In a real app, this would submit to the backend
      console.log('Submitting post:', {
        title: postTitle,
        content: postContent,
        category: selectedCategory,
        image: selectedImage,
      });
      
      // Reset form
      setPostTitle('');
      setPostContent('');
      setSelectedCategory('');
      setSelectedImage(null);
      setImagePreview('');
      
      alert('Post created successfully!');
    } else {
      alert('Please fill in all required fields.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="text-center mb-8">
        <h1 className="mb-2">Create New Post</h1>
        <p className="text-muted-foreground">Share your experiences and knowledge with the community</p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>YN</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Your Name</p>
              <p className="text-sm text-muted-foreground">Certified Nurse Midwife</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category for your post" />
              </SelectTrigger>
              <SelectContent>
                {postCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Post Title *</Label>
            <Input
              id="title"
              placeholder="What's your post about?"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              placeholder="Share your thoughts, experiences, or questions..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            <p className="text-sm text-muted-foreground">
              {postContent.length}/1000 characters
            </p>
          </div>

          <div className="space-y-4">
            <Label>Add Photo (Optional)</Label>
            
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImagePlus className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload an image</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Community Guidelines</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Be respectful and professional</li>
              <li>• Share evidence-based information</li>
              <li>• Protect patient confidentiality</li>
              <li>• No spam or promotional content</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              disabled={!postTitle.trim() || !postContent.trim() || !selectedCategory}
              className="flex-1"
            >
              <Send className="w-4 h-4 mr-2" />
              Publish Post
            </Button>
            <Button variant="outline" className="px-6">
              Draft
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}