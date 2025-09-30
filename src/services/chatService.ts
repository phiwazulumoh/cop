
const API_BASE_URL = 'http://localhost:3000/api';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: string;
  readAt: { [userId: string]: string };
  isRead: boolean;
}

export interface ApiResponse<T = any> {
  status: number | string;
  message: string;
  data?: T;
}

export const createChatRoom = async (userId2: string): Promise<ApiResponse<ChatRoom>> => {
  try {
    const token = localStorage.getItem('token');
    console.log('🚀 [CHAT API] Creating chat room with user:', userId2);
    
    if (!token) {
      console.error('❌ [CHAT API] No authentication token found');
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/chat/room`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId2 }),
    });

    const data = await response.json();
    console.log('📡 [CHAT API] Create room response:', data);
    
    if (response.ok && (data.status === 1 || data.status === 'SUCCESS')) {
      return data;
    }
    
    throw new Error(data.message || 'Failed to create chat room');
  } catch (error: any) {
    console.error('💥 [CHAT API] Create room error:', error);
    throw new Error(error.message || 'Failed to create chat room');
  }
};

export const sendMessage = async (
  roomId: string,
  receiverId: string,
  content: string
): Promise<ApiResponse<ChatMessage>> => {
  try {
    const token = localStorage.getItem('token');
    console.log('🚀 [CHAT API] Sending message to room:', roomId, 'receiver:', receiverId);
    
    if (!token) {
      console.error('❌ [CHAT API] No authentication token found');
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/chat/${roomId}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ receiverId, content }),
    });

    const data = await response.json();
    console.log('📡 [CHAT API] Send message response:', data);
    
    if (response.ok && (data.status === 1 || data.status === 'SUCCESS')) {
      return data;
    }
    
    throw new Error(data.message || 'Failed to send message');
  } catch (error: any) {
    console.error('💥 [CHAT API] Send message error:', error);
    throw new Error(error.message || 'Failed to send message');
  }
};

export const getMessages = async (roomId: string, limit: number = 50): Promise<ApiResponse<ChatMessage[]>> => {
  try {
    const token = localStorage.getItem('token');
    console.log('🚀 [CHAT API] Fetching messages for room:', roomId, 'limit:', limit);
    
    if (!token) {
      console.error('❌ [CHAT API] No authentication token found');
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/chat/room/${roomId}/messages?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log('📡 [CHAT API] Get messages response:', data);
    
    if (response.ok && (data.status === 1 || data.status === 'SUCCESS')) {
      return data;
    }
    
    throw new Error(data.message || 'Failed to get messages');
  } catch (error: any) {
    console.error('💥 [CHAT API] Get messages error:', error);
    throw new Error(error.message || 'Failed to get messages');
  }
};

export const markMessageAsRead = async (roomId: string, messageId: string): Promise<ApiResponse<null>> => {
  try {
    const token = localStorage.getItem('token');
    console.log('🚀 [CHAT API] Marking message as read:', messageId, 'in room:', roomId);
    
    if (!token) {
      console.error('❌ [CHAT API] No authentication token found');
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/chat/room/${roomId}/message/${messageId}/read`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log('📡 [CHAT API] Mark read response:', data);
    
    if (response.ok && (data.status === 1 || data.status === 'SUCCESS')) {
      return data;
    }
    
    throw new Error(data.message || 'Failed to mark message as read');
  } catch (error: any) {
    console.error('💥 [CHAT API] Mark read error:', error);
    throw new Error(error.message || 'Failed to mark message as read');
  }
};

export const getUnreadMessages = async (): Promise<ApiResponse<ChatMessage[]>> => {
  try {
    const token = localStorage.getItem('token');
    console.log('🚀 [CHAT API] Fetching unread messages');
    
    if (!token) {
      console.error('❌ [CHAT API] No authentication token found');
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/chat/unread-messages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log('📡 [CHAT API] Unread messages response:', data);
    
    if (response.ok && (data.status === 1 || data.status === 'SUCCESS')) {
      return data;
    }
    
    throw new Error(data.message || 'Failed to get unread messages');
  } catch (error: any) {
    console.error('💥 [CHAT API] Unread messages error:', error);
    throw new Error(error.message || 'Failed to get unread messages');
  }
};

export const getAllUsers = async (): Promise<ApiResponse<User[]>> => {
  try {
    const token = localStorage.getItem('token');
    console.log('🚀 [CHAT API] Fetching all users');
    
    if (!token) {
      console.error('❌ [CHAT API] No authentication token found');
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/user/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log('📡 [CHAT API] Get users response:', data);
    
    if (response.ok && (data.status === 1 || data.status === 'SUCCESS')) {
      return data;
    }
    
    throw new Error(data.message || 'Failed to fetch users');
  } catch (error: any) {
    console.error('💥 [CHAT API] Get users error:', error);
    throw new Error(error.message || 'Failed to fetch users');
  }
};