import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SpotifyDataProvider } from './contexts/SpotifyDataContext';
import Login from './pages/Login';
import Home from './pages/Home';
import AuthCallback from './pages/AuthCallback';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
export function App() {
  return <Router>
      <AuthProvider>
        <SpotifyDataProvider>
          <div className="min-h-screen bg-black text-white">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/callback" element={<AuthCallback />} />
              <Route path="/dashboard/*" element={<Home />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-use" element={<TermsOfUse />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </SpotifyDataProvider>
      </AuthProvider>
    </Router>;
}
