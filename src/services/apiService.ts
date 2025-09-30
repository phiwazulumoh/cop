const API_BASE_URL = 'http://localhost:3000/api';

export interface AuthResponse {
  message?: string;
  user?: {
    uid: string;
    email: string;
    displayName?: string;
  };
  token?: string;
  error?: string;
}

export interface UserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  designation: string;
  middleName?: string;     // Add this to match backend validation
  profilePicture?: string; // Add this to match backend validation
}

// Sign up
export const signUp = async (userData: UserData): Promise<AuthResponse> => {
  try {
    console.log('Sending signup request with data:', userData);
    
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    console.log('Raw signup response:', data);
    console.log('Response status:', response.status);
    
    if (response.ok) {
      // Backend returns { message, user, token }
      if (data.user && data.message) {
        // Store the token for future authenticated requests
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        return data; // Return the entire response as-is
      } else {
        throw new Error(data.error || 'Registration failed - unexpected response format');
      }
    } else {
      throw new Error(data.error || `HTTP ${response.status}: Registration failed`);
    }
  } catch (error: any) {
    console.error('Sign up error:', error);
    throw new Error(error.message || 'Failed to sign up');
  }
};

// Sign in with email
export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    console.log('Sending signin request with:', { email });
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    console.log('Raw signin response:', data);
    console.log('Response status:', response.status);
    
    if (response.ok) {
      // Backend returns { message, user, token }
      if (data.user && data.message) {
        // Store both user data and token
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data; // Return the entire response as-is
      } else {
        throw new Error(data.error || 'Login failed - unexpected response format');
      }
    } else {
      throw new Error(data.error || `HTTP ${response.status}: Login failed`);
    }
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
};

// Verify token
export const verifyToken = async (token: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Use the JWT token
      },
      body: JSON.stringify({}),
    });

    const data = await response.json();
    
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error || 'Token verification failed');
    }
  } catch (error: any) {
    console.error('Token verification error:', error);
    throw new Error(error.message || 'Token verification failed');
  }
};

// Check if user is authenticated
export const checkAuth = async (): Promise<boolean> => {
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  
  if (!user || !token) return false;

  try {
    const userData = JSON.parse(user);
    // Optional: Verify token with backend
    // const response = await verifyToken(token);
    // return response.user !== undefined;
    return true;
  } catch {
    // Clean up invalid data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return false;
  }
};

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Sign out
export const signOut = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};