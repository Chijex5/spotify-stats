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
  return <div className={`flex items-center space-x-2 ${className}`}>
      <button onClick={togglePlay} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
        {isPlaying ? <PauseIcon className="h-4 w-4 text-green-500" /> : <PlayIcon className="h-4 w-4 text-green-500" />}
      </button>
      <button onClick={toggleMute} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
        {isMuted ? <VolumeXIcon className="h-4 w-4 text-gray-400" /> : <Volume2Icon className="h-4 w-4 text-gray-400" />}
      </button>
      <audio ref={audioRef} src={previewUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
    </div>;
};
export default AudioPreview;