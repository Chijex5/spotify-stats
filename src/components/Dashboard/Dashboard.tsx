import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSpotifyData } from '../../contexts/SpotifyDataContext';
import TrackItem from '../shared/TrackItem';
import SongOfTheDayModal from '../SongOfTheDayModal';
import { 
  TrendingUpIcon, 
  ClockIcon, 
  ListMusicIcon, 
  ChevronRightIcon, 
  PlayIcon, 
  StarIcon, 
  Headphones, 
  BarChart2Icon, 
  UserIcon,
  CalendarIcon,
  HeartIcon,
  MusicIcon,
  PieChartIcon,
  RefreshCwIcon
} from 'lucide-react';
import { FaSpotify } from "react-icons/fa";

const Dashboard: React.FC = () => {
  const {
    topTracks,
    recentlyPlayed,
    playlists,
    songOfTheDay,
    isSongOfTheDayOpened,
    setIsSongOfTheDayOpened,
    loading,
    error,
    refreshData
  } = useSpotifyData();
  
  const [isSongOfTheDayModalOpen, setIsSongOfTheDayModalOpen] = useState(false);
  const [listeningInsights, setListeningInsights] = useState<any>(null);
  const [artistDiversity, setArtistDiversity] = useState<number>(0);
  const [mostActiveTime, setMostActiveTime] = useState<string>('');
  const [recentMoodScore, setRecentMoodScore] = useState<number>(0);

  useEffect(() => {
    if (songOfTheDay && !isSongOfTheDayOpened) {
      setIsSongOfTheDayModalOpen(true);
    }
    
    if (recentlyPlayed.length > 0 && topTracks.length > 0) {
      analyzeListeningData();
    }
  }, [songOfTheDay, isSongOfTheDayOpened, recentlyPlayed, topTracks]);

  const analyzeListeningData = () => {
    // Calculate artist diversity (unique artists / total tracks in recent plays)
    const uniqueArtists = new Set();
    recentlyPlayed.forEach(track => {
      track.artists.forEach(artist => uniqueArtists.add(artist));
    });
    const diversity = Math.min(100, Math.round((uniqueArtists.size / recentlyPlayed.length) * 100));
    setArtistDiversity(diversity);
    
    // Determine most active listening time
    const timeCount: {[key: string]: number} = {
      'morning': 0,
      'afternoon': 0,
      'evening': 0,
      'night': 0
    };
    
    recentlyPlayed.forEach(track => {
      if (track.played_at) {
        const hour = new Date(track.played_at).getHours();
        if (hour >= 5 && hour < 12) timeCount.morning++;
        else if (hour >= 12 && hour < 17) timeCount.afternoon++;
        else if (hour >= 17 && hour < 22) timeCount.evening++;
        else timeCount.night++;
      }
    });
    
    const mostActive = Object.entries(timeCount).sort((a, b) => b[1] - a[1])[0][0];
    setMostActiveTime(mostActive);
    
    // Calculate mood score based on recent top tracks (using popularity as proxy)
    // Higher popularity generally means more upbeat/popular songs
    const avgPopularity = topTracks.slice(0, 10).reduce((sum, track) => sum + track.popularity, 0) / 10;
    setRecentMoodScore(Math.round(avgPopularity / 10));
    
    // Generate insights based on listening patterns
    generateInsights(uniqueArtists.size, mostActive, avgPopularity);
  };
  
  const generateInsights = (uniqueArtistCount: number, peakTime: string, popularityScore: number) => {
    const insights = [];
    
    // Artist diversity insight
    if (uniqueArtistCount > 15) {
      insights.push({
        type: 'explorer',
        title: 'Musical Explorer',
        description: `You've listened to ${uniqueArtistCount} different artists recently! You enjoy musical variety.`,
        icon: <UserIcon className="w-5 h-5 text-purple-500" />
      });
    } else if (uniqueArtistCount < 8) {
      insights.push({
        type: 'loyal',
        title: 'Artist Loyalty',
        description: `You're focusing on a few favorite artists lately. Deep diving into their catalogs?`,
        icon: <HeartIcon className="w-5 h-5 text-red-500" />
      });
    }
    
    // Time pattern insight
    insights.push({
      type: 'schedule',
      title: 'Prime Listening Time',
      description: `Your music often accompanies you during the ${peakTime}, your peak listening time.`,
      icon: <CalendarIcon className="w-5 h-5 text-blue-500" />
    });
    
    // Mood/popularity insight
    if (popularityScore > 8) {
      insights.push({
        type: 'mainstream',
        title: 'Chart Topper',
        description: 'Your recent favorites include many popular tracks. You have your finger on the pulse!',
        icon: <TrendingUpIcon className="w-5 h-5 text-green-500" />
      });
    } else if (popularityScore < 6) {
      insights.push({
        type: 'niche',
        title: 'Hidden Gems',
        description: 'You tend to enjoy tracks off the beaten path. A true musical connoisseur!',
        icon: <MusicIcon className="w-5 h-5 text-amber-500" />
      });
    }
    
    setListeningInsights(insights);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-400"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500 absolute top-0"></div>
          </div>
          <p className="mt-4 text-gray-600 animate-pulse">Loading your musical journey...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white bg-opacity-70 backdrop-blur-sm border border-red-200 rounded-xl p-6 shadow-lg">
        <h3 className="text-red-500 font-medium text-lg mb-2">Error loading data</h3>
        <p className="text-gray-700">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Find common genres among top tracks (using artist IDs to infer genres)
  const getTopGenres = () => {
    const genreCounts: {[key: string]: number} = {};
    const processedArtistIds = new Set();
    
    topTracks.forEach(track => {
      if (track.artistIds) {
        track.artistIds.forEach((artistId: string) => {
          if (!processedArtistIds.has(artistId)) {
            // This is a simplified approach - in reality, you'd fetch artist genres
            // For now, we'll use artist names as stand-ins for their primary genre
            const artistName = track.artists[track.artistIds.indexOf(artistId)];
            genreCounts[artistName] = (genreCounts[artistName] || 0) + 1;
            processedArtistIds.add(artistId);
          }
        });
      }
    });
    
    return Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name);
  };

  const topArtists = Array.from(
    topTracks.reduce((map, track) => {
      track.artists.forEach(artist => {
        if (!map.has(artist)) {
          map.set(artist, { name: artist, count: 0 });
        }
        map.get(artist).count++;
      });
      return map;
    }, new Map())
  )
    .map(([_, artist]) => artist)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // Find the current streak (consecutive days with listening activity)
  const calculateStreak = () => {
    if (recentlyPlayed.length === 0) return 0;
    
    const dates = recentlyPlayed
      .filter(track => track.played_at)
      .map(track => new Date(track.played_at!).toISOString().split('T')[0]);
    
    const uniqueDates = Array.from(new Set(dates)).sort();
    
    let streak = 1;
    const today = new Date().toISOString().split('T')[0];
    
    // Check if listened today
    if (uniqueDates[uniqueDates.length - 1] !== today) {
      return 0; // Broke the streak
    }
    
    // Count consecutive days
    for (let i = uniqueDates.length - 2; i >= 0; i--) {
      const currDate = new Date(uniqueDates[i]);
      const prevDate = new Date(uniqueDates[i + 1]);
      
      const diffTime = prevDate.getTime() - currDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-green-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Decorative elements */}
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-24 -right-16 w-60 h-60 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      
        {/* Song of the Day floating button */}
        {songOfTheDay && (
          <button 
            onClick={() => setIsSongOfTheDayModalOpen(true)}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold py-3 px-6 rounded-full shadow-xl z-40 flex items-center transition-all hover:scale-105 hover:shadow-lg"
          >
            <StarIcon className="w-5 h-5 mr-2" /> Song of the Day!
          </button>
        )}
        
        <SongOfTheDayModal 
          isOpen={isSongOfTheDayModalOpen} 
          onClose={() => {
            setIsSongOfTheDayModalOpen(false); 
            setIsSongOfTheDayOpened(true);
          }}
        />
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-green-200 relative z-10">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mr-4 shadow-lg">
              <FaSpotify className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">
                Your Music Story
              </h1>
              <p className="text-gray-600 text-sm">
                A personalized journey through your listening habits
              </p>
            </div>
          </div>
          <button
            onClick={refreshData}
            className="flex items-center mt-3 sm:mt-0 px-4 py-2 bg-white bg-opacity-70 hover:bg-opacity-100 text-gray-700 rounded-lg transition-colors shadow-sm border border-gray-200"
          >
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            <span>Refresh Data</span>
          </button>
        </header>

        {/* Listening Summary */}
        <section className="relative z-10">
          <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 mb-5">
              Your Listening Profile
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {/* Listening Streak */}
              <div className="bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
                <div className="bg-indigo-500 rounded-full p-2 mb-2">
                  <CalendarIcon className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-indigo-600">{calculateStreak()}</span>
                <span className="text-xs text-indigo-600 text-center">Day{calculateStreak() !== 1 ? 's' : ''} Streak</span>
              </div>
              
              {/* Artist Diversity */}
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
                <div className="bg-purple-500 rounded-full p-2 mb-2">
                  <UserIcon className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-purple-600">{artistDiversity}%</span>
                <span className="text-xs text-purple-600 text-center">Artist Diversity</span>
              </div>
              
              {/* Peak Listening Time */}
              <div className="bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
                <div className="bg-amber-500 rounded-full p-2 mb-2">
                  <ClockIcon className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-amber-600 capitalize">{mostActiveTime}</span>
                <span className="text-xs text-amber-600 text-center">Peak Listening</span>
              </div>
              
              {/* Mood Score */}
              <div className="bg-gradient-to-br from-green-100 to-teal-100 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
                <div className="bg-green-500 rounded-full p-2 mb-2">
                  <PieChartIcon className="h-5 w-5 text-white" />
                </div>
                <div className="flex items-center">
                  {[...Array(10)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1.5 h-${1 + Math.min(8, Math.abs(i - 4) + 1)} rounded-sm mx-px ${
                        i < recentMoodScore ? 'bg-green-500' : 'bg-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-xs text-green-600 mt-1 text-center">
                  {recentMoodScore <= 3 ? 'Indie Vibes' : 
                   recentMoodScore <= 6 ? 'Mixed Taste' : 'Trending Tracks'}
                </span>
              </div>
            </div>
            
            {/* Insights Cards */}
            {listeningInsights && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {listeningInsights.map((insight: any, index: number) => (
                  <div 
                    key={index}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center mb-2">
                      {insight.icon}
                      <h3 className="ml-2 font-semibold text-gray-800">{insight.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* Top Artists & Genres Summary */}
        <section className="space-y-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Artists */}
            <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mr-3 shadow-md">
                    <UserIcon className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Your Top Artists</h2>
                </div>
                <Link 
                  to="/dashboard/trends" 
                  className="text-xs text-purple-500 hover:underline flex items-center"
                >
                  <span>See trends</span>
                  <ChevronRightIcon className="h-3 w-3 ml-1" />
                </Link>
              </div>
              
              <div className="space-y-3">
                {topArtists.map((artist, index) => (
                  <div key={index} className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full text-white font-bold text-lg mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{artist.name}</h3>
                      <div className="flex items-center mt-1">
                        <div className="bg-purple-200 h-2 rounded-full w-full max-w-32">
                          <div 
                            className="bg-purple-500 h-full rounded-full" 
                            style={{ width: `${Math.min(100, (artist.count / topTracks.length) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 ml-2">{artist.count} tracks</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Link 
                  to="/dashboard/trends" 
                  className="block text-center py-2 mt-2 w-full bg-white text-purple-500 rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors text-sm"
                >
                  View All Artist Trends
                </Link>
              </div>
            </div>
            
            {/* Recently Played Pattern */}
            <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mr-3 shadow-md">
                    <ClockIcon className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Listening Pattern</h2>
                </div>
              </div>
              
              <div className="flex items-center justify-center h-40 mb-4">
                {/* Simplified listening pattern visualization */}
                <div className="flex items-end justify-between w-full max-w-64 h-32">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                    // Generate mock data for visualization
                    const height = 20 + Math.floor(Math.random() * 60);
                    const today = new Date().getDay();
                    const isToday = (today === 0 ? 6 : today - 1) === index;
                    
                    return (
                      <div key={day} className="flex flex-col items-center">
                        <div 
                          className={`w-8 ${isToday ? 'bg-blue-500' : 'bg-blue-300'} rounded-t-md`}
                          style={{ height: `${height}%` }}
                        ></div>
                        <span className="text-xs text-gray-500 mt-2">{day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="text-sm font-medium text-blue-700 mb-1">This Week's Rhythm</h3>
                <p className="text-xs text-blue-600">
                  You've been most active on {['weekends', 'weekdays'][Math.floor(Math.random() * 2)]}, 
                  with {mostActiveTime} being your favorite time to enjoy music.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Top Tracks Preview */}
        <section className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mr-3 shadow-md">
                <TrendingUpIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">Your Top Tracks</h2>
                <p className="text-xs text-gray-500">Featuring {getTopGenres().join(', ')}</p>
              </div>
            </div>
            <Link 
              to="/dashboard/top-tracks" 
              className="flex items-center text-sm px-4 py-2 rounded-md bg-white bg-opacity-70 hover:bg-opacity-100 text-gray-700 border border-gray-200 transition-colors shadow-sm"
            >
              <span>View all</span>
              <ChevronRightIcon className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="bg-white bg-opacity-70 rounded-xl overflow-hidden backdrop-blur-sm shadow-lg border border-gray-100">
            {topTracks.slice(0, 5).map((track, index) => 
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
            )}
          </div>
        </section>
        
        {/* Playlists Preview */}
        <section className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mr-3 shadow-md">
                <ListMusicIcon className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Your Playlists</h2>
            </div>
            <Link 
              to="/dashboard/playlists" 
              className="flex items-center text-sm px-4 py-2 rounded-md bg-white bg-opacity-70 hover:bg-opacity-100 text-gray-700 border border-gray-200 transition-colors shadow-sm"
            >
              <span>View all</span>
              <ChevronRightIcon className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {playlists.slice(0, 5).map(playlist => (
              <div key={playlist.id} className="bg-white bg-opacity-70 rounded-xl overflow-hidden group border border-gray-100 shadow-md transition-transform hover:scale-105">
                <div className="aspect-square relative">
                  <img 
                    src={playlist.imageUrl || '/api/placeholder/300/300'} 
                    alt={playlist.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/60 to-blue-500/60 opacity-0 group-hover:opacity-80 flex items-center justify-center transition-opacity">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center transform transition-transform group-hover:scale-110 shadow-lg">
                      <PlayIcon className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-800 truncate">
                    {playlist.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <Headphones className="w-3 h-3 mr-1" />
                    {playlist.trackCount} tracks
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Recent Activity & Recommendations */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {/* Recently Played */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mr-3 shadow-md">
                <ClockIcon className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Recently Played</h2>
            </div>
            <div className="bg-white bg-opacity-70 rounded-xl overflow-hidden backdrop-blur-sm shadow-lg border border-gray-100">
              {recentlyPlayed.slice(0, 4).map(track => 
                <TrackItem 
                key={track.id} 
                id={track.id} 
                name={track.name} 
                artists={track.artists} 
                albumName={track.albumName} 
                albumImage={track.albumImage} 
                duration={track.duration}
                popularity={track.popularity || 0} 
                showPosition={false}
                />
              )}
              <Link 
                to="/dashboard/recently-played" 
                className="block text-center py-3 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              >
                View All Recent Plays
              </Link>
            </div>
          </div>
          
          {/* Music DNA */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mr-3 shadow-md">
                <BarChart2Icon className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-400">Your Music DNA</h2>
            </div>
            <div className="bg-white bg-opacity-70 rounded-xl overflow-hidden backdrop-blur-sm shadow-lg border border-gray-100 p-4">
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-48 h-48">
                  {/* Music DNA Visualization (Simplified) */}
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <g transform="translate(100, 100)">
                      {/* Dynamic circle visualization based on genres */}
                      {getTopGenres().map((genre, i) => (
                        <circle 
                          key={i}
                          r={30 + (i * 15)} 
                          fill="none" 
                          stroke={`hsl(${(i * 40) + 180}, 70%, 60%)`}
                          strokeWidth={4 - (i * 0.5)}
                          strokeDasharray={`${6 + (i * 2)} ${2 + i}`}
                          className="animate-pulse"
                          style={{animationDelay: `${i * 0.3}s`, animationDuration: `${5 + i}s`}}
                        />
                      ))}
                      <circle r="20" fill="url(#musicDnaGradient)" className="animate-pulse" style={{animationDuration: '3s'}} />
                      <defs>
                        <radialGradient id="musicDnaGradient">
                          <stop offset="0%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#ef4444" />
                        </radialGradient>
                      </defs>
                    </g>
                  </svg>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-lg border border-amber-100">
                  <h3 className="text-sm font-medium text-amber-700 mb-1">Your Musical Personality</h3>
                  <p className="text-xs text-amber-600">
                    Based on your listening patterns, you're a 
                    <span className="font-medium"> {artistDiversity > 70 ? 'Musical Explorer' : artistDiversity > 40 ? 'Varied Listener' : 'Dedicated Fan'}</span>
                    {artistDiversity > 70 
                      ? ' who loves discovering diverse artists and genres.'
                      : artistDiversity > 40 
                        ? ' with a healthy mix of favorites and new discoveries.'
                        : ' who deeply appreciates your carefully chosen artists.'}
                  </p>
                </div>
                
                <Link 
                  to="/dashboard/insights" 
                  className="block text-center py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-600 hover:from-amber-200 hover:to-orange-200 rounded-lg transition-colors border border-amber-200"
                >
                  Discover Your Full Music DNA
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Recommendations Section */}
        <section className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full mr-3 shadow-md">
                <StarIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Recommended For You</h2>
                <p className="text-xs text-gray-500">Based on your recent listening</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {/* Mock recommendations - in a real app these would come from Spotify API */}
            {Array.from({length: 5}).map((_, index) => (
              <div key={index} className="bg-white bg-opacity-70 rounded-xl overflow-hidden border border-gray-100 shadow-md transition-transform hover:scale-105 group">
                <div className="aspect-square relative">
                  {/* Use placeholder for demo */}
                  <img 
                    src={`/api/placeholder/${300 + index}/${300 + index}`} 
                    alt={`Recommendation ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/60 to-purple-500/60 opacity-0 group-hover:opacity-80 flex items-center justify-center transition-opacity">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center transform transition-transform group-hover:scale-110 shadow-lg">
                      <PlayIcon className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-800 truncate">
                    {["New Discoveries", "Fresh Beats", "Similar Artists", "For Your Mood", "Weekend Vibes"][index]}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Based on your {["favorite genres", "top artists", "recent plays", "playlists", "current mood"][index]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Footer Links */}
        <footer className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Explore More</h3>
            <div className="flex flex-wrap gap-2">
              <Link to="/dashboard/trends" className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm hover:bg-purple-200 transition-colors">
                Music Trends
              </Link>
              <Link to="/dashboard/insights" className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm hover:bg-blue-200 transition-colors">
                Listening Insights
              </Link>
              <Link to="/dashboard/insights" className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm hover:bg-green-200 transition-colors">
                Discover New Music
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <FaSpotify className="text-green-500 h-5 w-5 mr-2" />
            <span className="text-sm text-gray-600">Powered by Spotify</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;