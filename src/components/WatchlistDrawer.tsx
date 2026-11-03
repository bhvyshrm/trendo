import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingItem } from '../types/tmdb';
import { getWatchlist, removeFromWatchlist } from '../utils/watchlist';
import { getPosterUrl, formatYear } from '../utils/tmdb';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({ isOpen, onClose }) => {
  const [items, setItems] = useState<TrendingItem[]>([]);
  const navigate = useNavigate();

  const loadItems = () => {
    setItems(getWatchlist());
  };

  useEffect(() => {
    if (isOpen) {
      loadItems();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRemove = (e: React.MouseEvent, id: number, mediaType: string) => {
    e.stopPropagation();
    removeFromWatchlist(id, mediaType);
    loadItems();
  };

  const handleItemClick = (item: TrendingItem) => {
    onClose();
    navigate(`/${item.media_type}/${item.id}`);
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
              <span className="material-symbols-outlined text-[20px] text-amber-300">bookmark</span>
              <div>
                <h2 className="text-headline-sm font-medium text-primary">Curated Reel</h2>
                <span className="text-label-mono-sm text-outline">
                  {items.length} {items.length === 1 ? 'title' : 'titles'} archived locally
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-outline hover:text-primary transition-colors"
              aria-label="Close curated reel"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Items */}
          <div className="pt-6">
            {items.length === 0 ? (
              <div className="p-8 text-center">
                <span className="material-symbols-outlined text-outline-variant text-4xl mb-3 block">
                  bookmark_border
                </span>
                <p className="text-primary font-medium">Your reel is empty</p>
                <p className="text-body-sm text-outline mt-1.5 leading-relaxed">
                  Save noteworthy films and series from the discovery stream by clicking "Save to Curated Reel".
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={`${item.media_type}-${item.id}`}
                    onClick={() => handleItemClick(item)}
                    className="flex items-center gap-3.5 p-2.5 rounded-lg bg-[#18181b] border border-white/5 hover:border-white/20 transition-all cursor-pointer group"
                  >
                    <div className="w-14 h-20 bg-surface-container-lowest rounded overflow-hidden flex-shrink-0 border border-white/10">
                      <img
                        src={getPosterUrl(item.poster_path, 'w185')}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-label-mono-sm uppercase text-outline">
                          {item.media_type}
                        </span>
                        <span className="text-label-mono-sm text-outline">
                          • {formatYear(item.release_date)}
                        </span>
                      </div>
                      <h4 className="text-body-md font-medium text-primary truncate group-hover:text-amber-100 transition-colors mt-0.5">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-label-mono-sm text-amber-300 flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[13px] fill-1">star</span>
                          {item.vote_average.toFixed(1)}
                        </span>
                        <span className="text-[10px] font-label-mono-sm text-outline">
                          POP {item.popularity.toFixed(0)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleRemove(e, item.id, item.media_type)}
                      className="p-1.5 rounded text-outline hover:text-red-400 hover:bg-red-950/20 transition-colors"
                      title="Remove from reel"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {items.length > 0 && (
          <div className="pt-6 border-t border-outline-variant/20 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded bg-surface-container-high text-primary hover:bg-surface-bright text-body-sm transition-colors"
            >
              Close Reel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
