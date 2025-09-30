const API_BASE_URL = 'http://localhost:3000/api';


export interface ForumPost {
  id: string;
  userId: string;
  message: string;
  postDate: string;
  likeCount?: number; 
  isLiked?: boolean;
  commentCount?: number;  
}

// Enhanced display interface for frontend
export interface DisplayForumPost extends ForumPost {
  author: string;
  avatar: string;
  time: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  imageUrl?: string;
}

export interface ForumComment {
  id: string;
  forumpostId: string;
  parentId: string;
  parentType: 'post' | 'comment';
  userId: string;
  message: string;
  replyDate: string;
}

export interface DisplayForumComment extends ForumComment {
  author: string;
  avatar: string;
  time: string;
}

// Define ForumLike interface to fix compile error
export interface ForumLike {
  id: string;
  postId: string;
  userId: string;
  likeDate: string;
}

export interface CreatePostRequest {
  message: string;
  imageUrl?: string; // Optional for future
}

export interface CreateCommentRequest {
  forumpostId: string;
  parentId: string;
  parentType: 'post' | 'comment';
  message: string;
}

export interface EditCommentRequest {
  message: string;
}

// More flexible ApiResponse interface to match your backend
export interface ApiResponse<T = any> {
  status: string | number; // Could be string enum or number
  message: string;
  data?: T;
}

// If your backend uses a specific enum, you might also need:
export type ResponseStatus = 'SUCCESS' | 'FAIL';

export const ResponseStatus = {
  SUCCESS: 'SUCCESS' as ResponseStatus,
  FAIL: 'FAIL' as ResponseStatus,
};
// Create post

export const createPost = async (postData: CreatePostRequest): Promise<ApiResponse<ForumPost>> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/forum/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });

    const data = await response.json();
    
    console.log('Create post response:', data);
    
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || 'Failed to create post');
    }
  } catch (error: any) {
    console.error('Create post error:', error);
    throw new Error(error.message || 'Failed to create post');
  }
};
// Get posts

export const getPosts = async (limit: number = 10, pageToken?: string): Promise<ApiResponse<ForumPost[]>> => {
  try {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams({ limit: limit.toString() });
    if (pageToken) {
      params.append('pageToken', pageToken);
    }
    
    console.log('Making API request to:', `${API_BASE_URL}/forum/post?${params.toString()}`); // Debug
    
    const response = await fetch(`${API_BASE_URL}/forum/post?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    const data = await response.json();
    
    
    if (response.ok) {
      return data;
    } else {
      console.error('API Error response:', data);
      throw new Error(data.message || `HTTP ${response.status}: Failed to fetch posts`);
    }
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch posts');
  }
};

// Toggle like/unlike post (POST for like, DELETE for unlike)
export const toggleLikePost = async (postId: string, action: 'like' | 'unlike'): Promise<ApiResponse<ForumLike | null>> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const url = `${API_BASE_URL}/forum/post/${postId}/like`; // This matches your backend route
    const method = action === 'like' ? 'POST' : 'DELETE';
    
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || `Failed to ${action} post`);
    }
  } catch (error: any) {
    console.error(`Toggle ${action} post error:`, error);
    throw new Error(error.message || `Failed to ${action} post`);
  }
};
// Create comment
export const createComment = async (commentData: CreateCommentRequest): Promise<ApiResponse<ForumComment>> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/forum/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(commentData),
    });

    const data = await response.json();
    
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || 'Failed to create comment');
    }
  } catch (error: any) {
    console.error('Create comment error:', error);
    throw new Error(error.message || 'Failed to create comment');
  }
};

// Get comments for post
// In your frontend forumService.ts, update getPostComments:


export const getPostComments = async (postId: string, limit: number = 20): Promise<ApiResponse<ForumComment[]>> => {
  try {
    const token = localStorage.getItem('token');
    const url = `${API_BASE_URL}/forum/post/${postId}/comments?limit=${limit}`;
    
    console.log('🚀 [DEBUG] Request URL:', url);
    console.log('🚀 [DEBUG] Post ID:', postId);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    console.log('📡 [DEBUG] Response status:', response.status);
    console.log('📡 [DEBUG] Response ok:', response.ok);

    const data = await response.json();
    
    // DETAILED ERROR LOGGING FOR 400
    if (!response.ok) {
      console.error('❌ [400 ERROR] Full response details:');
      console.error('❌ Status:', response.status);
      console.error('❌ Status Text:', response.statusText);
      console.error('❌ Response Headers:', Object.fromEntries(response.headers.entries()));
      console.error('❌ Response Body:', data);
      console.error('❌ Response Body Keys:', Object.keys(data));
      console.error('❌ Full URL that failed:', url);
      
      throw new Error(data?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    console.log('✅ [DEBUG] Success response:', data);
    return data;
    
  } catch (error: any) {
    console.error('💥 [CATCH] Complete error:', error);
    throw error;
  }
};
// Edit comment
export const editComment = async (commentId: string, editData: EditCommentRequest): Promise<ApiResponse<ForumComment>> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/forum/comment/${commentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(editData),
    });

    const data = await response.json();
    
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || 'Failed to edit comment');
    }
  } catch (error: any) {
    console.error('Edit comment error:', error);
    throw new Error(error.message || 'Failed to edit comment');
  }
};

// Delete comment
export const deleteComment = async (commentId: string): Promise<ApiResponse<null>> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/forum/comment/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || 'Failed to delete comment');
    }
  } catch (error: any) {
    console.error('Delete comment error:', error);
    throw new Error(error.message || 'Failed to delete comment');
  }
};