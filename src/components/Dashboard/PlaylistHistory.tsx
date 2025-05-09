import React, { useState } from 'react';
import { useSpotifyData } from '../../contexts/SpotifyDataContext';
import { 
  ListMusicIcon, 
  PlayIcon, 
  PauseIcon, 
  InfoIcon, 
  ArrowLeftIcon, 
  ExternalLinkIcon, 
  ClockIcon, 
  RefreshCwIcon
} from 'lucide-react';
import PlaylistItemSkeleton from '../shared/PlaylistItemSkeleton';
import { FaSpotify } from "react-icons/fa";

const PlaylistHistory: React.FC = () => {
  const {
    playlists,
    loading,
    error,
    refreshData,
    getTrackPreview
  } = useSpotifyData();

  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [playlistDetails, setPlaylistDetails] = useState<any>(null);
  const [playlistTracks, setPlaylistTracks] = useState<any[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('default');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);

  // Fetch playlist details and tracks
  const fetchPlaylistDetails = async (playlistId: string) => {
    setDetailsLoading(true);
    const token = localStorage.getItem('spotify_token');
    if (!token) return;

    try {
      // Fetch playlist details
      const detailsResponse = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!detailsResponse.ok) {
        throw new Error('Failed to fetch playlist details');
      }

      const detailsData = await detailsResponse.json();
      setPlaylistDetails(detailsData);

      // Process tracks from the response
      const tracks = detailsData.tracks.items.map((item: any) => ({
        id: item.track?.id || '',
        name: item.track?.name || 'Unknown Track',
        artists: item.track?.artists?.map((artist: any) => artist.name) || ['Unknown Artist'],
        albumName: item.track?.album?.name || 'Unknown Album',
        albumImage: item.track?.album?.images?.[0]?.url || '',
        duration: item.track?.duration_ms || 0,
        popularity: item.track?.popularity || 0,
        previewUrl: item.track?.preview_url || null,
        externalUrl: item.track?.external_urls?.spotify || '',
        isPlayable: item.track?.is_playable !== false && item.track?.preview_url !== null,
        added_at: item.added_at || '',
        added_by: item.added_by?.display_name || ''
      }));

      setPlaylistTracks(tracks.filter((track: any) => track.id !== ''));
    } catch (err: any) {
      console.error('Error fetching playlist details:', err);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Handle playlist selection
  const handlePlaylistClick = (playlistId: string) => {
    if (audioPlayer) {
      audioPlayer.pause();
      setCurrentlyPlaying(null);
    }
    
    if (selectedPlaylist === playlistId) {
      // If already selected, close the details view
      setSelectedPlaylist(null);
      setPlaylistDetails(null);
      setPlaylistTracks([]);
    } else {
      // Otherwise, show details for the selected playlist
      setSelectedPlaylist(playlistId);
      fetchPlaylistDetails(playlistId);
    }
  };

  // Format duration from milliseconds to MM:SS
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle play/pause audio
  const handlePlayTrack = (track: any) => {
    if (currentlyPlaying === track.id && audioPlayer) {
      // If this track is already playing, pause it
      audioPlayer.pause();
      setCurrentlyPlaying(null);
    } else if (track.previewUrl) {
      // If we have a preview URL, play it
      if (audioPlayer) {
        audioPlayer.pause();
      }
      
      const audio = new Audio(track.previewUrl);
      audio.play();
      audio.onended = () => setCurrentlyPlaying(null);
      setAudioPlayer(audio);
      setCurrentlyPlaying(track.id);
    } else {
      // Try to get the preview URL and then play
      getTrackPreview(track.id).then(previewUrl => {
        if (previewUrl) {
          if (audioPlayer) {
            audioPlayer.pause();
          }
          
          // Update the track's preview URL in our local state
          setPlaylistTracks(prevTracks => 
            prevTracks.map(t => 
              t.id === track.id ? {...t, previewUrl, isPlayable: true} : t
            )
          );
          
          const audio = new Audio(previewUrl);
          audio.play();
          audio.onended = () => setCurrentlyPlaying(null);
          setAudioPlayer(audio);
          setCurrentlyPlaying(track.id);
        }
      });
    }
  };

  // Sort tracks based on selected criteria
  const sortTracks = (tracks: any[]) => {
    if (!tracks.length) return [];
    
    let sortedTracks = [...tracks];
    
    switch (sortBy) {
      case 'name':
        sortedTracks.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'artist':
        sortedTracks.sort((a, b) => 
          (a.artists[0] || '').localeCompare(b.artists[0] || ''));
        break;
      case 'album':
        sortedTracks.sort((a, b) => a.albumName.localeCompare(b.albumName));
        break;
      case 'duration':
        sortedTracks.sort((a, b) => a.duration - b.duration);
        break;
      case 'popularity':
        sortedTracks.sort((a, b) => a.popularity - b.popularity);
        break;
      case 'added_at':
        sortedTracks.sort((a, b) => 
          new Date(a.added_at).getTime() - new Date(b.added_at).getTime());
        break;
      default:
        // Default sorting based on playlist order
        break;
    }
    
    // Apply sort direction
    if (sortDirection === 'desc') {
      sortedTracks.reverse();
    }
    
    return sortedTracks;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <header className="flex items-center pb-4 border-b border-green-200">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full mr-3">
            <ListMusicIcon className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-400">Your Playlists</h1>
        </header>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => <PlaylistItemSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-100 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-500 font-medium">Error loading data</h3>
        <p className="text-gray-700">{error}</p>
        <button 
          onClick={() => refreshData()}
          className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors flex items-center"
        >
          <RefreshCwIcon className="w-4 h-4 mr-2" />
          Try Again
        </button>
      </div>;
  }

  // Render detailed view for a selected playlist
  const renderPlaylistDetails = () => {
    if (!playlistDetails) return null;
    
    const sortedTracks = sortTracks(playlistTracks);
    
    return (
      <div className="bg-white bg-opacity-90 rounded-xl p-6 backdrop-blur-sm shadow-lg border border-gray-100 w-full">
        {/* Header with back button */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => {
              setSelectedPlaylist(null);
              setPlaylistDetails(null);
              if (audioPlayer) {
                audioPlayer.pause();
                setCurrentlyPlaying(null);
              }
            }}
            className="flex items-center text-indigo-500 hover:text-indigo-700 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Playlists
          </button>
          
          <a 
            href={playlistDetails.external_urls?.spotify || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-green-500 hover:text-green-700 transition-colors"
          >
            <FaSpotify className="w-5 h-5 mr-2" />
            Open in Spotify
            <ExternalLinkIcon className="w-4 h-4 ml-1" />
          </a>
        </div>
        
        {/* Playlist info */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-shrink-0">
            <div className="w-48 h-48 rounded-lg overflow-hidden shadow-lg">
              <img 
                src={playlistDetails.images?.[0]?.url || 'https://via.placeholder.com/300?text=No+Image'} 
                alt={playlistDetails.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{playlistDetails.name}</h2>
            {playlistDetails.description && (
              <p className="text-gray-600 mb-4">{playlistDetails.description}</p>
            )}
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                {playlistDetails.tracks?.total || 0} tracks
              </div>
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                {playlistDetails.followers?.total.toLocaleString() || 0} followers
              </div>
              <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                Created by: {playlistDetails.owner?.display_name || 'Unknown'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Track listing */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Tracks</h3>
            
            <div className="flex items-center space-x-2">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm text-black bg-white border border-gray-200 rounded-md px-2 py-1"
              >
                <option value="default">Default Order</option>
                <option value="name">Track Name</option>
                <option value="artist">Artist</option>
                <option value="album">Album</option>
                <option value="duration">Duration</option>
                <option value="popularity">Popularity</option>
                <option value="added_at">Date Added</option>
              </select>
              
              <button 
                onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="text-sm text-black bg-white border border-gray-200 rounded-md px-2 py-1"
              >
                {sortDirection === 'asc' ? '↑ Asc' : '↓ Desc'}
              </button>
            </div>
          </div>
        </div>
        
        {detailsLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-400 border-t-transparent"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Track</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Album</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <ClockIcon className="w-4 h-4" />
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedTracks.map((track, index) => (
                  <tr key={track.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {currentlyPlaying === track.id ? (
                        <button 
                          onClick={() => handlePlayTrack(track)}
                          className="text-green-500 hover:text-green-700 transition-colors"
                        >
                          <PauseIcon className="w-5 h-5" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handlePlayTrack(track)}
                          className={`hover:text-indigo-500 transition-colors ${track.isPlayable ? 'text-gray-400' : 'text-gray-300 cursor-not-allowed'}`}
                          disabled={!track.isPlayable}
                        >
                          <PlayIcon className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden">
                          <img 
                            src={track.albumImage || 'https://via.placeholder.com/40?text=No+Image'} 
                            alt={track.albumName} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{track.name}</div>
                          <div className="text-xs text-gray-500">{track.artists.join(', ')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {track.albumName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {new Date(track.added_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatDuration(track.duration)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-green-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Decorative elements */}
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-24 -right-16 w-60 h-60 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        
        {/* Header section */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-green-200 relative z-10">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full mr-4 shadow-lg">
              <FaSpotify className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-400">
              Your Playlists
            </h1>
          </div>
          
          <button
            onClick={() => refreshData()}
            disabled={loading}
            className="flex items-center space-x-2 mt-4 sm:mt-0 px-4 py-2 bg-white bg-opacity-50 hover:bg-opacity-80 rounded-lg transition-colors text-gray-700"
          >
            <RefreshCwIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>
        </header>

        {/* Content section */}
        {selectedPlaylist ? (
          renderPlaylistDetails()
        ) : (
          <>
            {/* Stats summary boxes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
              <div className="flex flex-col items-center p-4 bg-white bg-opacity-70 rounded-xl backdrop-blur-sm shadow-md border border-gray-100">
                <ListMusicIcon className="w-8 h-8 text-indigo-400 mb-2" />
                <p className="text-center text-sm text-gray-700">{playlists.length} Playlists</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-white bg-opacity-70 rounded-xl backdrop-blur-sm shadow-md border border-gray-100">
                <ListMusicIcon className="w-8 h-8 text-blue-400 mb-2" />
                <p className="text-center text-sm text-gray-700">
                  {playlists.reduce((sum, playlist) => sum + playlist.trackCount, 0)} Total Tracks
                </p>
              </div>
              <div className="flex flex-col items-center p-4 bg-white bg-opacity-70 rounded-xl backdrop-blur-sm shadow-md border border-gray-100">
                <InfoIcon className="w-8 h-8 text-green-400 mb-2" />
                <p className="text-center text-sm text-gray-700">Click a playlist to view details</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-white bg-opacity-70 rounded-xl backdrop-blur-sm shadow-md border border-gray-100">
                <PlayIcon className="w-8 h-8 text-purple-400 mb-2" />
                <p className="text-center text-sm text-gray-700">Preview available tracks</p>
              </div>
            </div>

            {/* Playlists grid */}
            {playlists.length === 0 ? (
              <div className="bg-white bg-opacity-70 rounded-xl p-8 text-center backdrop-blur-sm shadow-lg border border-gray-100 relative z-10">
                <p className="text-gray-500">
                  No playlists found.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 relative z-10">
                {playlists.map(playlist => (
                  <div 
                    key={playlist.id} 
                    onClick={() => handlePlaylistClick(playlist.id)}
                    className="bg-white bg-opacity-70 rounded-lg overflow-hidden group shadow-md hover:shadow-lg transition-all cursor-pointer backdrop-blur-sm border border-gray-100 hover:transform hover:scale-105 hover:bg-opacity-90"
                  >
                    <div className="aspect-square relative">
                      <img 
                        src={playlist.imageUrl || 'https://via.placeholder.com/300?text=No+Image'} 
                        alt={playlist.name} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/80 to-blue-500/80 opacity-0 group-hover:opacity-90 flex items-center justify-center transition-opacity">
                        <div className="flex flex-col items-center">
                          <InfoIcon className="h-10 w-10 text-white mb-2" />
                          <span className="text-white text-sm font-medium">View Details</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 truncate">{playlist.name}</h3>
                      {playlist.description && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {playlist.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <p className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full inline-block">
                          {playlist.trackCount} tracks
                        </p>
                        <a 
                          href={playlist.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full inline-block flex items-center"
                        >
                          <FaSpotify className="w-3 h-3 mr-1" />
                          Open
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Information panel */}
        <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100 mt-8 text-gray-600 text-sm relative z-10">
          <p>Click on any playlist to view its details, browse the tracks, and play previews when available. Some tracks may not have preview URLs available through Spotify's API.</p>
        </div>
      </div>
    </div>
  );
};

export default PlaylistHistory;