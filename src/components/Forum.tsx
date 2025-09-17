import React from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Heart, MessageCircle, ImagePlus, Send, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ForumPost {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

const mockPosts: ForumPost[] = [
  {
    id: '1',
    author: 'Sarah Johnson, RN',
    avatar: '',
    time: '2 hours ago',
    content: 'Had a beautiful water birth today. The mother was so calm and prepared. It\'s moments like these that remind me why I love being a midwife. 💙',
    likes: 24,
    comments: 8,
    isLiked: false,
  },
  {
    id: '2',
    author: 'Maria Garcia, CNM',
    avatar: '',
    time: '4 hours ago',
    content: 'Quick tip for managing labor pain: Encourage mothers to use visualization techniques. I often guide them to imagine their cervix opening like a flower. It really helps with relaxation.',
    likes: 45,
    comments: 12,
    isLiked: true,
  },
  {
    id: '3',
    author: 'Dr. Emily Chen',
    avatar: '',
    time: '6 hours ago',
    content: 'Sharing this educational diagram about fetal positions during labor. Great reference material for explaining to new parents!',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    likes: 67,
    comments: 15,
    isLiked: false,
  },
];

const postCategories = [
  'General Discussion',
  'Birth Stories',
  'Clinical Questions',
  'Professional Development',
  'Education & Training',
  'Equipment & Tools',
  'Support & Encouragement',
];

export function Forum() {
  const [posts, setPosts] = React.useState(mockPosts);
  const [postContent, setPostContent] = React.useState('');
  const [postTitle, setPostTitle] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string>('');
  const [showCreatePost, setShowCreatePost] = React.useState(false);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

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

  const handleSubmitPost = () => {
    if (postTitle.trim() && postContent.trim() && selectedCategory) {
      // Create new post
      const newPost: ForumPost = {
        id: Date.now().toString(),
        author: 'Your Name, CNM',
        avatar: '',
        time: 'Just now',
        content: postContent,
        image: imagePreview || undefined,
        likes: 0,
        comments: 0,
        isLiked: false,
      };
      
      setPosts([newPost, ...posts]);
      
      // Reset form
      setPostTitle('');
      setPostContent('');
      setSelectedCategory('');
      setSelectedImage(null);
      setImagePreview('');
      setShowCreatePost(false);
    }
  };

  return (
    <div className="space-y-6  pb-24">
      <div className="text-center mb-8">
        <h1 className="mb-2">Community Of Practice Forum</h1>
        <p className="text-muted-foreground">Share experiences, ask questions, and support each other</p>
      </div>

      {/* Create Post Section */}
      <Card className="w-full max-w-5xl mx-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>YN</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Share with the community</p>
                <p className="text-sm text-muted-foreground">What's on your mind?</p>
              </div>
            </div>
            {!showCreatePost && (
              <Button onClick={() => setShowCreatePost(true)}>
                Create Post
              </Button>
            )}
          </div>
        </CardHeader>

        {showCreatePost && (
          <CardContent className="space-y-4 border-t pt-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
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
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="What's your post about?"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Share your thoughts, experiences, or questions..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>

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
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                <div className="flex items-center gap-2">
                  <ImagePlus className="w-5 h-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Add photo</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleSubmitPost}
                disabled={!postTitle.trim() || !postContent.trim() || !selectedCategory}
                className="flex-1"
              >
                <Send className="w-4 h-4 mr-2" />
                Post
              </Button>
              <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Posts */}
      {posts.map((post) => (
        <Card key={post.id} className="w-full  max-w-5xl mx-auto">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={post.avatar} />
                <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{post.author}</p>
                <p className="text-sm text-muted-foreground">{post.time}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="mb-4">{post.content}</p>
            {post.image && (
              <div className="mb-4 rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={post.image}
                  alt="Post image"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}
            <div className="flex items-center gap-4 pt-3 border-t">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`gap-2 ${post.isLiked ? 'text-red-500' : ''}`}
                onClick={() => handleLike(post.id)}
              >
                <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                {post.likes}
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                {post.comments}
              </Button>

            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}