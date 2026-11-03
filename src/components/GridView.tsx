import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingItem } from '../types/tmdb';
import { getPosterUrl, formatYear, getGenreNames } from '../utils/tmdb';

interface GridViewProps {
  items: TrendingItem[];
  onSelectPreview: (item: TrendingItem) => void;
}

export const GridView: React.FC<GridViewProps> = ({ items, onSelectPreview }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 py-4">
      {items.map((item) => {
        const year = formatYear(item.release_date);
        const genres = getGenreNames(item.genre_ids, item.media_type).slice(0, 1).join('');
        const rankNum = item.rank || 1;

        return (
          <div
            key={`${item.media_type}-${item.id}`}
            onClick={() => onSelectPreview(item)}
            className="group relative bg-[#151517] border border-white/10 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:border-white/30 hover:-translate-y-1 hover:shadow-2xl flex flex-col"
          >
            {/* Poster Aspect 2:3 */}
            <div className="relative aspect-[2/3] w-full overflow-hidden bg-surface-container-lowest">
              <img
                src={getPosterUrl(item.poster_path, 'w500')}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getPosterUrl(null);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>

              {/* Rank pill */}
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 border border-white/10 text-label-mono-sm backdrop-blur-sm">
                <span className={rankNum <= 3 ? 'text-amber-300 font-bold' : 'text-primary'}>
                  #{String(rankNum).padStart(2, '0')}
                </span>
              </div>

              {/* Rating badge */}
              <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/75 border border-white/10 text-[11px] font-label-mono-sm text-primary backdrop-blur-sm">
                <span className="material-symbols-outlined text-amber-400 text-[13px] fill-1">star</span>
                <span>{item.vote_average > 0 ? item.vote_average.toFixed(1) : 'NR'}</span>
              </div>

              {/* Monograph Direct Action Pill */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/${item.media_type}/${item.id}`);
                }}
                className="absolute bottom-2 right-2 p-1.5 rounded-full bg-primary text-background opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg hover:bg-neutral-200"
                title="View Monograph"
              >
                <span className="material-symbols-outlined text-[16px] block">arrow_forward</span>
              </button>
            </div>

            {/* Title & Metadata */}
            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-body-md font-medium text-primary line-clamp-1 group-hover:text-amber-100 transition-colors">
                  {item.title}
                </h4>
                <p className="text-label-mono-sm text-on-surface-variant mt-0.5">
                  {year} {genres ? `• ${genres}` : ''}
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] font-label-mono-sm text-outline mt-2 pt-2 border-t border-white/5">
                <span>POP {item.popularity.toFixed(0)}</span>
                <span className="uppercase">{item.media_type}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
