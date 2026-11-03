import React from 'react';
import { FilterState, MediaType } from '../types/tmdb';
import { MOVIE_GENRES, TV_GENRES } from '../utils/tmdb';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  mediaType: MediaType;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  mediaType
}) => {
  if (!isOpen) return null;

  const genresDict = mediaType === 'movie' ? MOVIE_GENRES : TV_GENRES;
  const genreList = Object.entries(genresDict);

  const years = ['all', '2026', '2025', '2024', '2023', '2022', '2021', '2020'];

  const languages = [
    { code: 'all', label: 'All Languages' },
    { code: 'en', label: 'English' },
    { code: 'ja', label: 'Japanese' },
    { code: 'ko', label: 'Korean' },
    { code: 'fr', label: 'French' },
    { code: 'es', label: 'Spanish' },
    { code: 'de', label: 'German' },
    { code: 'it', label: 'Italian' },
    { code: 'hi', label: 'Hindi' },
  ];

  const sortOptions: Array<{ id: FilterState['sortBy']; label: string }> = [
    { id: 'rank', label: 'Live Telemetry Rank' },
    { id: 'popularity', label: 'Popularity Score' },
    { id: 'rating', label: 'TMDB Rating Score' },
    { id: 'release', label: 'Release Date' },
    { id: 'alpha', label: 'Alphabetical' }
  ];

  const handleReset = () => {
    onFilterChange({
      genre: 'all',
      year: 'all',
      minRating: 0,
      sortBy: 'rank',
      language: 'all'
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#131316] border-l border-outline-variant/30 h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">tune</span>
              <h2 className="text-headline-sm font-medium text-primary">Tune Telemetry Filters</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-outline hover:text-primary transition-colors"
              aria-label="Close filters"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="space-y-6 pt-6">
            {/* Sorting */}
            <div>
              <label className="text-label-mono-sm uppercase text-outline block mb-2 tracking-wider">
                Sort Telemetry By
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onFilterChange({ ...filters, sortBy: opt.id })}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded text-body-sm transition-colors ${
                      filters.sortBy === opt.id
                        ? 'bg-primary text-background font-medium'
                        : 'bg-[#18181b] border border-white/5 text-on-surface hover:text-primary hover:border-white/20'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {filters.sortBy === opt.id && (
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Rating */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-label-mono-sm uppercase text-outline tracking-wider">
                  Minimum TMDB Rating
                </label>
                <span className="text-label-mono-sm text-primary font-bold">
                  {filters.minRating > 0 ? `${filters.minRating.toFixed(1)}+ / 10` : 'All Ratings'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="9"
                step="0.5"
                value={filters.minRating}
                onChange={(e) => onFilterChange({ ...filters, minRating: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-[#252528] rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] font-label-mono-sm text-outline mt-1.5">
                <span>0.0</span>
                <span>6.0+</span>
                <span>7.5+</span>
                <span>9.0</span>
              </div>
            </div>

            {/* Release Year */}
            <div>
              <label className="text-label-mono-sm uppercase text-outline block mb-2 tracking-wider">
                Release Epoch
              </label>
              <div className="flex flex-wrap gap-1.5">
                {years.map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => onFilterChange({ ...filters, year: y })}
                    className={`px-3 py-1.5 rounded-full text-label-mono-sm transition-colors ${
                      filters.year === y
                        ? 'bg-primary text-background font-medium'
                        : 'bg-[#18181b] border border-white/10 text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    {y === 'all' ? 'All Years' : y}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div>
              <label className="text-label-mono-sm uppercase text-outline block mb-2 tracking-wider">
                Original Language
              </label>
              <select
                value={filters.language}
                onChange={(e) => onFilterChange({ ...filters, language: e.target.value })}
                className="w-full bg-[#18181b] border border-outline-variant/30 text-primary text-body-sm rounded px-3 py-2.5 focus:border-primary focus:outline-none"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code} className="bg-[#18181b] text-primary">
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Genres */}
            <div>
              <label className="text-label-mono-sm uppercase text-outline block mb-2 tracking-wider">
                Filter by Genre
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filters, genre: 'all' })}
                  className={`px-3 py-1.5 rounded-full text-label-mono-sm transition-colors ${
                    filters.genre === 'all'
                      ? 'bg-primary text-background font-medium'
                      : 'bg-[#18181b] border border-white/10 text-on-surface-variant hover:text-primary'
                  }`}
                >
                  All Genres
                </button>
                {genreList.map(([id, name]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onFilterChange({ ...filters, genre: id })}
                    className={`px-3 py-1.5 rounded-full text-label-mono-sm transition-colors ${
                      filters.genre === id
                        ? 'bg-primary text-background font-medium'
                        : 'bg-[#18181b] border border-white/10 text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-6 border-t border-outline-variant/20 flex items-center justify-between gap-4 mt-6">
          <button
            type="button"
            onClick={handleReset}
            className="text-body-sm text-outline hover:text-primary transition-colors underline underline-offset-4"
          >
            Reset All
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded bg-primary text-background text-body-sm font-medium hover:bg-neutral-200 transition-colors shadow-lg"
          >
            Apply Telemetry
          </button>
        </div>
      </div>
    </div>
  );
};
