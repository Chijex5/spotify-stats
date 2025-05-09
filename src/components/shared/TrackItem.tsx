import React from 'react';
import { PlayIcon, ExternalLinkIcon, ShareIcon } from 'lucide-react';
import PopularityChart from '../visualizations/PopularityChart';
import AudioPreview from '../audio/AudioPreview';

interface TrackItemProps {
  position?: number;
  id: string;
  name: string;
  artists: string[];
  albumName: string;
  albumImage: string;
  duration: number;
  popularity: number;
  previewUrl?: string | null;
  showPosition?: boolean;
}

const TrackItem: React.FC<TrackItemProps> = ({
  position,
  id,
  name,
  artists,
  albumName,
  albumImage,
  duration,
  popularity,
  previewUrl = null,
  showPosition = false
}) => {
  // Format duration from ms to mm:ss
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = (ms % 60000 / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`;
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: name,
        text: `Check out ${name} by ${artists.join(', ')}`,
        url: `https://open.spotify.com/track/${id}`
      });
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  return (
    <div className="flex flex-col space-y-2 p-3 border-b border-gray-100 hover:bg-green-50 transition-colors group">
      <div className="flex items-center">
        {showPosition && 
          <div className="w-8 text-center font-medium bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-full h-6 flex items-center justify-center shadow-sm">
            {position}
          </div>
        }
        <div className="relative h-12 w-12 flex-shrink-0 ml-2">
          <img src={albumImage} alt={albumName} className="h-full w-full object-cover rounded-lg shadow-md" />
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 opacity-0 group-hover:opacity-90 transition-opacity rounded-lg">
            <PlayIcon className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="ml-4 flex-1 min-w-0">
          <div className="flex items-center">
            <h4 className="font-medium text-gray-800 truncate">{name}</h4>
            <div className="flex items-center ml-2 space-x-2">
              <AudioPreview previewUrl={previewUrl} />
              <a 
                href={`https://open.spotify.com/track/${id}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-blue-100 rounded-full"
              >
                <ExternalLinkIcon className="h-4 w-4 text-blue-500" />
              </a>
              <button 
                onClick={handleShare} 
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-purple-100 rounded-full"
              >
                <ShareIcon className="h-4 w-4 text-purple-500" />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 truncate">
            {artists.join(', ')} • {albumName}
          </p>
        </div>
        <div className="text-sm text-gray-700 ml-4 bg-blue-100 px-2 py-1 rounded-full">
          {formatDuration(duration)}
        </div>
      </div>
      <div className="pl-8 md:pl-16">
        <PopularityChart popularity={popularity} />
      </div>
    </div>
  );
};

export default TrackItem;