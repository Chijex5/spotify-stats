import React, { useEffect, useState, createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

interface Track {
  id: string;
  name: string;
  artists: string[];
  albumName: string;
  albumImage: string;
  duration: number;
  popularity: number;
  previewUrl: string | null;
  externalUrl: string;         // Added for Spotify full track link
  isPlayable: boolean;         // Added to track playability status
  played_at?: string;          // For recently played tracks
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  trackCount: number;
  externalUrl: string;         // Added for playlist external link
}

interface SongOfTheDay {
  track: Track;
  playCount: number;
  timeWindow: string;
}

interface SpotifyDataContextType {
  topTracks: Track[];
  recentlyPlayed: Track[];
  playlists: Playlist[];
  songOfTheDay: SongOfTheDay | null;
  timeRange: string;
  setTimeRange: (range: string) => void;
  loading: boolean;
  isSongOfTheDayOpened: boolean;
  setIsSongOfTheDayOpened: (SongOfTheDay: boolean) => void;
  error: string | null;
  refreshData: () => Promise<void>;
  getTrackPreview: (trackId: string) => Promise<string | null>;  // Added to fetch preview URLs on demand
}

const SpotifyDataContext = createContext<SpotifyDataContextType | undefined>(undefined);

export const SpotifyDataProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const { token, isAuthenticated } = useAuth();
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [songOfTheDay, setSongOfTheDay] = useState<SongOfTheDay | null>(null);
  const [timeRange, setTimeRange] = useState<string>('short_term');
  const [loading, setLoading] = useState<boolean>(false);
  const [isSongOfTheDayOpened, setIsSongOfTheDayOpened] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch track preview on demand (can be useful for lazy loading)
  const getTrackPreview = async (trackId: string): Promise<string | null> => {
    if (!token) return null;
    
    try {
      const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch track details');
      
      const data = await response.json();
      return data.preview_url;
    } catch (err: any) {
      console.error('Error fetching track preview:', err.message);
      return null;
    }
  };

  // Enhanced top tracks fetching with additional data
  const fetchTopTracks = async () => {
    if (!token) return;
    
    try {
      // Request market-specific data to increase chances of getting preview URLs
      const response = await fetch(
        `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=20&market=from_token`, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch top tracks');
      
      const data = await response.json();
      const tracks: Track[] = data.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        artists: item.artists.map((artist: any) => artist.name),
        albumName: item.album.name,
        albumImage: item.album.images[0]?.url || '',
        duration: item.duration_ms,
        popularity: item.popularity,
        previewUrl: item.preview_url,
        externalUrl: item.external_urls?.spotify || '',
        isPlayable: item.is_playable !== false // Default to true if not specified
      }));
      
      setTopTracks(tracks);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Enhanced recently played fetching
  const fetchRecentlyPlayed = async () => {
    if (!token) return;
    
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/recently-played?limit=50&market=from_token`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (!response.ok) throw new Error('Failed to fetch recently played');
      
      const data = await response.json();
      const tracks: Track[] = data.items.map((item: any) => ({
        id: item.track.id,
        name: item.track.name,
        artists: item.track.artists.map((artist: any) => artist.name),
        albumName: item.track.album.name,
        albumImage: item.track.album.images[0]?.url || '',
        duration: item.track.duration_ms,
        popularity: item.track.popularity,
        previewUrl: item.track.preview_url,
        externalUrl: item.track.external_urls?.spotify || '',
        isPlayable: item.track.is_playable !== false,
        played_at: item.played_at
      }));
      
      setRecentlyPlayed(tracks);
      const sotd = calculateSongOfTheDay(tracks);
      setSongOfTheDay(sotd);
    } catch (err: Error) {
      setError(err.message);
    }
  };

  const calculateSongOfTheDay = (tracks: Track[]): SongOfTheDay | null => {
    if (!tracks || tracks.length === 0) return null;
  
    const twentyFourHoursAgo = new Date().getTime() - 24 * 60 * 60 * 1000;
    const timeWindow = "24 hrs";
  
    const recentTracks = tracks.filter(track => {
      if (!track.played_at) return false;
      try {
        const playedAtTime = new Date(track.played_at).getTime();
        return !isNaN(playedAtTime) && playedAtTime > twentyFourHoursAgo;
      } catch (e) {
        return false;
      }
    });
  
    if (recentTracks.length === 0) return null;
  
    const trackCounts: { [key: string]: { track: Track; count: number } } = {};
    recentTracks.forEach(track => {
      trackCounts[track.id] = trackCounts[track.id] 
        ? { track, count: trackCounts[track.id].count + 1 } 
        : { track, count: 1 };
    });
  
    const mostPlayed = Object.values(trackCounts).reduce((max, current) => 
      current.count > max.count ? current : max, 
      { count: 0, track: {} as Track }
    );
  
    return mostPlayed.count > 0 ? { 
      track: mostPlayed.track,
      playCount: mostPlayed.count,
      timeWindow
    } : null;
  };

  // Enhanced playlists fetching
  const fetchPlaylists = async () => {
if (!token) {
  setError('No authentication token available');
  return;
}
    
    try {
      const response = await fetch(`https://api.spotify.com/v1/me/playlists?limit=20`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch playlists');
      
      const data = await response.json();
      const playlists: Playlist[] = data.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        imageUrl: item.images[0]?.url || '',
        trackCount: item.tracks.total,
        externalUrl: item.external_urls?.spotify || ''
      }));
      
      setPlaylists(playlists);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchTopTracks(), 
        fetchRecentlyPlayed(), 
        fetchPlaylists()
      ]);
    } catch (err: Error) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated, timeRange]);

  return (
    <SpotifyDataContext.Provider 
      value={{
        topTracks,
        recentlyPlayed,
        playlists,
        songOfTheDay,
        timeRange,
        setTimeRange,
        loading,
        isSongOfTheDayOpened,
        setIsSongOfTheDayOpened,
        error,
        refreshData,
        getTrackPreview
      }}
    >
      {children}
    </SpotifyDataContext.Provider>
  );
};

export const useSpotifyData = () => {
  const context = useContext(SpotifyDataContext);
  if (context === undefined) {
    throw new Error('useSpotifyData must be used within a SpotifyDataProvider');
  }
  return context;
};