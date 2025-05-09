import React, { useState, useEffect } from 'react';
import { XIcon, StarIcon, MusicIcon, HeadphonesIcon, PlayIcon, Calendar, Brain, Clock } from 'lucide-react';
import { FaSpotify } from "react-icons/fa";
import { useSpotifyData } from '../contexts/SpotifyDataContext';

interface SongOfTheDayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SongOfTheDayModal: React.FC<SongOfTheDayModalProps> = ({ isOpen, onClose }) => {
  const { songOfTheDay } = useSpotifyData();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [timeUntilNextSong, setTimeUntilNextSong] = useState("");

  // Calculate time until midnight refresh
  useEffect(() => {
    const calculateTimeUntilMidnight = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      
      const diffMs = midnight.getTime() - now.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeUntilNextSong(`${diffHrs}h ${diffMins}m`);
    };
    
    calculateTimeUntilMidnight();
    const timer = setInterval(calculateTimeUntilMidnight, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Audio controls
  useEffect(() => {
    if (songOfTheDay?.track.previewUrl) {
      const audio = new Audio(songOfTheDay.track.previewUrl);
      setAudioElement(audio);
      
      audio.addEventListener('ended', () => setIsPlaying(false));
      
      return () => {
        audio.pause();
        audio.removeEventListener('ended', () => setIsPlaying(false));
      };
    }
  }, [songOfTheDay?.track.previewUrl]);

  const togglePlay = () => {
    if (!audioElement) return;
    
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  // Format release date if available
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (!isOpen || !songOfTheDay) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden">
        {/* Enhanced Background gradient elements */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-16 right-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-10 -right-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        
        {/* Close button */}
        
        
        {/* Header */}
        <div className="pt-8 px-6 pb-4 border-b border-gray-100 relative z-10">
          <div className="flex items-center">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100 z-10"
              aria-label="Close modal"
            >
              <XIcon className="w-5 h-5" />
            </button>
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-2xl mr-4 shadow-lg">
              <StarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-pink-500">
                Song Of The Day
                </h2>
                <div className="ml-2 px-2 py-1 bg-gradient-to-r from-yellow-100 to-pink-100 rounded-full">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1 text-yellow-500" />
                    <span className="text-xs font-medium text-pink-500">New in {timeUntilNextSong}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm">Perfectly matched to your musical taste</p>
            </div>
          </div>
        </div>
        
        {/* Song information */}
        <div className="p-6 relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative group">
              <img 
                src={songOfTheDay.track.albumImage} 
                alt={songOfTheDay.track.albumName}
                className="w-28 h-28 rounded-xl object-cover shadow-lg group-hover:shadow-xl transition-all duration-300"
              />
              <button 
                onClick={togglePlay}
                className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                {isPlaying ? (
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <span className="w-4 h-4 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-sm"></span>
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <PlayIcon className="w-6 h-6 text-gradient-to-br from-yellow-400 to-pink-500 ml-1" />
                  </div>
                )}
              </button>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-1">{songOfTheDay.track.name}</h3>
              <p className="text-gray-600 mb-1">{songOfTheDay.track.artists.join(', ')}</p>
              <p className="text-gray-500 text-sm">{songOfTheDay.track.albumName}</p>
              
              {/* Popularity indicator */}
              {songOfTheDay.track.popularity && (
                <div className="mt-2 flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-pink-500 h-1.5 rounded-full" 
                      style={{ width: `${songOfTheDay.track.popularity}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-xs text-gray-500">{songOfTheDay.track.popularity}%</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Why this song? */}
          <div className="bg-gradient-to-r from-yellow-50 to-pink-50 p-4 rounded-xl shadow-sm border border-yellow-100 mb-6">
            <div className="flex items-center mb-2">
              <Brain className="w-4 h-4 mr-2 text-pink-500" />
              <h4 className="font-medium text-gray-800">Why this song matches you</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {songOfTheDay.factors?.map((factor, index) => (
                <span key={index} className="px-2 py-1 bg-white rounded-full text-xs font-medium text-pink-600 border border-pink-100">
                  {factor}
                </span>
              ))}
              {!songOfTheDay.factors?.length && (
                <span className="px-2 py-1 bg-white rounded-full text-xs font-medium text-pink-600 border border-pink-100">
                  Your top play
                </span>
              )}
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white bg-opacity-70 p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-lg mr-3 shadow-sm">
                  <HeadphonesIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Played</p>
                  <p className="text-lg font-bold text-gray-800">{songOfTheDay.playCount} times</p>
                </div>
              </div>
            </div>
            <div className="bg-white bg-opacity-70 p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-lg mr-3 shadow-sm">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">From last</p>
                  <p className="text-lg font-bold text-gray-800">{songOfTheDay.timeWindow}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Audio waveform visualization (simplified) */}
          {songOfTheDay.track.previewUrl && (
            <div className="bg-gradient-to-r from-yellow-50 to-pink-50 p-3 rounded-lg shadow-sm border border-yellow-100 mb-6">
              <div className="h-8 flex items-center justify-between space-x-0.5">
                {Array.from({ length: 40 }).map((_, i) => {
                  // Create a dynamic waveform-like visual
                  const height = isPlaying 
                    ? Math.abs(Math.sin(i * 0.5) * 24) + 4 
                    : Math.abs(Math.sin(i * 0.2) * 12) + 4;
                  
                  return (
                    <div 
                      key={i}
                      className="bg-gradient-to-t from-yellow-400 to-pink-500 rounded-full"
                      style={{ 
                        height: `${height}px`, 
                        width: '2px',
                        opacity: isPlaying ? 0.8 : 0.4,
                        transition: 'height 0.2s ease-in-out, opacity 0.3s ease'
                      }}
                    ></div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Spotify link */}
          <a
            href={songOfTheDay.track.externalUrl || `https://open.spotify.com/track/${songOfTheDay.track.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center shadow-md hover:shadow-lg"
          >
            <FaSpotify className="w-5 h-5 mr-2" />
            Play on Spotify
          </a>
          
          {/* Share button */}
          {/* <button
            className="w-full mt-3 bg-white border border-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center hover:bg-gray-50"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.59 13.51L15.42 17.49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.41 6.51L8.59 10.49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Share This Track
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default SongOfTheDayModal;