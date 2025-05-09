import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSpotifyData } from '../../contexts/SpotifyDataContext';
import { 
  BarChart2Icon, 
  UserIcon, 
  HeartIcon, 
  MusicIcon, 
  PieChartIcon, 
  CalendarIcon,
  ClockIcon,
  ArrowLeftIcon,
  TrendingUpIcon,
  BookOpenIcon,
  ZapIcon,
  Headphones,
  Radio
} from 'lucide-react';
import { FaSpotify } from "react-icons/fa";

// Sample genre data for visualization - in a real app, this would come from the API
const MOOD_METRICS = {
  energy: { label: "Energy", description: "How energetic your music feels" },
  danceability: { label: "Danceability", description: "How suitable for dancing your tracks are" },
  acousticness: { label: "Acousticness", description: "How acoustic vs. electronic your music is" },
  positivity: { label: "Positivity", description: "The emotional tone of your music" },
  tempo: { label: "Tempo", description: "The speed of your music tracks" }
};

const MusicInsights = () => {
  const {
    topTracks,
    recentlyPlayed,
    loading,
    error
  } = useSpotifyData();

  const [musicDNA, setMusicDNA] = useState(null);
  const [genreDistribution, setGenreDistribution] = useState([]);
  const [moodMetrics, setMoodMetrics] = useState({});
  const [listeningPatterns, setListeningPatterns] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [dnaInsight, setDnaInsight] = useState("");

  useEffect(() => {
    if (topTracks.length > 0 && recentlyPlayed.length > 0) {
      analyzeMusicalTaste();
    }
  }, [topTracks, recentlyPlayed]);

  const analyzeMusicalTaste = () => {
    // Calculate artist diversity
    const uniqueArtists = new Set();
    const combinedTracks = [...topTracks, ...recentlyPlayed];
    
    combinedTracks.forEach(track => {
      track.artists.forEach(artist => uniqueArtists.add(artist));
    });
    
    // Mock genre data - in a real app, this would come from Spotify API analysis
    const mockGenres = [
      { name: 'Pop', percentage: 32 },
      { name: 'Rock', percentage: 25 },
      { name: 'Hip Hop', percentage: 18 },
      { name: 'Electronic', percentage: 15 },
      { name: 'Jazz', percentage: 5 },
      { name: 'Classical', percentage: 3 },
      { name: 'Other', percentage: 2 }
    ];
    
    setGenreDistribution(mockGenres);
    
    // Generate mock mood metrics based on top tracks
    const mockMoodMetrics = {};
    Object.keys(MOOD_METRICS).forEach(key => {
      // Generate realistic-looking values
      let baseValue = 0;
      switch(key) {
        case 'energy': baseValue = 0.65; break;
        case 'danceability': baseValue = 0.72; break;
        case 'acousticness': baseValue = 0.38; break;
        case 'positivity': baseValue = 0.55; break;
        case 'tempo': baseValue = 0.68; break;
        default: baseValue = 0.5;
      }
      
      // Add some randomness
      mockMoodMetrics[key] = Math.min(1, Math.max(0, baseValue + (Math.random() * 0.2 - 0.1)));
    });
    
    setMoodMetrics(mockMoodMetrics);
    
    // Create mock listening patterns data
    const weekdayDistribution = {
      'Monday': 12,
      'Tuesday': 14,
      'Wednesday': 16,
      'Thursday': 18,
      'Friday': 25,
      'Saturday': 20,
      'Sunday': 15
    };
    
    const timeOfDayDistribution = {
      'Morning (5am-12pm)': 20,
      'Afternoon (12pm-5pm)': 30,
      'Evening (5pm-10pm)': 35,
      'Night (10pm-5am)': 15
    };
    
    setListeningPatterns({
      weekdayDistribution,
      timeOfDayDistribution
    });
    
    // Generate DNA Insight based on genre distribution and mood metrics
    const primaryGenre = mockGenres[0].name;
    const secondaryGenre = mockGenres[1].name;
    const energy = mockMoodMetrics.energy > 0.6 ? "energetic" : "relaxed";
    const acousticness = mockMoodMetrics.acousticness > 0.5 ? "acoustic" : "electronic";
    const positivity = mockMoodMetrics.positivity > 0.6 ? "upbeat" : "introspective";
    
    const dnaDescription = `Your Music DNA reveals you're primarily a ${primaryGenre} enthusiast with a strong appreciation for ${secondaryGenre}. Your listening style tends to be ${energy} and ${positivity}, with a preference for ${acousticness} sounds. This unique combination creates your distinct musical fingerprint that sets you apart from other listeners.`;
    
    setDnaInsight(dnaDescription);
    
    // Create visual DNA representation - this would be much more sophisticated in a real app
    const dnaProfile = {
      dominantGenre: primaryGenre,
      secondaryGenre: secondaryGenre,
      energy: mockMoodMetrics.energy,
      acousticness: mockMoodMetrics.acousticness,
      danceability: mockMoodMetrics.danceability,
      positivity: mockMoodMetrics.positivity,
      artistDiversity: Math.min(100, (uniqueArtists.size / combinedTracks.length) * 150)
    };
    
    setMusicDNA(dnaProfile);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-400"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500 absolute top-0"></div>
          </div>
          <p className="mt-4 text-gray-600 animate-pulse">Analyzing your musical DNA...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white bg-opacity-70 backdrop-blur-sm border border-red-200 rounded-xl p-6 shadow-lg">
        <h3 className="text-red-500 font-medium text-lg mb-2">Error loading insights</h3>
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

  const renderDNAVisualization = () => {
    if (!musicDNA) return null;
    
    // Calculate dynamic values for visualization
    const energyHeight = 15 + (musicDNA.energy * 30);
    const danceHeight = 15 + (musicDNA.danceability * 30);
    const acousticHeight = 15 + (musicDNA.acousticness * 30);
    const positivityHeight = 15 + (musicDNA.positivity * 30);
    
    return (
      <div className="flex flex-col items-center">
        <div className="w-full max-w-md h-64 relative">
          <svg viewBox="0 0 400 200" className="w-full h-full">
            {/* DNA Helix Structure */}
            <defs>
              <linearGradient id="dnaGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4338ca" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="dnaGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            
            {/* First DNA Strand */}
            <path 
              d={`M 50 10 
                  C 100 30, 150 50, 200 10 
                  C 250 -30, 300 30, 350 10
                  C 400 -10, 450 30, 500 10`}
              fill="none" 
              stroke="url(#dnaGradient1)" 
              strokeWidth="3"
              filter="url(#glow)"
            />
            
            {/* Second DNA Strand */}
            <path 
              d={`M 50 190 
                  C 100 170, 150 150, 200 190 
                  C 250 230, 300 170, 350 190
                  C 400 210, 450 170, 500 190`}
              fill="none" 
              stroke="url(#dnaGradient2)" 
              strokeWidth="3"
              filter="url(#glow)"
            />
            
            {/* Connectors between strands */}
            {[60, 120, 180, 240, 300, 360].map((x, i) => (
              <React.Fragment key={i}>
                <line 
                  x1={x} y1={i % 2 ? 170 : 30} 
                  x2={x} y2={i % 2 ? 30 : 170} 
                  stroke={i % 2 ? "#8b5cf6" : "#3b82f6"} 
                  strokeWidth="2"
                  strokeDasharray="5,3"
                />
                <circle 
                  cx={x} cy={i % 2 ? 170 : 30} 
                  r={i === 0 ? energyHeight : i === 1 ? danceHeight : i === 2 ? acousticHeight : i === 3 ? positivityHeight : 15}
                  fill={i % 2 ? "rgba(139, 92, 246, 0.2)" : "rgba(59, 130, 246, 0.2)"}
                  stroke={i % 2 ? "#8b5cf6" : "#3b82f6"}
                  strokeWidth="1.5"
                />
              </React.Fragment>
            ))}
            
            {/* Genre Labels */}
            <text x="60" y="20" fontSize="10" fill="#4338ca" textAnchor="middle">Energy</text>
            <text x="120" y="180" fontSize="10" fill="#8b5cf6" textAnchor="middle">Dance</text>
            <text x="180" y="20" fontSize="10" fill="#4338ca" textAnchor="middle">Acoustic</text>
            <text x="240" y="180" fontSize="10" fill="#8b5cf6" textAnchor="middle">Mood</text>
            <text x="300" y="20" fontSize="10" fill="#4338ca" textAnchor="middle">Variety</text>
            <text x="360" y="180" fontSize="10" fill="#8b5cf6" textAnchor="middle">Tempo</text>
          </svg>
        </div>
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-lg border border-indigo-200 max-w-2xl mt-4">
          <h3 className="text-lg font-semibold text-indigo-800 mb-2">Your Unique Music DNA</h3>
          <p className="text-indigo-700">{dnaInsight}</p>
        </div>
      </div>
    );
  };
  
  const renderGenrePieChart = () => {
    const total = genreDistribution.reduce((sum, genre) => sum + genre.percentage, 0);
    let startAngle = 0;
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-64 h-64">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <g transform="translate(50, 50)">
              {genreDistribution.map((genre, index) => {
                const angle = (genre.percentage / total) * 360;
                const endAngle = startAngle + angle;
                
                // Calculate SVG arc path
                const x1 = Math.cos((startAngle - 90) * Math.PI / 180) * 40;
                const y1 = Math.sin((startAngle - 90) * Math.PI / 180) * 40;
                const x2 = Math.cos((endAngle - 90) * Math.PI / 180) * 40;
                const y2 = Math.sin((endAngle - 90) * Math.PI / 180) * 40;
                
                const largeArcFlag = angle > 180 ? 1 : 0;
                
                const pathData = `M 0 0 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                
                const color = [
                  "#8b5cf6", "#3b82f6", "#ec4899", "#10b981", 
                  "#f59e0b", "#6366f1", "#ef4444", "#14b8a6"
                ][index % 8];
                
                // Label positioning calculation
                const labelAngle = startAngle + (angle / 2);
                const labelRadius = 25;
                const labelX = Math.cos((labelAngle - 90) * Math.PI / 180) * labelRadius;
                const labelY = Math.sin((labelAngle - 90) * Math.PI / 180) * labelRadius;
                
                // Store the end angle to be the start angle for the next slice
                const currentStartAngle = startAngle;
                startAngle = endAngle;
                
                return (
                  <g key={index}>
                    <path 
                      d={pathData} 
                      fill={color} 
                      opacity="0.8" 
                      stroke="white" 
                      strokeWidth="1"
                    />
                    {genre.percentage > 5 && (
                      <text 
                        x={labelX} 
                        y={labelY} 
                        textAnchor="middle" 
                        fill="white" 
                        fontSize="3.5"
                        fontWeight="bold"
                      >
                        {genre.name}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {genreDistribution.slice(0, 4).map((genre, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ 
                  backgroundColor: [
                    "#8b5cf6", "#3b82f6", "#ec4899", "#10b981"
                  ][index % 4] 
                }}
              ></div>
              <div>
                <div className="text-sm font-medium text-gray-700">{genre.name}</div>
                <div className="text-xs text-gray-500">{genre.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMoodMetricsChart = () => {
    return (
      <div className="space-y-4">
        {Object.entries(moodMetrics).map(([key, value]) => (
          <div key={key} className="space-y-1">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium text-gray-700">
                  {MOOD_METRICS[key].label}
                </div>
                <div className="text-xs text-gray-500">
                  {MOOD_METRICS[key].description}
                </div>
              </div>
              <div className="text-sm font-medium text-indigo-600">
                {Math.round(value * 100)}%
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full"
                style={{ 
                  width: `${value * 100}%`,
                  backgroundColor: key === 'energy' ? '#ef4444' : 
                                  key === 'danceability' ? '#f59e0b' : 
                                  key === 'acousticness' ? '#10b981' : 
                                  key === 'positivity' ? '#3b82f6' : '#8b5cf6'
                }}
              ></div>
            </div>
          </div>
        ))}
        
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-4">
          <h3 className="text-sm font-medium text-blue-700 mb-1">What This Means</h3>
          <p className="text-xs text-blue-600">
            Your listening mood is {moodMetrics.energy > 0.6 ? 'energetic' : 'relaxed'} and 
            {moodMetrics.positivity > 0.6 ? ' upbeat' : ' introspective'}, with a 
            {moodMetrics.danceability > 0.6 ? ' dance-friendly' : ' laid-back'} rhythm. You tend to prefer 
            {moodMetrics.acousticness > 0.5 ? ' acoustic' : ' electronic'} sounds with 
            {moodMetrics.tempo > 0.6 ? ' faster' : ' moderate'} tempos.
          </p>
        </div>
      </div>
    );
  };

  const renderListeningPatternsChart = () => {
    if (!listeningPatterns.weekdayDistribution) return null;
    
    const maxWeekdayValue = Math.max(...Object.values(listeningPatterns.weekdayDistribution));
    const maxTimeValue = Math.max(...Object.values(listeningPatterns.timeOfDayDistribution));
    
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-3">Weekly Listening Pattern</h3>
          <div className="flex items-end justify-between h-40 bg-gradient-to-b from-purple-50 to-white p-3 rounded-lg border border-purple-100">
            {Object.entries(listeningPatterns.weekdayDistribution).map(([day, value]) => (
              <div key={day} className="flex flex-col items-center">
                <div 
                  className="w-8 bg-gradient-to-t from-purple-500 to-indigo-400 rounded-t-md transition-all hover:from-purple-600 hover:to-indigo-500"
                  style={{ height: `${(value / maxWeekdayValue) * 100}%` }}
                ></div>
                <div className="text-xs text-gray-500 mt-2">{day.substring(0, 3)}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-3">Time of Day Preference</h3>
          <div className="grid grid-cols-4 gap-3">
            {Object.entries(listeningPatterns.timeOfDayDistribution).map(([time, value]) => {
              const icon = time.includes('Morning') ? <ClockIcon className="h-5 w-5" /> :
                        time.includes('Afternoon') ? <ZapIcon className="h-5 w-5" /> :
                        time.includes('Evening') ? <MusicIcon className="h-5 w-5" /> :
                        <HeartIcon className="h-5 w-5" />;
                        
              return (
                <div key={time} className="bg-gradient-to-b from-blue-50 to-white p-3 rounded-lg border border-blue-100 flex flex-col items-center">
                  <div className={`text-${value === maxTimeValue ? 'blue-500' : 'blue-400'}`}>
                    {icon}
                  </div>
                  <div className="text-center mt-2">
                    <div className="text-sm font-medium text-gray-700">{time.split(' ')[0]}</div>
                    <div className="text-xs text-gray-500">{value}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-green-50 p-3 rounded-lg border border-green-100">
          <h3 className="text-sm font-medium text-green-700 mb-1">Your Listening Schedule</h3>
          <p className="text-xs text-green-600">
            Your music most often accompanies you during 
            {Object.entries(listeningPatterns.timeOfDayDistribution)
              .sort((a, b) => b[1] - a[1])[0][0].split(' ')[0].toLowerCase()}, especially on 
            {Object.entries(listeningPatterns.weekdayDistribution)
              .sort((a, b) => b[1] - a[1])[0][0]}s. This pattern reveals when music is most integrated into your daily life.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Decorative elements */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-24 -right-16 w-60 h-60 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      
        {/* Header */}
        <header className="flex items-center justify-between pb-4 border-b border-indigo-200 relative z-10">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center justify-center w-10 h-10 bg-white rounded-full mr-4 shadow-md hover:bg-indigo-50 transition-colors">
              <ArrowLeftIcon className="w-5 h-5 text-indigo-500" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                Your Music DNA
              </h1>
              <p className="text-gray-600 text-sm">
                A deep analysis of your unique musical identity
              </p>
            </div>
          </div>
          <div className="flex items-center bg-white bg-opacity-70 px-3 py-2 rounded-full shadow-sm border border-indigo-100">
            <FaSpotify className="text-green-500 h-5 w-5 mr-2" />
            <span className="text-sm text-gray-600">Powered by Spotify</span>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto space-x-2 pb-2 relative z-10">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg flex items-center whitespace-nowrap transition-colors ${
              activeTab === 'overview' 
                ? 'bg-indigo-600 text-white font-medium shadow-md' 
                : 'bg-white bg-opacity-70 text-gray-700 hover:bg-opacity-100'
            }`}
          >
            <BookOpenIcon className="w-4 h-4 mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('genres')}
            className={`px-4 py-2 rounded-lg flex items-center whitespace-nowrap transition-colors ${
              activeTab === 'genres' 
                ? 'bg-indigo-600 text-white font-medium shadow-md' 
                : 'bg-white bg-opacity-70 text-gray-700 hover:bg-opacity-100'
            }`}
          >
            <MusicIcon className="w-4 h-4 mr-2" />
            Genre Distribution
          </button>
          <button
            onClick={() => setActiveTab('mood')}
            className={`px-4 py-2 rounded-lg flex items-center whitespace-nowrap transition-colors ${
              activeTab === 'mood' 
                ? 'bg-indigo-600 text-white font-medium shadow-md' 
                : 'bg-white bg-opacity-70 text-gray-700 hover:bg-opacity-100'
            }`}
          >
            <HeartIcon className="w-4 h-4 mr-2" />
            Mood Analysis
          </button>
          <button
            onClick={() => setActiveTab('patterns')}
            className={`px-4 py-2 rounded-lg flex items-center whitespace-nowrap transition-colors ${
              activeTab === 'patterns' 
                ? 'bg-indigo-600 text-white font-medium shadow-md' 
                : 'bg-white bg-opacity-70 text-gray-700 hover:bg-opacity-100'
            }`}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Listening Patterns
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-4 py-2 rounded-lg flex items-center whitespace-nowrap transition-colors ${
              activeTab === 'recommendations' 
                ? 'bg-indigo-600 text-white font-medium shadow-md' 
                : 'bg-white bg-opacity-70 text-gray-700 hover:bg-opacity-100'
            }`}
          >
            <Radio className="w-4 h-4 mr-2" />
            New Discoveries
          </button>
        </div>
        
        {/* Main Content Area */}
        <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-indigo-100 relative z-10">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-indigo-800 mb-2">Your Musical Fingerprint</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Just like your fingerprint, your music taste is unique to you. We've analyzed your listening habits to create a visual representation of what makes your musical taste special.
                </p>
              </div>
              
              {renderDNAVisualization()}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
                  <div className="flex items-center mb-2">
                    <MusicIcon className="w-5 h-5 text-indigo-500 mr-2" />
                    <h3 className="font-semibold text-indigo-700">Genre Diversity</h3>
                  </div>
                  <p className="text-sm text-indigo-600">
                    Your musical palette spans {genreDistribution.length} different genres, with a healthy mix of mainstream and niche sounds.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center mb-2">
                    <Headphones className="w-5 h-5 text-purple-500 mr-2" />
                    <h3 className="font-semibold text-purple-700">Listening Depth</h3>
                  </div>
                  <p className="text-sm text-purple-600">
                    You dive deep into your favorite artists' catalogs, showing appreciation for both hits and deep cuts.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-2">
                    <TrendingUpIcon className="w-5 h-5 text-blue-500 mr-2" />
                    <h3 className="font-semibold text-blue-700">Trend Alignment</h3>
                  </div>
                  <p className="text-sm text-blue-600">
                  Your taste is {musicDNA?.energy > 0.6 ? 
                      'ahead of contemporary trends' : 'focused on timeless classics'}, with an ear for what's meaningful to you.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setActiveTab('recommendations')}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-full shadow-md flex items-center transition-colors"
                >
                  <ZapIcon className="w-5 h-5 mr-2" />
                  Discover New Music Based on Your DNA
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'genres' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-indigo-800 mb-2">Your Genre Breakdown</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  This analysis shows how your listening is distributed across different musical genres, highlighting your primary music preferences.
                </p>
              </div>
              
              {renderGenrePieChart()}
              
              <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100">
                <h3 className="font-semibold text-indigo-700 mb-2">Genre Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white bg-opacity-70 rounded-lg p-3 border border-indigo-50">
                    <h4 className="font-medium text-sm text-indigo-600 mb-1">Primary Influence</h4>
                    <p className="text-gray-700 text-sm">
                      {genreDistribution[0]?.name} forms the foundation of your music taste, representing {genreDistribution[0]?.percentage}% of your listening activity.
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-70 rounded-lg p-3 border border-indigo-50">
                    <h4 className="font-medium text-sm text-purple-600 mb-1">Eclectic Range</h4>
                    <p className="text-gray-700 text-sm">
                      You enjoy exploring beyond mainstream, with {genreDistribution.filter(g => g.percentage < 10).length} niche genres in your regular rotation.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-700 mb-3">Top Artists By Genre</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {['Pop', 'Rock', 'Hip Hop'].map(genre => (
                    <div key={genre} className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 border border-gray-100">
                      <h4 className="font-medium text-sm text-gray-700 mb-2">{genre}</h4>
                      <ul className="space-y-2">
                        {['Artist One', 'Artist Two', 'Artist Three'].map((artist, i) => (
                          <li key={i} className="flex items-center text-sm">
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2 text-xs font-medium">
                              {i + 1}
                            </div>
                            {artist}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'mood' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-indigo-800 mb-2">Your Music Mood Profile</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Based on the audio features of your most listened tracks, this is the emotional and sonic profile of your music preferences.
                </p>
              </div>
              
              {renderMoodMetricsChart()}
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <HeartIcon className="w-5 h-5 text-blue-500" />
                    </div>
                    <h3 className="font-semibold text-blue-700">Emotional Landscape</h3>
                  </div>
                  <p className="text-sm text-blue-600">
                    Your music choices tend to evoke {moodMetrics.positivity > 0.65 ? "optimism and joy" : 
                    moodMetrics.positivity > 0.45 ? "balanced emotions" : "introspection and depth"}, 
                    suggesting you use music to {moodMetrics.positivity > 0.6 ? "uplift your spirits" : "process complex emotions"}.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <ZapIcon className="w-5 h-5 text-purple-500" />
                    </div>
                    <h3 className="font-semibold text-purple-700">Energy Profile</h3>
                  </div>
                  <p className="text-sm text-purple-600">
                    Your playlist energy suggests you prefer music that's 
                    {moodMetrics.energy > 0.7 ? " vibrant and invigorating" : 
                    moodMetrics.energy > 0.5 ? " moderately energetic" : " calm and soothing"}, 
                    paired with {moodMetrics.tempo > 0.6 ? "faster tempos" : "more relaxed rhythms"}.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm mt-4">
                <h3 className="font-semibold text-gray-700 mb-3">Mood-Based Recommendations</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-100">
                    <h4 className="font-medium text-sm text-blue-700 mb-2">When You Need Focus</h4>
                    <p className="text-xs text-blue-600 mb-2">
                      Based on your acoustic preferences and tempo comfort zone
                    </p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Instrumental compositions with minimal vocals</li>
                      <li>• Ambient electronic with steady rhythms</li>
                      <li>• Acoustic background pieces</li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg p-3 border border-pink-100">
                    <h4 className="font-medium text-sm text-pink-700 mb-2">For Energy Boost</h4>
                    <p className="text-xs text-pink-600 mb-2">
                      Matching your dance and energy preferences
                    </p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Upbeat tracks with strong rhythms</li>
                      <li>• High-energy pop and electronic dance music</li>
                      <li>• Motivational lyrics with dynamic production</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'patterns' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-indigo-800 mb-2">Your Listening Patterns</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Discover when and how you engage with music throughout your week and what it reveals about your listening habits.
                </p>
              </div>
              
              {renderListeningPatternsChart()}
              
              <div className="mt-8 bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-700 mb-3">Listening Context Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 border border-green-100">
                    <div className="flex items-center mb-2">
                      <ClockIcon className="w-4 h-4 text-green-500 mr-2" />
                      <h4 className="font-medium text-sm text-green-700">Peak Listening Time</h4>
                    </div>
                    <p className="text-xs text-green-600">
                      Your music engagement peaks during 
                      {Object.entries(listeningPatterns.timeOfDayDistribution)
                        .sort((a, b) => b[1] - a[1])[0][0]} 
                      hours, suggesting you use music to 
                      {Object.entries(listeningPatterns.timeOfDayDistribution)
                        .sort((a, b) => b[1] - a[1])[0][0].includes('Morning') ? ' start your day energized' : 
                        Object.entries(listeningPatterns.timeOfDayDistribution)
                          .sort((a, b) => b[1] - a[1])[0][0].includes('Afternoon') ? ' boost productivity' :
                        Object.entries(listeningPatterns.timeOfDayDistribution)
                          .sort((a, b) => b[1] - a[1])[0][0].includes('Evening') ? ' unwind after work' : ' accompany late nights'}.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-100">
                    <div className="flex items-center mb-2">
                      <CalendarIcon className="w-4 h-4 text-blue-500 mr-2" />
                      <h4 className="font-medium text-sm text-blue-700">Weekly Pattern</h4>
                    </div>
                    <p className="text-xs text-blue-600">
                      Your listening increases on 
                      {Object.entries(listeningPatterns.weekdayDistribution)
                        .sort((a, b) => b[1] - a[1])[0][0]}s and 
                      {Object.entries(listeningPatterns.weekdayDistribution)
                        .sort((a, b) => b[1] - a[1])[1][0]}s, 
                      with a {Object.entries(listeningPatterns.weekdayDistribution)
                        .sort((a, b) => a[1] - b[1])[0][1] < 10 ? 'significant' : 'moderate'} drop on 
                      {Object.entries(listeningPatterns.weekdayDistribution)
                        .sort((a, b) => a[1] - b[1])[0][0]}s.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-100">
                    <div className="flex items-center mb-2">
                      <UserIcon className="w-4 h-4 text-purple-500 mr-2" />
                      <h4 className="font-medium text-sm text-purple-700">Listening Style</h4>
                    </div>
                    <p className="text-xs text-purple-600">
                      Your pattern suggests you're a 
                      {Object.entries(listeningPatterns.weekdayDistribution)
                        .reduce((sum, [_, val]) => sum + val, 0) > 100 ? 'consistent' : 'situational'} 
                      listener who engages with music 
                      {Object.entries(listeningPatterns.timeOfDayDistribution)
                        .filter(([_, val]) => val > 15).length > 2 ? 'throughout the day' : 'at specific times'}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-indigo-800 mb-2">New Discoveries For You</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Based on your unique Music DNA, we've curated personalized recommendations to expand your musical horizons.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-5 border border-indigo-100">
                  <h3 className="font-semibold text-indigo-700 flex items-center mb-4">
                    <Radio className="w-5 h-5 mr-2" />
                    Artists You Might Love
                  </h3>
                  
                  <div className="space-y-3">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="flex items-center bg-white rounded-lg p-3 shadow-sm border border-indigo-50">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                          {String.fromCharCode(65 + i)}
                        </div>
                        <div className="ml-3">
                          <h4 className="font-medium text-gray-800">Artist Name {i+1}</h4>
                          <p className="text-xs text-gray-500">Similar to your top artists</p>
                        </div>
                        <button className="ml-auto bg-indigo-100 hover:bg-indigo-200 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full transition-colors flex items-center">
                          <MusicIcon className="w-3 h-3 mr-1" />
                          Listen
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-5 border border-pink-100">
                  <h3 className="font-semibold text-pink-700 flex items-center mb-4">
                    <Headphones className="w-5 h-5 mr-2" />
                    Fresh Tracks For You
                  </h3>
                  
                  <div className="space-y-3">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="flex items-center bg-white rounded-lg p-3 shadow-sm border border-pink-50">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                          {i+1}
                        </div>
                        <div className="ml-3">
                          <h4 className="font-medium text-gray-800">Track Title {i+1}</h4>
                          <p className="text-xs text-gray-500">Artist Name • Album Name</p>
                        </div>
                        <button className="ml-auto bg-pink-100 hover:bg-pink-200 text-pink-600 text-xs font-medium px-3 py-1 rounded-full transition-colors flex items-center">
                          <HeartIcon className="w-3 h-3 mr-1" />
                          Save
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold text-gray-700 mb-4">Discover New Playlists</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "Genre Explorer", desc: "Dive deeper into your favorite genres", color: "from-blue-400 to-blue-600" },
                    { name: "Mood Elevator", desc: "Tracks to boost your spirits", color: "from-green-400 to-green-600" },
                    { name: "Hidden Gems", desc: "Lesser-known tracks you'll love", color: "from-purple-400 to-purple-600" }
                  ].map((playlist, i) => (
                    <div key={i} className="relative overflow-hidden rounded-lg aspect-[3/2] shadow-md group">
                      <div className={`absolute inset-0 bg-gradient-to-br ${playlist.color} opacity-90`}></div>
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                      <div className="absolute inset-0 p-5 flex flex-col justify-end">
                        <h4 className="text-white font-bold text-lg">{playlist.name}</h4>
                        <p className="text-white text-opacity-90 text-sm">{playlist.desc}</p>
                        <button className="mt-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors backdrop-blur-sm flex items-center w-max">
                          <FaSpotify className="w-4 h-4 mr-2" />
                          Open in Spotify
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full shadow-md flex items-center transition-colors">
                  <FaSpotify className="w-5 h-5 mr-2" />
                  Export Recommendations to Spotify
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer area with additional info */}
        <footer className="mt-6 text-center text-gray-500 text-sm">
          <p>Data refreshes weekly. Last updated: May 5, 2025</p>
          <p className="mt-1">
            <Link to="/privacy-policy" className="text-indigo-500 hover:text-indigo-600 transition-colors">Privacy Policy</Link>
            {' • '}
            <Link to="/terms-of-use" className="text-indigo-500 hover:text-indigo-600 transition-colors">Terms of Use</Link>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default MusicInsights;