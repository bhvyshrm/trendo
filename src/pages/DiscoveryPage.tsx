import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingItem, MediaType, FilterState } from '../types/tmdb';
import { TmdbService } from '../services/tmdb';
import { DockStream } from '../components/DockStream';
import { GridView } from '../components/GridView';
import { MonographModal } from '../components/MonographModal';

interface DiscoveryPageProps {
  mediaType: MediaType;
  onMediaTypeChange: (type: MediaType) => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onOpenApiKeyModal: () => void;
}

export const DiscoveryPage: React.FC<DiscoveryPageProps> = ({
  mediaType,
  onMediaTypeChange,
  filters,
  onFilterChange,
  onOpenApiKeyModal
}) => {
  const [items, setItems] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'dock' | 'grid'>('dock');
  const [previewItem, setPreviewItem] = useState<TrendingItem | null>(null);
  const [quickFilter, setQuickFilter] = useState<'top50' | 'surge' | 'festival' | 'critics'>('top50');
  const [hasKey, setHasKey] = useState<boolean>(false);

  const navigate = useNavigate();

  // Load items when mediaType or filters change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setHasKey(TmdbService.hasApiKey());

    // If filters are active (not defaults), use discover endpoint
    const hasCustomFilters =
      filters.genre !== 'all' ||
      filters.year !== 'all' ||
      filters.minRating > 0 ||
      filters.language !== 'all';

    const fetchPromise = hasCustomFilters
      ? TmdbService.discover(mediaType, filters)
      : TmdbService.getTrending(mediaType, 'day');

    fetchPromise
      .then((data) => {
        if (!isMounted) return;
        setItems(data);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Failed to fetch trending items:', err);
        setError('Error retrieving live telemetry stream.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [mediaType, filters]);

  // Apply Quick Filter Pills & Sorting
  const processedItems = useMemo(() => {
    let result = [...items];

    // Quick filter presets
    if (quickFilter === 'surge') {
      result = result.filter((i) => i.popularity >= 400 || (i.rank && i.rank <= 10));
    } else if (quickFilter === 'festival') {
      result = result.filter((i) => i.vote_average >= 8.0);
    } else if (quickFilter === 'critics') {
      result = result.filter((i) => i.vote_average >= 7.5 && i.vote_count >= 1000);
    }

    // Apply sorting
    return TmdbService.sortItems(result, filters.sortBy);
  }, [items, quickFilter, filters.sortBy]);

  return (
    <main className="relative z-10 max-w-7xl mx-auto px-margin-mobile md:px-margin pt-6 md:pt-10 pb-20">
      {/* HEADER CONTROLS & BRAND ANCHOR */}
      <section className="flex flex-col items-center justify-center text-center space-y-6 pt-2 pb-8 md:pb-10">
        {/* Live Telemetry Radar Pill */}
        <div className="flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-outline-variant/30 text-label-mono-sm text-on-surface-variant tracking-wider uppercase mb-4 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>
              {mediaType === 'movie'
                ? 'GLOBAL TELEMETRY STREAM • LIVE CINEMA INDEX'
                : 'GLOBAL TELEMETRY STREAM • LIVE TV INDEX'}
            </span>
          </div>

          <h1 className="font-syne font-extrabold text-display-hero-mobile md:text-display-hero text-primary tracking-tighter lowercase leading-none select-none">
            trendo<span className="text-emerald-400">.</span>
          </h1>
        </div>

        {/* Segmented Control Toggle Switch: Movies vs TV Shows */}
        <div className="inline-flex items-center bg-[#101012] p-1.5 rounded-full border border-outline-variant/30 backdrop-blur-xl shadow-2xl">
          <button
            type="button"
            onClick={() => {
              onMediaTypeChange('movie');
              navigate('/');
            }}
            className={`px-6 py-2 rounded-full text-body-sm font-medium transition-all duration-200 ${
              mediaType === 'movie'
                ? 'bg-primary text-background shadow-md'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Movies
          </button>
          <button
            type="button"
            onClick={() => {
              onMediaTypeChange('tv');
              navigate('/tv');
            }}
            className={`px-6 py-2 rounded-full text-body-sm font-medium transition-all duration-200 ${
              mediaType === 'tv'
                ? 'bg-primary text-background shadow-md'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            TV Shows
          </button>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 max-w-2xl">
          <button
            type="button"
            onClick={() => setQuickFilter('top50')}
            className={`px-3.5 py-1.5 rounded-full text-label-mono-sm font-medium transition-all ${
              quickFilter === 'top50'
                ? 'bg-primary text-background'
                : 'bg-[#0d0d0d] border border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-outline'
            }`}
          >
            Today's Top 50
          </button>

          <button
            type="button"
            onClick={() => setQuickFilter('surge')}
            className={`px-3.5 py-1.5 rounded-full text-label-mono-sm font-medium transition-all ${
              quickFilter === 'surge'
                ? 'bg-primary text-background'
                : 'bg-[#0d0d0d] border border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-outline'
            }`}
          >
            {mediaType === 'movie' ? 'Box Office Surge' : 'Series Premiere Surge'}
          </button>

          <button
            type="button"
            onClick={() => setQuickFilter('festival')}
            className={`px-3.5 py-1.5 rounded-full text-label-mono-sm font-medium transition-all ${
              quickFilter === 'festival'
                ? 'bg-primary text-background'
                : 'bg-[#0d0d0d] border border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-outline'
            }`}
          >
            {mediaType === 'movie' ? 'Festival Circuit' : 'Emmy Circuit'}
          </button>

          <button
            type="button"
            onClick={() => setQuickFilter('critics')}
            className={`px-3.5 py-1.5 rounded-full text-label-mono-sm font-medium transition-all ${
              quickFilter === 'critics'
                ? 'bg-primary text-background'
                : 'bg-[#0d0d0d] border border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-outline'
            }`}
          >
            Critics Consensus
          </button>
        </div>
      </section>

      {/* EDITORIAL SUBHEADER & TELEMETRY BAR */}
      <div className="border-t border-b border-outline-variant/20 py-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="max-w-2xl">
          <span className="text-label-mono-sm text-outline tracking-wider uppercase block mb-1">
            {mediaType === 'movie'
              ? 'Curation Dispatch 084 // Feature Telemetry'
              : 'Curation Dispatch 084 // Series Frequency'}
          </span>
          <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-primary tracking-tight font-medium">
            {mediaType === 'movie' ? 'Cinema, in motion.' : 'Prestige TV, in motion.'}
          </h2>
          <p className="text-body-md text-on-surface-variant mt-2 leading-relaxed">
            {mediaType === 'movie'
              ? 'Explore what the world is watching today. Curated daily from global TMDB telemetry, festival dispatches, and archival tracking signals.'
              : 'Explore what the world is bingeing and tracking today. Curated daily from global TMDB telemetry, broadcast ratings, and seasonal tracking signals.'}
          </p>
        </div>

        <div className="flex items-center gap-4 text-label-mono-sm text-outline-variant self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 border-outline-variant/10 pt-4 md:pt-0">
          <span className="flex items-center gap-1.5 text-on-surface">
            <span className="material-symbols-outlined text-[16px] text-emerald-400">sensors</span>
            <span>
              STREAM DOCK: {processedItems.length} OF {items.length} TITLES
            </span>
          </span>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-[#141414] p-1 rounded border border-outline-variant/20">
            <button
              onClick={() => setViewMode('dock')}
              className={`p-1 rounded transition-colors ${
                viewMode === 'dock'
                  ? 'bg-surface-container-high text-primary'
                  : 'text-outline-variant hover:text-on-surface'
              }`}
              title="Vertical Dock View"
              aria-label="Vertical Dock View"
            >
              <span className="material-symbols-outlined text-[16px]">view_agenda</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-surface-container-high text-primary'
                  : 'text-outline-variant hover:text-on-surface'
              }`}
              title="Compact Grid View"
              aria-label="Compact Grid View"
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notice if in Curated Archive Fallback mode */}
      {!hasKey && (
        <div className="mb-6 p-3.5 rounded-lg bg-[#141418] border border-outline-variant/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-body-sm">
          <div className="flex items-center gap-2 text-on-surface">
            <span className="material-symbols-outlined text-amber-400 text-[18px]">info</span>
            <span>
              Showing Trendo Curated Telemetry Archive. Connect your free TMDB API Key for live real-time streams.
            </span>
          </div>
          <button
            onClick={onOpenApiKeyModal}
            className="text-label-mono-sm px-3 py-1.5 rounded bg-surface-container-high hover:bg-surface-bright text-primary border border-white/10 transition-colors whitespace-nowrap"
          >
            Configure TMDB Key
          </button>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div className="space-y-4 py-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className="bg-[#151517] border border-white/5 rounded-lg p-5 flex items-center justify-between animate-shimmer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#202024]"></div>
                <div className="w-20 md:w-24 h-28 md:h-32 rounded bg-[#202024]"></div>
                <div className="space-y-2 hidden md:block">
                  <div className="w-48 h-4 rounded bg-[#202024]"></div>
                  <div className="w-64 h-6 rounded bg-[#25252a]"></div>
                  <div className="w-80 h-3 rounded bg-[#202024]"></div>
                </div>
              </div>
              <div className="w-24 h-10 rounded bg-[#202024]"></div>
            </div>
          ))}
        </div>
      )}

      {/* ERROR STATE */}
      {error && !loading && (
        <div className="py-16 text-center">
          <span className="material-symbols-outlined text-rose-400 text-5xl mb-3 block">
            satellite_alt
          </span>
          <h3 className="text-headline-sm font-medium text-primary">Telemetry Stream Interrupted</h3>
          <p className="text-body-md text-outline mt-1 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded bg-primary text-background text-body-sm font-medium hover:bg-neutral-200 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* EMPTY RESULTS STATE */}
      {!loading && !error && processedItems.length === 0 && (
        <div className="py-16 text-center bg-[#111114] border border-white/5 rounded-xl p-8">
          <span className="material-symbols-outlined text-outline-variant text-4xl mb-3 block">
            filter_list_off
          </span>
          <h3 className="text-headline-sm font-medium text-primary">No Titles Match Active Filters</h3>
          <p className="text-body-sm text-outline mt-1 mb-6">
            Adjust your tuning filters or clear the active preset to restore full discovery stream.
          </p>
          <button
            onClick={() => {
              setQuickFilter('top50');
              onFilterChange({
                genre: 'all',
                year: 'all',
                minRating: 0,
                sortBy: 'rank',
                language: 'all'
              });
            }}
            className="px-5 py-2 rounded bg-surface-container-high text-primary hover:bg-surface-bright text-body-sm transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* MAIN VIEW: DOCK OR GRID */}
      {!loading && !error && processedItems.length > 0 && (
        <>
          {viewMode === 'dock' ? (
            <DockStream
              items={processedItems}
              onSelectPreview={(item) => setPreviewItem(item)}
            />
          ) : (
            <GridView
              items={processedItems}
              onSelectPreview={(item) => setPreviewItem(item)}
            />
          )}
        </>
      )}

      {/* Quick Preview Monograph Modal */}
      <MonographModal
        item={previewItem}
        onClose={() => setPreviewItem(null)}
      />
    </main>
  );
};
