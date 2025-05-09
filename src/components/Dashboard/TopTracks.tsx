import React from 'react';
import { useSpotifyData } from '../../contexts/SpotifyDataContext';
import TrackItem from '../shared/TrackItem';
import TrackItemSkeleton from '../shared/TrackItemSkeleton';
import { TrendingUpIcon } from 'lucide-react';
import { FaSpotify } from "react-icons/fa";

const TopTracks: React.FC = () => {
  const {
    topTracks,
    timeRange,
    setTimeRange,
    loading,
    error
  } = useSpotifyData();

  const handleTimeRangeChange = (newTimeRange: string) => {
    setTimeRange(newTimeRange);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-green-200">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mr-3">
              <TrendingUpIcon className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">Your Top Tracks</h1>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="flex space-x-2">
              {[ 
                { value: 'short_term', label: 'Last 4 Weeks' },
                { value: 'medium_term', label: 'Last 6 Months' },
                { value: 'long_term', label: 'All Time' },
              ].map((option) => (
                <button
                  key={option.value}
                  disabled
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-green-500 ${timeRange === option.value
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md'
                    : 'bg-white text-gray-500 border border-gray-200 opacity-50 cursor-not-allowed'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </header>
        <div className="bg-white bg-opacity-50 rounded-xl overflow-hidden shadow-lg border border-gray-100">
          {[...Array(5)].map((_, i) => <TrackItemSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-100 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-500 font-medium">Error loading data</h3>
        <p className="text-gray-700">{error}</p>
      </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-green-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Decorative elements from login page */}
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-24 -right-16 w-60 h-60 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        
        {/* Header section */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-green-200 relative z-10">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mr-4 shadow-lg">
              <FaSpotify className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">
              Your Top Tracks
            </h1>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="flex space-x-2">
              {[
                { value: 'short_term', label: 'Last 4 Weeks' },
                { value: 'medium_term', label: 'Last 6 Months' },
                { value: 'long_term', label: 'All Time' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleTimeRangeChange(option.value)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-green-400 ${
                    timeRange === option.value
                      ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-md'
                      : 'bg-white bg-opacity-70 text-gray-700 hover:bg-opacity-100 border border-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Stats summary boxes similar to login page */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          <div className="flex flex-col items-center p-4 bg-white bg-opacity-70 rounded-xl backdrop-blur-sm shadow-md border border-gray-100">
            <TrendingUpIcon className="w-8 h-8 text-green-400 mb-2" />
            <p className="text-center text-sm text-gray-700">Top Tracks</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-white bg-opacity-70 rounded-xl backdrop-blur-sm shadow-md border border-gray-100">
            <TrendingUpIcon className="w-8 h-8 text-blue-400 mb-2" />
            <p className="text-center text-sm text-gray-700">Statistics</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-white bg-opacity-70 rounded-xl backdrop-blur-sm shadow-md border border-gray-100">
            <TrendingUpIcon className="w-8 h-8 text-purple-400 mb-2" />
            <p className="text-center text-sm text-gray-700">Genres</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-white bg-opacity-70 rounded-xl backdrop-blur-sm shadow-md border border-gray-100">
            <TrendingUpIcon className="w-8 h-8 text-indigo-400 mb-2" />
            <p className="text-center text-sm text-gray-700">History</p>
          </div>
        </div>

        {/* Main content */}
        {topTracks.length === 0 ? (
          <div className="bg-white bg-opacity-70 rounded-xl p-8 text-center backdrop-blur-sm shadow-lg border border-gray-100 relative z-10">
            <p className="text-gray-500">
              No top tracks found for this time period.
            </p>
          </div>
        ) : (
          <div className="bg-white bg-opacity-70 rounded-xl overflow-hidden backdrop-blur-sm shadow-lg border border-gray-100 relative z-10">
            {topTracks.map((track, index) => (
              <TrackItem 
                key={track.id} 
                position={index + 1} 
                id={track.id} 
                name={track.name} 
                artists={track.artists} 
                albumName={track.albumName} 
                albumImage={track.albumImage} 
                duration={track.duration}
                popularity={track.popularity || 0} 
                showPosition={true} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopTracks;