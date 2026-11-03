import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { FilterDrawer } from './components/FilterDrawer';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { ApiKeyModal } from './components/ApiKeyModal';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { MovieDetailsPage } from './pages/MovieDetailsPage';
import { TVDetailsPage } from './pages/TVDetailsPage';
import { MediaType, FilterState } from './types/tmdb';

export const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<MediaType>('movie');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    genre: 'all',
    year: 'all',
    minRating: 0,
    sortBy: 'rank',
    language: 'all'
  });

  const location = useLocation();
  const navigate = useNavigate();

  // Sync active category with URL path
  useEffect(() => {
    if (location.pathname.startsWith('/tv')) {
      setActiveCategory('tv');
    } else if (location.pathname === '/' || location.pathname.startsWith('/movies') || location.pathname.startsWith('/movie')) {
      setActiveCategory('movie');
    }
  }, [location.pathname]);

  // Global Keyboard Shortcuts (⌘K / Ctrl+K for search, Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsFilterOpen(false);
        setIsWatchlistOpen(false);
        setIsApiKeyModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectCategory = (cat: MediaType) => {
    setActiveCategory(cat);
    if (cat === 'movie') {
      navigate('/');
    } else {
      navigate('/tv');
    }
  };

  return (
    <div className="bg-[#070707] text-[#e5e2e1] min-h-screen flex flex-col relative selection:bg-white selection:text-black">
      {/* Visual Canvas Backdrop Foundations */}
      <div className="ambient-mesh"></div>
      <div className="archival-grain"></div>

      {/* Top Navigation */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenFilters={() => setIsFilterOpen(true)}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* Routes & Page Content */}
      <div className="flex-1 relative z-10">
        <Routes>
          <Route
            path="/"
            element={
              <DiscoveryPage
                mediaType="movie"
                onMediaTypeChange={handleSelectCategory}
                filters={filters}
                onFilterChange={setFilters}
                onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
              />
            }
          />
          <Route
            path="/movies"
            element={
              <DiscoveryPage
                mediaType="movie"
                onMediaTypeChange={handleSelectCategory}
                filters={filters}
                onFilterChange={setFilters}
                onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
              />
            }
          />
          <Route
            path="/tv"
            element={
              <DiscoveryPage
                mediaType="tv"
                onMediaTypeChange={handleSelectCategory}
                filters={filters}
                onFilterChange={setFilters}
                onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
              />
            }
          />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
          <Route path="/tv/:id" element={<TVDetailsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Footer */}
      <Footer />

      {/* Global Drawers & Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        mediaType={activeCategory}
      />

      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeyUpdated={() => {
          // Trigger refresh of active data
          setFilters((f) => ({ ...f }));
        }}
      />
    </div>
  );
};
