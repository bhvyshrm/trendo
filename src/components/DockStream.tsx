import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingItem } from '../types/tmdb';
import { getPosterUrl, formatYear, getGenreNames } from '../utils/tmdb';

interface DockStreamProps {
  items: TrendingItem[];
  onSelectPreview: (item: TrendingItem) => void;
}

export const DockStream: React.FC<DockStreamProps> = ({ items, onSelectPreview }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check if device supports fine hover (desktop)
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const cards = Array.from(container.querySelectorAll<HTMLElement>('.dock-card'));
    const MAX_SCALE = 1.05;
    const RADIUS_PX = 160;

    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const cursorY = e.clientY;
        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const cardCenterY = rect.top + rect.height / 2;
          const distance = Math.abs(cursorY - cardCenterY);

          if (distance < RADIUS_PX) {
            const normalized = (RADIUS_PX - distance) / RADIUS_PX;
            const scale = 1 + (MAX_SCALE - 1) * Math.sin((normalized * Math.PI) / 2);
            card.style.transform = `scale(${scale.toFixed(4)})`;
            card.style.zIndex = '15';
            card.style.borderColor = 'rgba(255, 255, 255, 0.32)';
          } else {
            card.style.transform = 'scale(1)';
            card.style.zIndex = '1';
            card.style.borderColor = '';
          }
        });
      });
    };

    const handleMouseLeave = () => {
      if (rafId) cancelAnimationFrame(rafId);
      cards.forEach((card) => {
        card.style.transform = 'scale(1)';
        card.style.zIndex = '1';
        card.style.borderColor = '';
      });
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [items]);

  const renderRankBadge = (item: TrendingItem) => {
    const rankNum = item.rank || 1;
    const formattedRank = `#${String(rankNum).padStart(2, '0')}`;

    if (item.aura_type === 'gold' || rankNum === 1) {
      return (
        <div className="w-12 h-12 flex-shrink-0 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-700 p-[1px] shadow-[0_0_20px_rgba(251,191,36,0.25)]">
          <div className="w-full h-full bg-[#0a0a0b] rounded-full flex flex-col items-center justify-center">
            <span className="text-label-mono-sm text-amber-300 font-bold leading-none">{formattedRank}</span>
            <span className="text-[8px] font-label-mono-sm text-amber-400/80 uppercase">AURA</span>
          </div>
        </div>
      );
    }

    if (item.aura_type === 'silver' || rankNum === 2) {
      return (
        <div className="w-12 h-12 flex-shrink-0 rounded-full bg-gradient-to-br from-slate-200 via-slate-400 to-slate-600 p-[1px] shadow-[0_0_15px_rgba(203,213,225,0.2)]">
          <div className="w-full h-full bg-[#0a0a0b] rounded-full flex flex-col items-center justify-center">
            <span className="text-label-mono-sm text-slate-200 font-bold leading-none">{formattedRank}</span>
            <span className="text-[8px] font-label-mono-sm text-slate-400 uppercase">MEDAL</span>
          </div>
        </div>
      );
    }

    if (item.aura_type === 'bronze' || rankNum === 3) {
      return (
        <div className="w-12 h-12 flex-shrink-0 rounded-full bg-gradient-to-br from-amber-600 via-amber-800 to-amber-950 p-[1px] shadow-[0_0_15px_rgba(180,83,9,0.2)]">
          <div className="w-full h-full bg-[#0a0a0b] rounded-full flex flex-col items-center justify-center">
            <span className="text-label-mono-sm text-amber-500 font-bold leading-none">{formattedRank}</span>
            <span className="text-[8px] font-label-mono-sm text-amber-600 uppercase">PODIUM</span>
          </div>
        </div>
      );
    }

    return (
      <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-full bg-[#18181b] border border-white/10 flex flex-col items-center justify-center">
        <span className="text-label-mono-sm text-outline font-bold leading-none">{formattedRank}</span>
        <span className="text-[8px] font-label-mono-sm text-outline-variant uppercase">SLATE</span>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="flex flex-col gap-4 relative py-4" id="dock-stream">
      {items.map((item) => {
        const genres = getGenreNames(item.genre_ids, item.media_type).slice(0, 2).join(' / ');
        const year = formatYear(item.release_date);

        return (
          <article
            key={`${item.media_type}-${item.id}`}
            data-card-id={item.id}
            onClick={() => onSelectPreview(item)}
            className="dock-card group relative bg-[#151517] border border-white/10 rounded-lg p-4 md:p-6 transition-all duration-300 hover:border-white/30 hover:bg-[#1a1a1d] cursor-pointer"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-5 justify-between">
              {/* Left Wing: Rank Pill & Poster Thumbnail */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                {renderRankBadge(item)}

                {/* Poster Artwork Container (2:3 aspect preview) */}
                <div className="relative w-20 md:w-24 h-28 md:h-32 flex-shrink-0 rounded overflow-hidden border border-white/10 shadow-lg bg-surface-container-lowest">
                  <img
                    src={getPosterUrl(item.poster_path, 'w342')}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getPosterUrl(null);
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none"></div>
                  <span className="absolute bottom-1 left-1.5 text-[9px] font-label-mono-sm text-white/90 uppercase tracking-widest bg-black/60 px-1 rounded backdrop-blur-xs">
                    {item.media_type === 'movie' ? 'FILM' : 'SERIES'}
                  </span>
                </div>

                {/* Title & Quick Metadata (Mobile Stack) */}
                <div className="flex-1 md:hidden">
                  {item.badge_label && (
                    <span className="text-[10px] font-label-mono-sm text-amber-300 bg-amber-950/40 border border-amber-600/30 px-1.5 py-0.5 rounded inline-block mb-1">
                      {item.badge_label}
                    </span>
                  )}
                  <h3 className="text-headline-sm font-headline-sm text-primary font-bold line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-label-mono-sm text-on-surface-variant">
                    {year} • {genres || 'Curated'}
                  </p>
                </div>
              </div>

              {/* Center Wing: Narrative & Telemetry (Desktop Expanded) */}
              <div className="hidden md:flex flex-col flex-1 px-4 max-w-2xl">
                <div className="flex items-center gap-2.5 mb-1.5">
                  {item.badge_label ? (
                    <span className="text-label-mono-sm text-amber-300 bg-amber-950/30 border border-amber-600/40 px-2 py-0.5 rounded flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">military_tech</span>
                      {item.badge_label}
                    </span>
                  ) : (
                    <span className="text-label-mono-sm text-outline">TELEMETRY ARCHIVE</span>
                  )}
                  <span className="text-label-mono-sm text-outline">
                    • {year} • {genres || 'Global Discovery'}
                  </span>
                </div>

                <h3 className="text-headline-md font-headline-md text-primary font-medium tracking-tight group-hover:text-amber-100 transition-colors line-clamp-1">
                  {item.title}
                </h3>

                <p className="text-body-sm text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">
                  {item.overview || 'Editorial curation note pending cataloging.'}
                </p>
              </div>

              {/* Right Wing: Telemetry Signals & Monograph Button */}
              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                <div className="flex md:flex-col items-baseline md:items-end gap-3 md:gap-0">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-amber-400 text-[18px] fill-1">
                      star
                    </span>
                    <span className="text-headline-sm text-primary font-bold">
                      {item.vote_average > 0 ? item.vote_average.toFixed(1) : 'NR'}
                    </span>
                    <span className="text-label-mono-sm text-outline">/10</span>
                  </div>
                  <span className="text-label-mono-sm text-outline-variant">
                    POP {item.popularity.toFixed(1)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/${item.media_type}/${item.id}`);
                    }}
                    className="px-3.5 py-2 rounded bg-surface-container-high border border-outline-variant/30 text-on-surface hover:text-primary hover:bg-surface-bright text-label-mono-sm flex items-center gap-1.5 transition-colors"
                  >
                    <span>Monograph</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};
