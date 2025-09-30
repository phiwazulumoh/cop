import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardDescription } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Heart, MessageCircle, ImagePlus, Send, X, Loader2 } from 'lucide-react';

import { 
  type ForumPost, 
 type ForumComment,
  createPost, 
  getPosts, 
  toggleLikePost,
  createComment,
  getPostComments,

} from '../services/forumService';

// Enhanced post interface for display
interface DisplayPost extends ForumPost {
  author: string;
  avatar?: string;
  time: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

interface EnhancedComment extends ForumComment {
  author: string;
  avatar?: string;
  time: string;
}

export function Forum() {
  const [posts, setPosts] = useState<DisplayPost[]>([]);
  const [comments, setComments] = useState<{ [postId: string]: EnhancedComment[] }>({});
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState<{ [key: string]: boolean }>({});


  // Load posts on mount
  useEffect(() => {
    loadPosts();
  }, []);


// In Forum.tsx, update loadPosts:
const loadPosts = async () => {
  try {
    setLoading(true);
    const response = await getPosts(10);
    
    if ((response.status === 1 || response.status === 'SUCCESS') && response.data) {
      const rawPosts = Array.isArray(response.data) ? response.data : [];
      
      const enhancedPosts: DisplayPost[] = rawPosts.map((post: ForumPost) => {
        return {
          ...post,
          author: `User ${post.userId.substring(0, 8)}`,
          avatar: '',
          time: formatTime(post.postDate),
          // Use real data from backend
          likes: post.likeCount || 0,
          comments: post.commentCount || 0, // NEW: Use real comment count
          isLiked: post.isLiked || false,
        };
      });
      
      console.log('Enhanced posts with comments:', enhancedPosts);
      setPosts(enhancedPosts);
    }
  } catch (error: any) {
    console.error('Failed to load posts:', error);
    setPosts([]);
  } finally {
    setLoading(false);
  }
};

const handleLike = async (postId: string, currentIsLiked: boolean) => {
  try {
    setSubmitting(prev => ({ ...prev, [postId]: true }));
    
    // Get current user ID from localStorage
    const user = localStorage.getItem('user');
    if (!user) {
      console.error('No user data found');
      return;
    }
    const userData = JSON.parse(user);
    
    const action = currentIsLiked ? 'unlike' : 'like';
    const response = await toggleLikePost(postId, action);
    
    console.log('Like action response:', response);
    
    if ((response.status === 1 || response.status === 'SUCCESS')) {
      // Update local state (optimistic update confirmed by server)
      setPosts(posts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !currentIsLiked, 
              likes: currentIsLiked ? (post.likes - 1) : (post.likes + 1)
            }
          : post
      ));
    }
  } catch (error: any) {
    console.error('Like/unlike error:', error);
    // Optionally show a toast notification for the error
    alert(`Failed to ${currentIsLiked ? 'unlike' : 'like'} post: ${error.message}`);
  } finally {
    setSubmitting(prev => ({ ...prev, [postId]: false }));
  }
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

  const handleSubmitPost = async () => {
    if (!postContent.trim()) {
      return;
    }

    try {
      console.log('Creating post with content:', postContent);
      setSubmitting({ post: true });
      
      const postData = {
        message: postContent.trim(),
        // imageUrl will be handled by backend upload later
      };

      const response = await createPost(postData);
      console.log('Create post response:', response);
      
      if ((response.status === 1 || response.status === 'SUCCESS') && response.data) {
        // Enhance the new post with display data
        const newPost: DisplayPost = {
          ...response.data,
          author: 'You', 
          avatar: '', 
          time: 'Just now',
          likes: 0,
          comments: 0,
          isLiked: false,
        };
        
        // Add to top of posts list
        setPosts([newPost, ...posts]);
        
        // Reset form
        setPostContent('');
        setSelectedImage(null);
        setImagePreview('');
        setShowCreatePost(false);
      } else {
        console.error('Post creation failed:', response.message);
      }
    } catch (error: any) {
      console.error('Post creation error:', error);
    } finally {
      setSubmitting({ post: false });
    }
  };

const toggleComments = (postId: string) => {
  console.log('🔍 [DEBUG] Toggling comments for post:', postId);
  console.log('🔍 [DEBUG] Current expandedComments:', expandedComments);
  console.log('🔍 [DEBUG] Current comments state for post:', comments[postId]);
  
  const newExpanded = new Set(expandedComments);
  if (newExpanded.has(postId)) {
    newExpanded.delete(postId);
    console.log('🔄 [DEBUG] Collapsing comments for post:', postId);
  } else {
    newExpanded.add(postId);
    console.log('🔄 [DEBUG] Expanding comments for post:', postId);
    
    // Only load comments if we don't have them already
    if (!comments[postId]) {
      console.log('📡 [DEBUG] No comments cached, loading from API...');
      loadComments(postId);
    } else {
      console.log('💾 [DEBUG] Using cached comments:', comments[postId]);
    }
  }
  
  setExpandedComments(newExpanded);
  console.log('💾 [DEBUG] New expandedComments state:', newExpanded);
};
// Replace your current loadComments function in Forum.tsx with this debug version:

const loadComments = async (postId: string) => {
  try {
    console.log('🔍 [DEBUG] Starting to load comments for post:', postId);
    console.log('🔍 [DEBUG] Current posts state:', posts.find(p => p.id === postId));
    
    // Show loading state
    setComments(prev => ({ 
      ...prev, 
      [postId]: [{ 
        id: 'loading', 
        message: 'Loading comments...', 
        replyDate: new Date().toISOString(), 
        userId: 'loading', 
        forumpostId: postId, 
        parentId: postId, 
        parentType: 'post' as const,
        author: 'Loading',
        avatar: '',
        time: 'Just now'
      }] 
    }));
    
    const response = await getPostComments(postId, 20);
    console.log('📡 [DEBUG] Comments API response:', response);
    console.log('📡 [DEBUG] Response status:', response.status);
    console.log('📡 [DEBUG] Response data length:', response.data?.length);
    console.log('📡 [DEBUG] Raw response data:', response.data);
    
    // Check if response is successful
    const isSuccess = response.status === 1 || response.status === 'SUCCESS';
    console.log('✅ [DEBUG] Is API response successful?', isSuccess);
    
    if (isSuccess && response.data) {
      const rawComments = Array.isArray(response.data) ? response.data : [];
      console.log('📝 [DEBUG] Raw comments array:', rawComments);
      console.log('📝 [DEBUG] Number of raw comments:', rawComments.length);
      
      // Log first comment for inspection
      if (rawComments.length > 0) {
        console.log('📝 [DEBUG] First comment structure:', rawComments[0]);
      }
      
      // Enhance comments with display data
      const enhancedComments: EnhancedComment[] = rawComments.map((comment: ForumComment) => {
        const enhanced: EnhancedComment = {
          ...comment,
          author: `User ${comment.userId.substring(0, 8)}`,
          avatar: '',
          time: formatTime(comment.replyDate),
        };
        console.log('✨ [DEBUG] Enhanced comment:', enhanced);
        return enhanced;
      });
      
      console.log('🎨 [DEBUG] Enhanced comments array:', enhancedComments);
      
      // Update comments state
      setComments(prev => { 
        const newState = { ...prev, [postId]: enhancedComments };
        console.log('💾 [DEBUG] New comments state for post', postId, ':', newState[postId]);
        return newState;
      });
      
      // Update post comment count
      setPosts(prevPosts => {
        const newPosts = prevPosts.map(post => 
          post.id === postId
            ? { ...post, comments: rawComments.length } // Use actual loaded count
            : post
        );
        console.log('📊 [DEBUG] Updated posts with new comment count:', newPosts.find(p => p.id === postId));
        return newPosts;
      });
      
      console.log('✅ [DEBUG] Comments loaded successfully for post:', postId);
    } else {
      console.error('❌ [DEBUG] Failed to load comments - invalid response');
      console.error('❌ [DEBUG] Response:', response);
      
      // Clear loading state on error
      setComments(prev => { 
        const newState = { ...prev, [postId]: [] };
        console.log('💾 [DEBUG] Cleared comments state due to error:', newState[postId]);
        return newState;
      });
    }
  } catch (error: any) {
    console.error('💥 [DEBUG] Error loading comments for post', postId, ':', error);
    console.error('💥 [DEBUG] Error details:', error.message);
    
    // Clear loading state on error
    setComments(prev => { 
      const newState = { ...prev, [postId]: [] };
      console.log('💾 [DEBUG] Cleared comments state due to exception:', newState[postId]);
      return newState;
    });
  }
};

// Update handleSubmitComment in Forum.tsx:
const handleSubmitComment = async (postId: string) => {
  const commentText = commentInputs[postId];
  if (!commentText || commentText.trim().length < 2) {
    console.warn('Comment too short:', commentText);
    return;
  }

  try {
    setSubmitting(prev => ({ ...prev, [`comment-${postId}`]: true }));
    
    // Get current user for display
    const user = localStorage.getItem('user');
    if (!user) {
      throw new Error('No user data found');
    }
    const userData = JSON.parse(user);
    
    const commentData = {
      forumpostId: postId,
      parentId: postId,
      parentType: 'post' as const,
      message: commentText.trim(),
    };

    console.log('Creating comment:', commentData);
    const response = await createComment(commentData);
    console.log('Create comment response:', response);
    
    if ((response.status === 1 || response.status === 'SUCCESS') && response.data) {
      // Optimistic update - add comment immediately
      const newComment: EnhancedComment = {
        ...response.data,
        author: userData.displayName || `You (${userData.email})`, // Use real user data
        avatar: userData.photoURL || '',
        time: 'Just now',
      };
      
      setComments(prev => {
        const currentComments = prev[postId] || [];
        return {
          ...prev,
          [postId]: [...currentComments.filter(c => c.id !== 'loading'), newComment] // Remove loading state
        };
      });
      
      // Clear input
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      
      // Update comment count
      setPosts(posts.map(post => 
        post.id === postId
          ? { ...post, comments: post.comments + 1 }
          : post
      ));
      
      console.log('Comment added successfully');
    } else {
      throw new Error(response.message || 'Failed to create comment');
    }
  } catch (error: any) {
    console.error('Comment creation error:', error);
    alert(`Failed to post comment: ${error.message}`);
    // Optionally remove optimistic update if you added one
  } finally {
    setSubmitting(prev => ({ ...prev, [`comment-${postId}`]: false }));
  }
};

  const handleCommentInputChange = (postId: string, value: string) => {
    setCommentInputs(prev => ({ ...prev, [postId]: value }));
  };

  const formatTime = (dateString: string): string => {
    try {
      const now = new Date();
      const postDate = new Date(dateString);
      const diffInMs = now.getTime() - postDate.getTime();
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

      if (diffInHours < 1) {
        return 'Just now';
      } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      } else {
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      }
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Unknown time';
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="text-center mb-8">
        <h1 className="mb-2 text-3xl font-bold">Community Of Practice Forum</h1>
        <p className="text-muted-foreground">Share experiences, ask questions, and support each other</p>
      </div>

      {/* Create Post Section */}
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src="" />
                <AvatarFallback>YN</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Share with the community</p>
                <p className="text-sm text-muted-foreground">What's on your mind?</p>
              </div>
            </div>
            {!showCreatePost && (
              <Button onClick={() => setShowCreatePost(true)} disabled={submitting.post}>
                Create Post
              </Button>
            )}
          </div>
        </CardHeader>

        {showCreatePost && (
          <CardContent className="space-y-4 border-t pt-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Share your thoughts, experiences, or questions..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="min-h-[100px] resize-none"
                disabled={submitting.post}
              />
            </div>

            {/* Image Upload Section - Optional for now */}
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
                  disabled={submitting.post}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                <div className="flex items-center gap-2">
                  <ImagePlus className="w-5 h-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Add photo (optional)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={submitting.post}
                />
              </label>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleSubmitPost}
                disabled={!postContent.trim() || submitting.post}
                className="flex-1"
              >
                {submitting.post ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Post
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCreatePost(false)}
                disabled={submitting.post}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        )}
      </Card>



      {/* Posts */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card className="w-full max-w-4xl mx-auto text-center py-12">
            <CardDescription className="text-lg">
              No posts yet. Be the first to share your thoughts!
            </CardDescription>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="w-full max-w-4xl mx-auto">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={post.avatar} />
                    <AvatarFallback>{post.author?.split(' ').map(n => n[0]).join('') || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{post.author}</p>
                    <p className="text-sm text-muted-foreground">{post.postDate}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="mb-4 whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {post.message}
                </p>
                
                {/* Image display - for future use */}
                {/* {post.imageUrl && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={post.imageUrl}
                      alt="Post image"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )} */}
                
                <div className="flex items-center gap-4 pt-3 border-t">
          <Button 
  variant="ghost" 
  size="sm" 
  className={`gap-2 transition-colors h-8 px-3 ${
    post.isLiked ? 'text-red-500 hover:text-red-600' : 'hover:text-red-500'
  }`}
  onClick={() => handleLike(post.id, post.isLiked)}
  disabled={submitting[post.id] || loading}
>
  <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
  <span className="font-medium">{post.likes}</span>
  {submitting[post.id] && (
    <Loader2 className="w-3 h-3 animate-spin ml-1" />
  )}
</Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2 h-8 px-3"
                    onClick={() => toggleComments(post.id)}
                    disabled={loading}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="font-medium">{post.comments}</span>
                  </Button>
                </div>

                {/* Comments Section */}




{expandedComments.has(post.id) && (
  <div className="mt-4 pt-4 border-t bg-muted/20 rounded-lg">
    {/* Comment Input */}
    <div className="flex gap-2 mb-4 p-3 border rounded-lg bg-background">
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarImage src="" />
        <AvatarFallback>YN</AvatarFallback>
      </Avatar>
      <Input
        placeholder="Write a comment..."
        value={commentInputs[post.id] || ''}
        onChange={(e) => handleCommentInputChange(post.id, e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && commentInputs[post.id]?.trim()) {
            e.preventDefault();
            handleSubmitComment(post.id);
          }
        }}
        className="flex-1 h-10"
        disabled={submitting[`comment-${post.id}`]}
      />
      <Button
        size="sm"
        className="h-10 px-3"
        onClick={() => handleSubmitComment(post.id)}
        disabled={!commentInputs[post.id]?.trim() || submitting[`comment-${post.id}`]}
      >
        {submitting[`comment-${post.id}`] ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </Button>
    </div>
    
    {/* Comments List */}
    <div className="space-y-3 px-3 pb-3 max-h-96 overflow-y-auto">
      {(() => {
        const postComments = comments[post.id];
        console.log('🎨 [DEBUG] Rendering comments for post', post.id, ':', postComments);
        
        // Check if comments are loading
        if (postComments && postComments.length > 0 && postComments[0].id === 'loading') {
          return (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-2" />
              <span className="text-sm text-muted-foreground">Loading comments...</span>
            </div>
          );
        }
        
        // Check if comments have been loaded but are empty
        if (postComments && postComments.length === 0) {
          return (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">No comments yet. Be the first!</p>
            </div>
          );
        }
        
        // Check if comments haven't been loaded yet (undefined)
        if (postComments === undefined) {
          // This shouldn't happen since we set loading state first, but just in case
          return (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-2" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          );
        }
        
        // Render actual comments
        return postComments.map((comment) => (
          <div key={comment.id} className="flex gap-3 py-2">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarImage src={comment.avatar} />
              <AvatarFallback>{comment.author?.split(' ').map(n => n[0]).join('') || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-sm truncate">{comment.author}</p>
                <p className="text-xs text-muted-foreground">{comment.time}</p>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.message}</p>
            </div>
          </div>
        ));
      })()}
    </div>
    
    {/* Show comment count footer */}
    {(() => {
      const postComments = comments[post.id];
      if (postComments && postComments.length > 0 && postComments[0].id !== 'loading') {
        return (
          <div className="px-3 pb-2 text-xs text-muted-foreground border-t">
            {postComments.length} {postComments.length === 1 ? 'comment' : 'comments'}
          </div>
        );
      }
      return null;
    })()}
  </div>
)}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {loading && posts.length > 0 && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
    </div>
  );
}