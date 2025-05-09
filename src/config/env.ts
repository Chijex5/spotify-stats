// src/config/env.ts

/**
 * This utility file centralizes environment configuration and provides
 * type-safe access to environment variables with fallbacks.
 */

// Check if we're in development mode
export const isDevelopment = 
  import.meta.env?.DEV || 
  process.env.NODE_ENV === 'development' || 
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1';

// Spotify API configuration
export const spotifyConfig = {
  // Client credentials
  clientId: import.meta.env?.VITE_SPOTIFY_CLIENT_ID || 
            process.env.REACT_APP_SPOTIFY_CLIENT_ID || 
            '',
  
  clientSecret: import.meta.env?.VITE_SPOTIFY_CLIENT_SECRET || 
                process.env.REACT_APP_SPOTIFY_CLIENT_SECRET || 
                '',
  
  // Redirect URIs
  redirectUri: (import.meta.env?.VITE_SPOTIFY_REDIRECT_URI || 
               process.env.REACT_APP_SPOTIFY_REDIRECT_URI || 
               (isDevelopment ? 'http://127.0.0.1:5173/callback' : `${window.location.origin}/callback`)),
  
  // Authentication endpoints
  authEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
  
  // Requested scopes
  scopes: [
    'user-read-private', 
    'user-read-email', 
    'user-top-read', 
    'user-read-recently-played', 
    'playlist-read-private', 
    'playlist-read-collaborative',
    'streaming',
    'user-modify-playback-state'
  ],
  
  // Storage keys
  storageKeys: {
    token: 'spotify_token',
    refreshToken: 'spotify_refresh_token',
    authState: 'spotify_auth_state',
    tokenExpiry: 'spotify_token_expiry'
  }
};

// Check if required environment variables are set
export const validateEnv = (): { valid: boolean; missingVars: string[] } => {
  const missingVars = [];
  
  if (!spotifyConfig.clientId) {
    missingVars.push('Spotify Client ID');
  }
  
  if (!spotifyConfig.clientSecret) {
    missingVars.push('Spotify Client Secret');
  }
  
  return {
    valid: missingVars.length === 0,
    missingVars
  };
};

// Log environment info in development mode
if (isDevelopment) {
  console.log('Running in development mode');
  const envStatus = validateEnv();
  
  if (!envStatus.valid) {
    console.warn(`Missing environment variables: ${envStatus.missingVars.join(', ')}`);
    console.warn('Make sure to set up your .env file correctly');
  }
}