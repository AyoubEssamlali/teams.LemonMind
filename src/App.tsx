import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';

export const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Keyboard navigation support: Esc to return to team grid
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && location.pathname.startsWith('/equipe')) {
        if (window.history.length > 1) {
          navigate(-1);
        } else {
          navigate('/');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [location.pathname, navigate]);

  return (
    <>
      <Header />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/equipe/:slug" element={<ProfilePage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  );
};
