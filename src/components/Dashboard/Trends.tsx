import React, { useState, useEffect } from 'react';
import { useSpotifyData } from '../../contexts/SpotifyDataContext';
import { TrendingUpIcon, ChevronDownIcon, BarChart2Icon, MusicIcon, UserIcon, RefreshCwIcon } from 'lucide-react';

interface TimeRangeData {
  short_term: any[];
  medium_term: any[];
  long_term: any[];
}

interface GenreAnalysis {
  name: string;
  short_term: number;
  medium_term: number;
  long_term: number;
}

interface TrackFeatureAnalysis {
  name: string;
  short_term: number;
  medium_term: number;
  long_term: number;
}

const Trends: React.FC = () => {
  // Use the shared SpotifyDataContext
  const { loading, error, refreshData } = useSpotifyData();
  const [topTracksData, setTopTracksData] = useState<TimeRangeData>({ short_term: [], medium_term: [], long_term: [] });
  const [topArtistsData, setTopArtistsData] = useState<TimeRangeData>({ short_term: [], medium_term: [], long_term: [] });
  const [genreAnalysis, setGenreAnalysis] = useState<GenreAnalysis[]>([]);
  const [activeTab, setActiveTab] = useState<'tracks' | 'artists' | 'genres'>('tracks');
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendsData = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        // Fetch data for all time ranges
        await Promise.all([
          fetchTopItems('tracks', 'short_term'),
          fetchTopItems('tracks', 'medium_term'),
          fetchTopItems('tracks', 'long_term'),
          fetchTopItems('artists', 'short_term'),
          fetchTopItems('artists', 'medium_term'),
          fetchTopItems('artists', 'long_term')
        ]);
        
        // After fetching all data, analyze genres
        analyzeGenreTrends();
      } catch (err: any) {
        setFetchError(err.message || 'Failed to fetch trends data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendsData();
  }, []);

  const fetchTopItems = async (type: 'tracks' | 'artists', timeRange: string) => {
    const token = localStorage.getItem('spotify_token');
    if (!token) return;

    const response = await fetch(
      `https://api.spotify.com/v1/me/top/${type}?time_range=${timeRange}&limit=30`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch top ${type} for ${timeRange}`);
    }

    const data = await response.json();
    
    if (type === 'tracks') {
      setTopTracksData(prev => ({
        ...prev,
        [timeRange]: data.items.map((item: any, index: number) => ({
          id: item.id,
          name: item.name,
          artists: item.artists.map((artist: any) => artist.name),
          artistIds: item.artists.map((artist: any) => artist.id),
          albumName: item.album.name,
          albumImage: item.album.images[0]?.url || '',
          popularity: item.popularity,
          rank: index + 1
        }))
      }));
    } else {
      setTopArtistsData(prev => ({
        ...prev,
        [timeRange]: data.items.map((item: any, index: number) => ({
          id: item.id,
          name: item.name,
          imageUrl: item.images[0]?.url || '',
          popularity: item.popularity,
          genres: item.genres,
          rank: index + 1
        }))
      }));
    }
  };

  // Analyze genre trends across time periods
  const analyzeGenreTrends = () => {
    const allGenres: { [key: string]: { short_term: number, medium_term: number, long_term: number } } = {};
    
    // Function to add weighted genre counts (higher weight for higher ranked artists)
    const addGenresFromTimeRange = (timeRange: string, artists: any[]) => {
      artists.forEach((artist, index) => {
        const weight = 1 - (index / artists.length); // Higher rank = higher weight
        if (artist.genres && artist.genres.length) {
          artist.genres.forEach((genre: string) => {
            if (!allGenres[genre]) {
              allGenres[genre] = { short_term: 0, medium_term: 0, long_term: 0 };
            }
            allGenres[genre][timeRange as keyof typeof allGenres[string]] += weight;
          });
        }
      });
    };
    
    // Process each time range
    if (topArtistsData.short_term.length) {
      addGenresFromTimeRange('short_term', topArtistsData.short_term);
    }
    if (topArtistsData.medium_term.length) {
      addGenresFromTimeRange('medium_term', topArtistsData.medium_term);
    }
    if (topArtistsData.long_term.length) {
      addGenresFromTimeRange('long_term', topArtistsData.long_term);
    }
    
    // Convert to array and sort by total score across all time periods
    const genreAnalysisData = Object.entries(allGenres)
      .map(([name, counts]) => ({
        name,
        short_term: Math.round(counts.short_term * 100) / 100,
        medium_term: Math.round(counts.medium_term * 100) / 100,
        long_term: Math.round(counts.long_term * 100) / 100,
        total: counts.short_term + counts.medium_term + counts.long_term
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
    
    setGenreAnalysis(genreAnalysisData);
  };

  const renderTimeRangeLabel = (timeRange: string) => {
    switch (timeRange) {
      case 'short_term': return 'Last 4 Weeks';
      case 'medium_term': return 'Last 6 Months';
      case 'long_term': return 'All Time';
      default: return timeRange;
    }
  };

  // Find artists that have significantly changed rank between time periods
  const findTrendingArtists = () => {
    const artistMovements: any[] = [];
    
    if (topArtistsData.short_term.length && topArtistsData.medium_term.length) {
      // Compare short term to medium term
      topArtistsData.short_term.forEach(shortTermArtist => {
        const mediumTermMatch = topArtistsData.medium_term.find(a => a.id === shortTermArtist.id);
        
        if (mediumTermMatch) {
          const rankChange = mediumTermMatch.rank - shortTermArtist.rank;
          if (Math.abs(rankChange) >= 5 && shortTermArtist.rank <= 15) {
            artistMovements.push({
              ...shortTermArtist,
              rankChange,
              direction: rankChange > 0 ? 'up' : 'down',
              comparison: 'Recent vs 6 Months'
            });
          }
        } else if (shortTermArtist.rank <= 10) {
          // New artist in top 10
          artistMovements.push({
            ...shortTermArtist,
            rankChange: topArtistsData.medium_term.length,
            direction: 'new',
            comparison: 'Recent vs 6 Months'
          });
        }
      });
    }
    
    return artistMovements.sort((a, b) => Math.abs(b.rankChange) - Math.abs(a.rankChange)).slice(0, 5);
  };

  // Find tracks that appear in multiple time periods with significant rank changes
  const findInterestingTrackPatterns = () => {
    const patterns: any[] = [];
    
    if (topTracksData.short_term.length && topTracksData.medium_term.length && topTracksData.long_term.length) {
      // Find tracks that consistently appear in all time ranges
      const consistentTracks = topTracksData.long_term
        .filter(longTrack => 
          topTracksData.medium_term.some(medTrack => medTrack.id === longTrack.id) &&
          topTracksData.short_term.some(shortTrack => shortTrack.id === longTrack.id)
        )
        .slice(0, 5)
        .map(track => ({
          ...track,
          type: 'consistent',
          message: 'Consistently in your favorites across all time periods'
        }));
      
      // Find recent obsessions - tracks that are high in short term but not in longer terms
      const recentObsessions = topTracksData.short_term
        .filter(shortTrack => 
          shortTrack.rank <= 5 && 
          !topTracksData.long_term.some(longTrack => longTrack.id === shortTrack.id)
        )
        .slice(0, 4)
        .map(track => ({
          ...track,
          type: 'obsession',
          message: 'Recent obsession - not in your long-term favorites'
        }));
      
      // Find returning favorites - tracks that are in long term and recent, but not medium term
      const returningFavorites = topTracksData.short_term
        .filter(shortTrack => 
          topTracksData.long_term.some(longTrack => longTrack.id === shortTrack.id) &&
          !topTracksData.medium_term.some(medTrack => medTrack.id === shortTrack.id)
        )
        .slice(0, 5)
        .map(track => ({
          ...track,
          type: 'returning',
          message: 'Returning favorite - back in rotation after a break'
        }));
      
      patterns.push(...consistentTracks, ...recentObsessions, ...returningFavorites);
    }
    
    return patterns;
  };

  const renderGenreAnalysis = () => {
    if (genreAnalysis.length === 0) return null;

    return (
      <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Genre Evolution</h3>
        <div className="space-y-5">
          {genreAnalysis.map(genre => (
            <div key={genre.name} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 capitalize">{genre.name}</span>
                <span className="text-xs text-gray-500">
                  {Math.round((genre.short_term - genre.long_term) * 100)}% 
                  {genre.short_term > genre.long_term ? ' ↑' : genre.short_term < genre.long_term ? ' ↓' : ' -'} change
                </span>
              </div>
              <div className="flex h-6 rounded-md overflow-hidden bg-gray-200">
                <div 
                  className="bg-blue-500 flex items-center justify-center h-full transition-all" 
                  style={{ width: `${Math.min(100, genre.short_term * 80)}%` }}
                >
                  <span className="text-xs font-medium px-1 text-white truncate">Recent</span>
                </div>
                <div 
                  className="bg-purple-500 flex items-center justify-center h-full transition-all" 
                  style={{ width: `${Math.min(100, genre.medium_term * 80)}%` }}
                >
                  <span className="text-xs font-medium px-1 text-white truncate">6 Months</span>
                </div>
                <div 
                  className="bg-green-500 flex items-center justify-center h-full transition-all" 
                  style={{ width: `${Math.min(100, genre.long_term * 80)}%` }}
                >
                  <span className="text-xs font-medium px-1 text-white truncate">All Time</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTrendingArtists = () => {
    const trendingArtists = findTrendingArtists();
    
    if (trendingArtists.length === 0) return null;
    
    return (
      <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Trending Artists</h3>
        <div className="space-y-3">
          {trendingArtists.map((artist: any) => (
            <div key={artist.id} className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 flex-shrink-0 rounded-full overflow-hidden mr-3">
                {artist.imageUrl ? (
                  <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <UserIcon className="text-white w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{artist.name}</h4>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    artist.direction === 'up' ? 'bg-green-100 text-green-700' : 
                    artist.direction === 'down' ? 'bg-red-100 text-red-700' : 
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {artist.direction === 'up' ? `↑ ${Math.abs(artist.rankChange)} positions` : 
                     artist.direction === 'down' ? `↓ ${Math.abs(artist.rankChange)} positions` : 
                     'New entry!'}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {artist.genres && artist.genres.slice(0, 2).join(', ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTrackPatterns = () => {
    const patterns = findInterestingTrackPatterns();
    
    if (patterns.length === 0) return null;
    
    return (
      <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Track Insights</h3>
        <div className="space-y-3">
          {patterns.map((track) => (
            <div key={track.id} className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 flex-shrink-0 rounded overflow-hidden mr-3">
                {track.albumImage ? (
                  <img src={track.albumImage} alt={track.albumName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <MusicIcon className="text-white w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 truncate">{track.name}</h4>
                <p className="text-xs text-gray-500 truncate">{track.artists.join(', ')}</p>
                <div className={`mt-1 px-2 py-1 rounded text-xs font-medium inline-block ${
                  track.type === 'consistent' ? 'bg-purple-100 text-purple-700' : 
                  track.type === 'obsession' ? 'bg-red-100 text-red-700' : 
                  'bg-blue-100 text-blue-700'
                }`}>
                  {track.message}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderInsights = () => {
    if (isLoading) return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-400 border-t-transparent"></div>
      </div>
    );

    if (fetchError) return (
      <div className="bg-white bg-opacity-70 backdrop-blur-sm border border-red-200 rounded-xl p-6 shadow-lg">
        <h3 className="text-red-500 font-medium text-lg mb-2">Error loading trends data</h3>
        <p className="text-gray-700">{fetchError}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );

    return (
      <div className="space-y-8">
        {renderGenreAnalysis()}
        {renderTrendingArtists()}
        {renderTrackPatterns()}
      </div>
    );
  };

  const renderTimeRangeComparison = () => {
    if (isLoading) return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-400 border-t-transparent"></div>
      </div>
    );

    if (fetchError) return (
      <div className="bg-white bg-opacity-70 backdrop-blur-sm border border-red-200 rounded-xl p-6 shadow-lg">
        <h3 className="text-red-500 font-medium text-lg mb-2">Error loading trends data</h3>
        <p className="text-gray-700">{fetchError}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );

    const data = activeTab === 'tracks' ? topTracksData : topArtistsData;
    
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Object.entries(data).map(([timeRange, items]) => (
            <div key={timeRange} className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{renderTimeRangeLabel(timeRange)}</h3>
              <div className="space-y-3">
                {items.slice(0, 5).map((item: any, index: number) => (
                  <div key={item.id} className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0 w-8 h-8 mr-3 relative">
                      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-green-400 to-blue-500 rounded-md">
                        {index + 1}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                      {activeTab === 'tracks' && (
                        <p className="text-xs text-gray-500 truncate">{item.artists.join(', ')}</p>
                      )}
                      {activeTab === 'artists' && item.genres && (
                        <p className="text-xs text-gray-500 truncate">{item.genres.slice(0, 2).join(', ')}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-green-200 relative z-10">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mr-4 shadow-lg">
            <TrendingUpIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">
            Your Music Trends
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

      {/* Tab selector */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setActiveTab('tracks')}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${activeTab === 'tracks' ? 'bg-green-100 text-green-700' : 'bg-white bg-opacity-70 text-gray-600 hover:bg-opacity-100'}`}
        >
          <MusicIcon className="w-4 h-4 mr-2" />
          Top Tracks
        </button>
        <button
          onClick={() => setActiveTab('artists')}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${activeTab === 'artists' ? 'bg-blue-100 text-blue-700' : 'bg-white bg-opacity-70 text-gray-600 hover:bg-opacity-100'}`}
        >
          <UserIcon className="w-4 h-4 mr-2" />
          Top Artists
        </button>
        <button
          onClick={() => setActiveTab('genres')}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${activeTab === 'genres' ? 'bg-purple-100 text-purple-700' : 'bg-white bg-opacity-70 text-gray-600 hover:bg-opacity-100'}`}
        >
          <BarChart2Icon className="w-4 h-4 mr-2" />
          Insights
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'genres' ? renderInsights() : renderTimeRangeComparison()}

      {/* Explanation */}
      <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100 mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Trends</h3>
        <p className="text-gray-600 text-sm">
          This page analyzes how your music preferences have changed over different time periods. Compare your top tracks and artists, see which genres are trending in your listening habits, and discover patterns in your music taste evolution.
        </p>
      </div>
    </div>
  );
};

export default Trends;