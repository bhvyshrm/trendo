import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingItem, MediaType } from '../types/tmdb';
import { TmdbService } from '../services/tmdb';
import { getPosterUrl, formatYear } from '../utils/tmdb';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<MediaType | 'all'>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const media = searchType === 'all' ? undefined : searchType;
        const res = await TmdbService.search(query, media);
        setResults(res);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query, searchType]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/80 backdrop-blur-md transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#141416] border border-outline-variant/40 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-outline-variant/20 gap-3 bg-[#0d0d0f]">
          <span className="material-symbols-outlined text-outline text-[22px]">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search telemetry archive, movies, series..."
            className="w-full bg-transparent border-0 text-primary placeholder-[#707070] text-body-lg focus:outline-none focus:ring-0"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-outline hover:text-primary transition-colors"
              title="Clear search"
            >
              <span className="material-symbols-outlined text-[18px]">clear</span>
            </button>
          )}
          <kbd className="hidden sm:inline text-label-mono-sm bg-[#1c1c1f] text-outline-variant px-2 py-0.5 rounded border border-white/5">
            ESC
          </kbd>
        </div>

        {/* Filter scope buttons */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-[#101012] text-label-mono-sm">
          <span className="text-outline text-[11px] uppercase tracking-wider mr-2">Scope:</span>
          <button
            onClick={() => setSearchType('all')}
            className={`px-2.5 py-1 rounded transition-colors ${
              searchType === 'all' ? 'bg-primary text-background font-medium' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            All Cinema
          </button>
          <button
            onClick={() => setSearchType('movie')}
            className={`px-2.5 py-1 rounded transition-colors ${
              searchType === 'movie' ? 'bg-primary text-background font-medium' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Movies Only
          </button>
          <button
            onClick={() => setSearchType('tv')}
            className={`px-2.5 py-1 rounded transition-colors ${
              searchType === 'tv' ? 'bg-primary text-background font-medium' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            TV Series Only
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2">
          {loading && (
            <div className="p-8 text-center text-outline text-body-sm flex items-center justify-center gap-2">
              <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
              <span>Querying live TMDB telemetry stream...</span>
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-outline-variant text-4xl mb-2">
                sentiment_dissatisfied
              </span>
              <p className="text-primary font-medium">No telemetry matches found</p>
              <p className="text-body-sm text-outline mt-1">
                No titles or entities matching "{query}" were returned by the telemetry engine.
              </p>
            </div>
          )}

          {!loading && !query && (
            <div className="p-8 text-center text-outline text-body-sm">
              <p>Type a movie title, series name, director, or actor to search global telemetry.</p>
              <p className="text-[11px] font-label-mono-sm text-outline-variant mt-2">
                PRO TIP: Press ⌘K anywhere to open this dispatch search console.
              </p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-1">
              {results.map((item) => (
                <div
                  key={`${item.media_type}-${item.id}`}
                  onClick={() => {
                    onClose();
                    navigate(`/${item.media_type}/${item.id}`);
                  }}
                  className="flex items-center gap-4 p-2.5 rounded-lg hover:bg-[#1f1f23] transition-colors cursor-pointer group"
                >
                  <div className="w-12 h-16 bg-surface-container-lowest rounded overflow-hidden flex-shrink-0 border border-white/10">
                    <img
                      src={getPosterUrl(item.poster_path, 'w185')}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getPosterUrl(null);
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-label-mono-sm uppercase px-1.5 py-0.2 rounded bg-surface-container-high text-outline">
                        {item.media_type}
                      </span>
                      <span className="text-label-mono-sm text-outline">
                        {formatYear(item.release_date)}
                      </span>
                      {item.vote_average > 0 && (
                        <span className="text-[11px] font-label-mono-sm text-amber-300 flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[13px] fill-1">star</span>
                          {item.vote_average.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <h4 className="text-body-md font-medium text-primary group-hover:text-amber-100 transition-colors truncate mt-0.5">
                      {item.title}
                    </h4>
                    <p className="text-body-sm text-on-surface-variant truncate text-xs">
                      {item.overview || 'Archival record available.'}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[18px]">
                    arrow_forward
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
