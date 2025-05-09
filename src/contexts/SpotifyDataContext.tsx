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

// Updated interface to include the new factors field
interface SongOfTheDay {
  track: Track;
  playCount: number;
  timeWindow: string;
  factors: string[];
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
  
    // Get the current date and check if we need to generate a new Song of the Day
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Check local storage for the last generated song and its date
    const storedSotd = localStorage.getItem('songOfTheDay');
    let storedDate = localStorage.getItem('songOfTheDayDate');
    const storedDateObj = storedDate ? new Date(storedDate) : null;
    
    // If we have a stored song and it's still from today, return it
    if (storedSotd && storedDateObj && storedDateObj.getTime() === today.getTime()) {
      try {
        return JSON.parse(storedSotd);
      } catch (e) {
        console.error("Failed to parse stored Song of the Day", e);
        // Continue to generate a new one
      }
    }
    
    const timeWindow = "24 hrs";
    
    const thirtyDaysAgo = new Date().getTime() - 30 * 24 * 60 * 60 * 1000;
    const recentTracks = tracks.filter(track => {
      if (!track.played_at) return false;
      try {
        const playedAtTime = new Date(track.played_at).getTime();
        return !isNaN(playedAtTime) && playedAtTime > thirtyDaysAgo;
      } catch (e) {
        return false;
      }
    });
    
    if (recentTracks.length === 0) return null;
    
    const trackScores: { [key: string]: { track: Track; score: number; factors: string[] } } = {};
    
    recentTracks.forEach(track => {
      if (!trackScores[track.id]) {
        trackScores[track.id] = { 
          track, 
          score: 0,
          factors: []
        };
      }
      
      // Factor 1: Play count (base weight)
      trackScores[track.id].score += 1;
      
      // Factor 2: Recency bonus (songs played more recently get higher scores)
      if (track.played_at) {
        const daysAgo = (new Date().getTime() - new Date(track.played_at).getTime()) / (1000 * 60 * 60 * 24);
        const recencyBonus = Math.max(0, 5 - daysAgo); // Up to 5 points for very recent plays
        trackScores[track.id].score += recencyBonus;
        if (recencyBonus > 2) trackScores[track.id].factors.push('recently played');
      }
      
      // Factor 3: Popularity sweet spot (not too mainstream, not too obscure)
      if (track.popularity) {
        // Songs with popularity between 40-70 get bonus points (personally relevant but quality)
        const popularityBonus = track.popularity >= 40 && track.popularity <= 70 ? 3 : 0;
        trackScores[track.id].score += popularityBonus;
        if (popularityBonus > 0) trackScores[track.id].factors.push('uniquely you');
      }
      
      // Factor 4: Preview availability bonus - prefer tracks we can preview
      if (track.previewUrl) {
        trackScores[track.id].score += 2;
        trackScores[track.id].factors.push('preview available');
      }
    });
    
    // Use the current date as a seed for pseudo-randomness
    // This ensures the same song is selected all day, but changes at midnight
    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    
    // Get top 5 tracks by score
    const topTracks = Object.values(trackScores)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    
    if (topTracks.length === 0) return null;
    
    // Use the dateSeed to select one of the top tracks
    const selectedIndex = dateSeed % topTracks.length;
    const selectedTrack = topTracks[selectedIndex];
    
    // Create the Song of the Day object
    const songOfTheDay: SongOfTheDay = {
      track: selectedTrack.track,
      playCount: recentTracks.filter(t => t.id === selectedTrack.track.id).length,
      timeWindow,
      factors: selectedTrack.factors
    };
    
    localStorage.setItem('songOfTheDay', JSON.stringify(songOfTheDay));
    localStorage.setItem('songOfTheDayDate', today.toISOString());
    
    return songOfTheDay;
  };


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