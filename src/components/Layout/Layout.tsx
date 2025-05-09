import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { HomeIcon, TrendingUpIcon, BarChart2Icon, ClockIcon, ListMusicIcon, LogOutIcon, RefreshCwIcon, MenuIcon, XIcon } from 'lucide-react';
import { FaSpotify } from "react-icons/fa";
import { useSpotifyData } from '../../contexts/SpotifyDataContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { logout } = useAuth();
  const { refreshData, loading } = useSpotifyData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gradient-to-b from-indigo-900 via-purple-800 to-blue-900 overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-gradient-to-r from-purple-900 to-blue-900 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <FaSpotify className="h-6 w-6 text-green-400" />
          <h1 className="text-xl font-bold text-white">Spotify Stats</h1>
        </div>
        <button onClick={toggleMobileMenu} className="text-white p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors">
          {isMobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar - fixed positioning for mobile */}
      <aside
        className={`bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 w-64 flex-shrink-0 flex flex-col md:relative md:translate-x-0 md:border-r md:border-gray-800 fixed inset-y-0 left-0 z-30 transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:block`}
        style={{ maxWidth: '100vw', overflowX: 'hidden', overflowY: 'hidden' }}
      >
        {/* Background pattern overlay */}
        <div className=" absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiAvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIgLz48L3N2Zz4=')] opacity-20"></div>
        
        {/* Animated blobs */}
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-24 -right-16 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="p-6 flex-shrink-0 relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-10 rounded-full backdrop-blur-sm">
              <FaSpotify className="h-5 w-5 text-green-400" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">Spotify Stats</h1>
            <button onClick={toggleMobileMenu} className="text-white p-2 md:hidden ml-auto">
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="space-y-2">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-10 text-green-400' 
                    : 'text-gray-300 hover:bg-white hover:bg-opacity-5'
                }`
              }
              onClick={() => { if (isMobileMenuOpen) toggleMobileMenu(); }}
            >
              <HomeIcon className="h-5 w-5" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/dashboard/top-tracks"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-10 text-green-400' 
                    : 'text-gray-300 hover:bg-white hover:bg-opacity-5'
                }`
              }
              onClick={() => { if (isMobileMenuOpen) toggleMobileMenu(); }}
            >
              <TrendingUpIcon className="h-5 w-5" />
              <span>Top Tracks</span>
            </NavLink>
            <NavLink
              to="/dashboard/recently-played"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-10 text-green-400' 
                    : 'text-gray-300 hover:bg-white hover:bg-opacity-5'
                }`
              }
              onClick={() => { if (isMobileMenuOpen) toggleMobileMenu(); }}
            >
              <ClockIcon className="h-5 w-5" />
              <span>Recently Played</span>
            </NavLink>
            <NavLink
              to="/dashboard/playlists"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-10 text-green-400' 
                    : 'text-gray-300 hover:bg-white hover:bg-opacity-5'
                }`
              }
              onClick={() => { if (isMobileMenuOpen) toggleMobileMenu(); }}
            >
              <ListMusicIcon className="h-5 w-5" />
              <span>Playlists</span>
            </NavLink>
            <NavLink
              to="/dashboard/trends"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-10 text-green-400' 
                    : 'text-gray-300 hover:bg-white hover:bg-opacity-5'
                }`
              }
              onClick={() => { if (isMobileMenuOpen) toggleMobileMenu(); }}
            >
              <BarChart2Icon className="h-5 w-5" />
              <span>Trends</span>
            </NavLink>
          </nav>
        </div>
        <div className="mt-auto p-6 space-y-3 relative z-10">
          <button
            onClick={() => { refreshData(); if (isMobileMenuOpen) toggleMobileMenu(); }}
            disabled={loading}
            className="flex items-center w-full space-x-3 px-4 py-3 rounded-xl bg-white bg-opacity-5 hover:bg-opacity-10 text-gray-300 transition-colors backdrop-blur-sm"
          >
            <RefreshCwIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>
          <button
            onClick={() => { logout(); if (isMobileMenuOpen) toggleMobileMenu(); }}
            className="flex items-center w-full space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white transition-all duration-200 shadow-lg hover:shadow-green-500/25"
          >
            <LogOutIcon className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden md:pt-0 pt-0 relative">
        <div className="h-full max-w-7xl mx-auto relative p-4 md:p-8">
          {/* Background decoration elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-40 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col min-h-full">
            <div className="flex-grow">
              {children}
            </div>
            
            {/* Footer with links */}
            <footer className="mt-auto pt-8 pb-4 text-center text-xs text-gray-400">
              <div className="flex justify-center space-x-4">
                <NavLink 
                  to="/privacy-policy" 
                  className="hover:text-green-400 transition-colors"
                  onClick={() => { if (isMobileMenuOpen) toggleMobileMenu(); }}
                >
                  Privacy Policy
                </NavLink>
                <NavLink 
                  to="/terms-of-use" 
                  className="hover:text-green-400 transition-colors"
                  onClick={() => { if (isMobileMenuOpen) toggleMobileMenu(); }}
                >
                  Terms of Use
                </NavLink>
              </div>
              <div className="mt-2">
                © {new Date().getFullYear()} Spotify Stats. All rights reserved.
              </div>
            </footer>
          </div>
        </div>
      </main>

      {/* Overlay for mobile menu */} 
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-20 md:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}
    </div>
  );
};

export default Layout;