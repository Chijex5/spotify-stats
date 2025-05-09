import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Headphones, BarChart2, Clock, ListMusic } from 'lucide-react';
import { FaSpotify } from "react-icons/fa";
const Login: React.FC = () => {
  const {
    login,
    isAuthenticated
  } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  return <div className="min-h-screen flex flex-col md:flex-row bg-black text-white overflow-hidden">
  {/* Left panel with animated background */}
  <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden">
    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiAvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIgLz48L3N2Zz4=')] opacity-20"></div>
    
    <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
    <div className="absolute -bottom-8 left-40 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
    <div className="absolute top-24 -right-16 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
    
    <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
      <div className="flex items-center justify-center w-24 h-24 bg-white bg-opacity-10 rounded-full backdrop-blur-sm mb-8">
        <FaSpotify className="w-12 h-12 text-green-400" />
      </div>
      <h1 className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">Spotify Stats</h1>
      <p className="text-xl text-center text-gray-300 mb-12">Your personal music journey, visualized</p>
      
      <div className="grid grid-cols-2 gap-6 w-full max-w-md">
        <div className="flex flex-col items-center p-4 bg-white bg-opacity-5 rounded-xl backdrop-blur-sm">
          <BarChart2 className="w-8 h-8 text-green-400 mb-2" />
          <p className="text-center text-sm">Analytics</p>
        </div>
        <div className="flex flex-col items-center p-4 bg-white bg-opacity-5 rounded-xl backdrop-blur-sm">
          <Headphones className="w-8 h-8 text-green-400 mb-2" />
          <p className="text-center text-sm">Discover</p>
        </div>
        <div className="flex flex-col items-center p-4 bg-white bg-opacity-5 rounded-xl backdrop-blur-sm">
          <Clock className="w-8 h-8 text-green-400 mb-2" />
          <p className="text-center text-sm">History</p>
        </div>
        <div className="flex flex-col items-center p-4 bg-white bg-opacity-5 rounded-xl backdrop-blur-sm">
          <ListMusic className="w-8 h-8 text-green-400 mb-2" />
          <p className="text-center text-sm">Playlists</p>
        </div>
      </div>
    </div>
  </div>
  
  {/* Right panel with login form */}
  <div className="w-full md:w-1/2 flex items-center justify-center p-8">
    <div className="w-full max-w-md">
      <div className="md:hidden flex items-center justify-center mb-8">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full">
          <FaSpotify className="w-8 h-8 text-white" />
        </div>
      </div>
      
      <h2 className="text-3xl font-bold mb-2 md:hidden">Spotify Stats</h2>
      <h2 className="text-3xl font-bold mb-6 hidden md:block">Welcome</h2>
      
      <p className="text-gray-400 mb-8 text-lg">
        Unlock insights into your musical tastes and discover patterns in your listening habits.
      </p>
      
      <div className="space-y-8">
        <div className="bg-white bg-opacity-5 p-6 rounded-xl backdrop-blur-sm border border-gray-800">
          <h3 className="font-medium text-lg mb-4 text-green-400">What you'll get</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="flex-shrink-0 w-5 h-5 mt-1 bg-green-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-black">✓</span>
              </div>
              <span className="ml-3 text-gray-300">Personalized top tracks and artists</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-5 h-5 mt-1 bg-green-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-black">✓</span>
              </div>
              <span className="ml-3 text-gray-300">Comprehensive listening history</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-5 h-5 mt-1 bg-green-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-black">✓</span>
              </div>
              <span className="ml-3 text-gray-300">Detailed playlist analytics</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-5 h-5 mt-1 bg-green-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-black">✓</span>
              </div>
              <span className="ml-3 text-gray-300">Genre breakdowns and trends</span>
            </li>
          </ul>
        </div>
        
        <button 
          onClick={login} 
          className="w-full py-4 px-6 flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl text-white font-medium transition-all duration-200 shadow-lg hover:shadow-green-500/25 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          <span>Connect with Spotify</span>
        </button>
        
        <p className="text-xs text-center text-gray-500">
          We only request read access to your listening data. Your account security is our priority.
        </p>
      </div>
    </div>
  </div>
</div>
};
export default Login;