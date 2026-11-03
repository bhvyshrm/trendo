import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getWatchlist } from '../utils/watchlist';
import { TmdbService } from '../services/tmdb';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenFilters: () => void;
  onOpenWatchlist: () => void;
  onOpenApiKeyModal: () => void;
  activeCategory: 'movie' | 'tv';
  onSelectCategory: (cat: 'movie' | 'tv') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenFilters,
  onOpenWatchlist,
  onOpenApiKeyModal,
  activeCategory,
  onSelectCategory
}) => {
  const [watchlistCount, setWatchlistCount] = useState<number>(0);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    const updateCount = () => {
      setWatchlistCount(getWatchlist().length);
      setHasApiKey(TmdbService.hasApiKey());
    };
    updateCount();

    window.addEventListener('trendo_watchlist_updated', updateCount);
    window.addEventListener('storage', updateCount);
    return () => {
      window.removeEventListener('trendo_watchlist_updated', updateCount);
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  const isHome = location.pathname === '/' || location.pathname === '/movies' || location.pathname === '/tv';

  return (
    <header className="bg-surface/85 backdrop-blur-md text-primary sticky top-0 z-40 border-b border-outline-variant/20 transition-all duration-200">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin h-16 max-w-7xl mx-auto">
        {/* Brand Logo & Search Slate */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            onClick={() => onSelectCategory('movie')}
            className="text-headline-sm font-headline-sm lowercase tracking-tight text-primary font-syne font-bold flex items-center gap-1.5 transition-transform hover:opacity-90"
          >
            trendo<span className="text-emerald-400">.</span>
          </Link>

          {/* Search pill container */}
          <button
            onClick={onOpenSearch}
            type="button"
            className="flex items-center bg-[#0d0d0d] border border-outline-variant/30 rounded-full px-3 py-1.5 gap-2 text-on-surface-variant hover:border-outline-variant/70 transition-colors duration-200 shadow-inner group text-left"
          >
            <span className="material-symbols-outlined text-outline text-[18px] group-hover:text-primary transition-colors">
              search
            </span>
            <span className="hidden sm:inline text-body-sm text-[#707070] w-36 md:w-52 truncate">
              Search telemetry, actors, directors...
            </span>
            <span className="sm:hidden text-body-sm text-[#707070]">Search...</span>
            <kbd className="hidden sm:inline text-label-mono-sm bg-surface-container-high px-1.5 py-0.5 rounded text-outline-variant border border-outline-variant/20">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            onClick={() => onSelectCategory('movie')}
            className={`text-body-md transition-colors duration-150 ${
              isHome && activeCategory === 'movie'
                ? 'text-primary font-medium border-b border-primary pb-1'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Movies
          </Link>

          <Link
            to="/tv"
            onClick={() => onSelectCategory('tv')}
            className={`text-body-md transition-colors duration-150 ${
              isHome && activeCategory === 'tv'
                ? 'text-primary font-medium border-b border-primary pb-1'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            TV Shows
          </Link>

          <button
            onClick={onOpenWatchlist}
            type="button"
            className="text-body-md text-on-surface-variant hover:text-on-surface transition-colors duration-150 flex items-center gap-1.5"
          >
            Curations
            {watchlistCount > 0 && (
              <span className="text-[10px] font-label-mono-sm bg-surface-container-high text-primary px-1.5 py-0.2 rounded-full border border-outline-variant/40">
                {watchlistCount}
              </span>
            )}
          </button>
        </nav>

        {/* Trailing Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenFilters}
            className="p-2 rounded hover:text-primary hover:bg-surface-container-high/60 transition-colors duration-200 text-on-surface-variant flex items-center justify-center relative"
            title="Tune Stream Filters"
            aria-label="Tune Stream Filters"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>

          <button
            onClick={onOpenWatchlist}
            className="p-2 rounded hover:text-primary hover:bg-surface-container-high/60 transition-colors duration-200 text-on-surface-variant relative"
            title="Archived Watchlist"
            aria-label="Archived Watchlist"
          >
            <span className="material-symbols-outlined text-[20px]">bookmark</span>
            {watchlistCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400"></span>
            )}
          </button>

          <button
            onClick={onOpenApiKeyModal}
            className={`p-2 rounded transition-colors duration-200 flex items-center justify-center relative ${
              hasApiKey
                ? 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high/60'
                : 'text-amber-400 hover:text-amber-300 hover:bg-amber-950/30'
            }`}
            title={hasApiKey ? 'TMDB API Active' : 'TMDB API Key Configuration'}
            aria-label="TMDB API Configuration"
          >
            <span className="material-symbols-outlined text-[20px]">
              {hasApiKey ? 'stream' : 'vpn_key'}
            </span>
            {!hasApiKey && (
              <span className="absolute -top-1 -right-1 text-[9px] font-label-mono-sm bg-amber-500 text-black font-bold px-1 rounded">
                KEY
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
