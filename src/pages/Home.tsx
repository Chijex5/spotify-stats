import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Dashboard from '../components/Dashboard/Dashboard';
import MusicInsights from '../components/Dashboard/MusicInsights';
import TopTracks from '../components/Dashboard/TopTracks';
import RecentlyPlayed from '../components/Dashboard/RecentlyPlayed';
import PlaylistHistory from '../components/Dashboard/PlaylistHistory';
import Trends from '../components/Dashboard/Trends';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfUse from './TermsOfUse';
import { useAuth } from '../contexts/AuthContext';
const Home: React.FC = () => {
  const {
    isAuthenticated
  } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/top-tracks" element={<TopTracks />} />
        <Route path="/recently-played" element={<RecentlyPlayed />} />
        <Route path="/playlists" element={<PlaylistHistory />} />
        <Route path="/trends" element={<Trends />} />
        <Route path="/insights" element={<MusicInsights />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
      </Routes>
    </Layout>;
};
export default Home;