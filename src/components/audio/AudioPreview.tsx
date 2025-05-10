import React, { useState, useRef } from 'react';
import { PlayIcon, PauseIcon, Volume2Icon, VolumeXIcon } from 'lucide-react';

interface AudioPreviewProps {
  previewUrl: string | null;
  className?: string;
}

const AudioPreview: React.FC<AudioPreviewProps> = ({ 
  previewUrl, 
  className = '' 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  if (!previewUrl) return null;

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <button 
        onClick={togglePlay} 
        className="p-1 sm:p-2 rounded-full hover:bg-gray-700 transition-colors"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? 
          <PauseIcon className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" /> : 
          <PlayIcon className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
        }
      </button>
      
      {/* Hide volume control on smaller screens */}
      <button 
        onClick={toggleMute} 
        className="hidden sm:block p-1 sm:p-2 rounded-full hover:bg-gray-700 transition-colors ml-1 sm:ml-0"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? 
          <VolumeXIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" /> : 
          <Volume2Icon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
        }
      </button>
      
      <audio 
        ref={audioRef} 
        src={previewUrl} 
        onEnded={() => setIsPlaying(false)} 
        className="hidden" 
      />
    </div>
  );
};

export default AudioPreview;