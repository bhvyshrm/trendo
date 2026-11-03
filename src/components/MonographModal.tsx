import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingItem } from '../types/tmdb';
import { formatYear, getGenreNames } from '../utils/tmdb';
import { addToWatchlist, isInWatchlist, removeFromWatchlist } from '../utils/watchlist';

interface MonographModalProps {
  item: TrendingItem | null;
  onClose: () => void;
}

export const MonographModal: React.FC<MonographModalProps> = ({ item, onClose }) => {
  const navigate = useNavigate();

  if (!item) return null;

  const genres = getGenreNames(item.genre_ids, item.media_type).slice(0, 3).join(' / ');
  const year = formatYear(item.release_date);
  const inList = isInWatchlist(item.id, item.media_type);

  const handleWatchlistToggle = () => {
    if (inList) {
      removeFromWatchlist(item.id, item.media_type);
    } else {
      addToWatchlist(item);
    }
  };

  const handleOpenFullPage = () => {
    onClose();
    navigate(`/${item.media_type}/${item.id}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-[#141416] border border-outline-variant/40 rounded-xl p-6 md:p-8 max-w-xl w-full shadow-2xl relative text-left transition-all duration-300 transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-outline hover:text-primary transition-colors p-1"
          aria-label="Close modal"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-label-mono-sm text-amber-300 bg-amber-950/40 border border-amber-600/30 px-2 py-0.5 rounded">
            ARCHIVAL MONOGRAPH
          </span>
          <span className="text-label-mono-sm text-outline">
            TELEMETRY #{String(item.rank || 1).padStart(2, '0')}
          </span>
        </div>

        <h2 className="text-headline-lg font-headline-lg text-primary tracking-tight font-medium mb-1">
          {item.title}
        </h2>

        <p className="text-label-mono-sm text-on-surface-variant mb-4">
          {year} • {genres || 'Feature Film'} • {item.media_type === 'movie' ? 'Motion Picture' : 'Television Series'}
        </p>

        <div className="border-t border-b border-white/10 py-4 my-4 max-h-48 overflow-y-auto">
          <p className="text-body-md text-on-surface leading-relaxed">
            {item.overview || 'Archival synopsis pending curatorial dispatch.'}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="bg-[#0b0b0c] p-3 rounded border border-white/5">
            <span className="text-label-mono-sm text-outline block">TMDB RATING</span>
            <span className="text-headline-sm text-primary font-bold">
              {item.vote_average.toFixed(1)}
              <span className="text-[12px] text-outline font-normal"> /10</span>
            </span>
          </div>

          <div className="bg-[#0b0b0c] p-3 rounded border border-white/5">
            <span className="text-label-mono-sm text-outline block">TELEMETRY SCORE</span>
            <span className="text-headline-sm text-emerald-400 font-bold">
              {item.popularity.toFixed(1)}
            </span>
          </div>

          <div className="bg-[#0b0b0c] p-3 rounded border border-white/5">
            <span className="text-label-mono-sm text-outline block">STREAM STATUS</span>
            <span className="text-headline-sm text-primary font-bold">
              ACTIVE
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
          <button
            onClick={handleOpenFullPage}
            className="text-body-sm text-amber-400 hover:text-amber-300 flex items-center gap-1 underline underline-offset-4 font-medium"
          >
            <span>Full Monograph Dispatch</span>
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-surface-container-high text-body-sm text-on-surface hover:text-primary transition-colors"
            >
              Dismiss
            </button>
            <button
              onClick={handleWatchlistToggle}
              className={`px-5 py-2 rounded text-body-sm font-medium transition-colors flex items-center gap-1.5 ${
                inList
                  ? 'bg-surface-container-highest text-primary border border-outline-variant/50'
                  : 'bg-primary text-background hover:bg-neutral-200'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {inList ? 'bookmark_added' : 'bookmark_add'}
              </span>
              <span>{inList ? 'In Curated Reel' : 'Save to Reel'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
