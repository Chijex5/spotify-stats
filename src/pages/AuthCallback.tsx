import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const {
    handleAuthCallback
  } = useAuth();
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code from URL search params
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const error = params.get('error');
        if (error) {
          console.error('Auth error:', error);
          navigate('/login');
          return;
        }
        if (!code) {
          console.error('No code found in URL');
          navigate('/login');
          return;
        }
        // Handle the auth callback
        await handleAuthCallback(code);
        navigate('/dashboard');
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/login');
      }
    };
    handleCallback();
  }, [navigate, handleAuthCallback]);
  return <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Connecting to Spotify...</p>
      </div>
    </div>;
};
export default AuthCallback;