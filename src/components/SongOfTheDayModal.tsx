import React from 'react';
import { XIcon, StarIcon, MusicIcon, HeadphonesIcon, PlayIcon } from 'lucide-react';
import { FaSpotify } from "react-icons/fa";
import { useSpotifyData } from '../contexts/SpotifyDataContext';

interface SongOfTheDayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SongOfTheDayModal: React.FC<SongOfTheDayModalProps> = ({ isOpen, onClose }) => {
  const { songOfTheDay } = useSpotifyData();

  if (!isOpen || !songOfTheDay) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white bg-opacity-90 rounded-xl shadow-xl max-w-md w-full relative overflow-hidden">
        {/* Background gradient elements */}
        <div className="absolute -top-16 -left-16 w-40 h-40 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-8 right-10 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute top-10 -right-10 w-40 h-40 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        
        {/* Close button */}
        
        {/* Header */}
        <div className="pt-6 px-6 pb-4 border-b border-gray-100 relative z-10">
          <div className="flex items-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100 z-10"
            aria-label="Close modal"
          >
            <XIcon className="w-5 h-5" />
          </button>
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mr-4 shadow-md">
              <StarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-orange-500">
                Song of the Day
              </h2>
              <p className="text-gray-600 text-sm">Your most loved track</p>
            </div>
          </div>
        </div>
        
        {/* Song information */}
        <div className="p-6 relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <img 
                src={songOfTheDay.track.albumImage} 
                alt={songOfTheDay.track.albumImage}
                className="w-24 h-24 rounded-lg object-cover shadow-md"
              />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                <PlayIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-1">{songOfTheDay.track.name}</h3>
              <p className="text-gray-600 mb-1">{songOfTheDay.track.artists.join(', ')}</p>
              <p className="text-gray-500 text-sm">{songOfTheDay.track.albumName}</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white bg-opacity-70 p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg mr-3 shadow-sm opacity-80">
                  <HeadphonesIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Plays</p>
                  <p className="text-lg font-bold text-gray-800">{songOfTheDay.playCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white bg-opacity-70 p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg mr-3 shadow-sm opacity-80">
                  <MusicIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time Period</p>
                  <p className="text-lg font-bold text-gray-800 capitalize">{songOfTheDay.timeWindow}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Audio preview */}
          {songOfTheDay.track.previewUrl && (
            <div className="bg-white bg-opacity-70 p-3 rounded-lg shadow-sm border border-gray-100 mb-6">
              <audio 
                controls 
                src={songOfTheDay.track.previewUrl}
                className="w-full"
                style={{ height: '32px' }}
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
          
          {/* Spotify link */}
          <a
            href={`https://open.spotify.com/track/${songOfTheDay.track.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center shadow-md hover:shadow-lg"
          >
            <FaSpotify className="w-5 h-5 mr-2" />
            Play on Spotify
          </a>
        </div>
      </div>
    </div>
  );
};

export default SongOfTheDayModal;