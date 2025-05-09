import React, { useEffect, useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  handleAuthCallback: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Environment-specific configuration
const isDevelopment = import.meta.env.DEV || process.env.NODE_ENV === 'development';

// Spotify API credentials from environment variables
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

// Dynamic redirect URI based on environment
const DEV_REDIRECT_URI = 'http://127.0.0.1:5173/callback';
const PROD_REDIRECT_URI = `${window.location.origin}/callback`;
const REDIRECT_URI = isDevelopment ? DEV_REDIRECT_URI : PROD_REDIRECT_URI;

// Spotify authentication endpoints
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

// Requested permissions
const SCOPES = [
  'user-read-private', 
  'user-read-email', 
  'user-top-read', 
  'user-read-recently-played', 
  'playlist-read-private', 
  'playlist-read-collaborative',
  'streaming', // Added for Web Playback SDK
  'user-modify-playback-state' // Added for controlling playback
];

// Token storage keys
const TOKEN_KEY = 'spotify_token';
const REFRESH_TOKEN_KEY = 'spotify_refresh_token';
const AUTH_STATE_KEY = 'spotify_auth_state';

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY));
  const [tokenExpiry, setTokenExpiry] = useState<number | null>(
    Number(localStorage.getItem('spotify_token_expiry')) || null
  );
  const navigate = useNavigate();
  
  const isAuthenticated = !!token;
  
  // Helper function to generate random string for state
  const generateRandomString = (length: number) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return Array.from(values).reduce((acc, x) => acc + possible[x % possible.length], '');
  };

  // Initiate login flow
  const login = () => {
    if (!CLIENT_ID) {
      console.error('Spotify Client ID is not configured');
      return;
    }
    
    const state = generateRandomString(16);
    localStorage.setItem(AUTH_STATE_KEY, state);
    
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      scope: SCOPES.join(' '),
      state: state,
      show_dialog: 'true'
    });
    
    window.location.href = `${AUTH_ENDPOINT}?${params.toString()}`;
  };

  // Handle the auth callback from Spotify
  const handleAuthCallback = async (code: string) => {
    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.error('Spotify credentials are not configured');
      throw new Error('Authentication configuration error');
    }
    
    try {
      // Create the Authorization header for Basic Auth
      const authHeader = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
      
      const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${authHeader}`
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: REDIRECT_URI
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Token response error:', errorData);
        throw new Error(errorData.error || 'Failed to get access token');
      }
      
      const data = await response.json();
      const { access_token, refresh_token, expires_in } = data;
      
      // Calculate token expiry time
      const expiryTime = Date.now() + (expires_in * 1000);
      
      // Save tokens and expiry
      setToken(access_token);
      setTokenExpiry(expiryTime);
      localStorage.setItem(TOKEN_KEY, access_token);
      localStorage.setItem('spotify_token_expiry', expiryTime.toString());
      
      if (refresh_token) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
      }

      // Navigate to the main app after successful authentication
      navigate('/');
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  };

  // Refresh the token when needed
  const refreshToken = async () => {
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    
    if (!storedRefreshToken || !CLIENT_ID || !CLIENT_SECRET) {
      return false;
    }
    
    try {
      const authHeader = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
      
      const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${authHeader}`
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: storedRefreshToken
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to refresh token');
      }
      
      const data = await response.json();
      const { access_token, refresh_token: new_refresh_token, expires_in } = data;
      
      // Calculate new expiry time
      const expiryTime = Date.now() + (expires_in * 1000);
      
      // Update tokens and expiry
      setToken(access_token);
      setTokenExpiry(expiryTime);
      localStorage.setItem(TOKEN_KEY, access_token);
      localStorage.setItem('spotify_token_expiry', expiryTime.toString());
      
      if (new_refresh_token) {
        localStorage.setItem(REFRESH_TOKEN_KEY, new_refresh_token);
      }
      
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  };

  // Logout and clear all stored tokens
  const logout = () => {
    setToken(null);
    setTokenExpiry(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(AUTH_STATE_KEY);
    localStorage.removeItem('spotify_token_expiry');
    navigate('/login');
  };

  // Check token expiry and refresh if needed
  useEffect(() => {
    const checkTokenValidity = async () => {
      // If we have a token and expiry time
      if (token && tokenExpiry) {
        // If token expires in less than 5 minutes
        const fiveMinutes = 5 * 60 * 1000;
        if (Date.now() > tokenExpiry - fiveMinutes) {
          console.log('Token expiring soon, refreshing...');
          const success = await refreshToken();
          if (!success) {
            console.log('Failed to refresh token, logging out');
            logout();
          }
        }
      }
    };

    // Check token validity immediately
    checkTokenValidity();
    
    // Set up periodic check
    const interval = setInterval(checkTokenValidity, 60 * 1000); // Check every minute
    
    return () => clearInterval(interval);
  }, [token, tokenExpiry]);

  // Provide auth context
  const contextValue: AuthContextType = {
    token,
    isAuthenticated,
    login,
    logout,
    handleAuthCallback
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};