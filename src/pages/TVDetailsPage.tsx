import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { TVDetails } from '../types/tmdb';
import { TmdbService } from '../services/tmdb';
import {
  getBackdropUrl,
  getPosterUrl,
  getProfileUrl,
  formatFullDate,
  formatYear
} from '../utils/tmdb';
import { addToWatchlist, isInWatchlist, removeFromWatchlist } from '../utils/watchlist';

export const TVDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [show, setShow] = useState<TVDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [inWatchlist, setInWatchlist] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!id) return;

    const tvId = parseInt(id, 10);
    if (isNaN(tvId)) {
      setError('Invalid series identifier.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    TmdbService.getTVDetails(tvId)
      .then((data) => {
        setShow(data);
        setInWatchlist(isInWatchlist(data.id, 'tv'));
      })
      .catch((err) => {
        console.error('Failed to load TV details:', err);
        setError('Unable to retrieve archival telemetry for this series.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleWatchlistToggle = () => {
    if (!show) return;
    if (inWatchlist) {
      removeFromWatchlist(show.id, 'tv');
      setInWatchlist(false);
    } else {
      addToWatchlist(show);
      setInWatchlist(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <div className="inline-block animate-spin text-4xl text-primary material-symbols-outlined">
            sync
          </div>
          <p className="text-label-mono-sm text-outline tracking-wider uppercase">
            Retrieving Series Archival Dispatch & Telemetry...
          </p>
        </div>
      </div>
    );
  }

  if (error || !show) {
    return (
      <div className="min-h-screen max-w-3xl mx-auto px-6 py-24 text-center">
        <span className="material-symbols-outlined text-outline-variant text-5xl mb-4 block">
          error_outline
        </span>
        <h2 className="text-headline-lg font-medium text-primary">Archival Series Missing</h2>
        <p className="text-body-md text-on-surface-variant mt-2 mb-8 leading-relaxed">
          {error || 'This series could not be resolved in the global telemetry database.'}
        </p>
        <button
          onClick={() => navigate('/tv')}
          className="px-6 py-2.5 rounded bg-primary text-background font-medium text-body-sm hover:bg-neutral-200 transition-colors inline-flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Return to TV Stream</span>
        </button>
      </div>
    );
  }

  const creators = show.created_by || [];
  const networks = show.networks || [];
  const castList = (show.credits?.cast || []).slice(0, 10);
  const trailer = show.videos?.results?.find((v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));

  return (
    <div className="relative pb-24">
      {/* Hero Backdrop Viewport with Cinematic Vignette Scrim */}
      <div className="relative w-full h-[55vh] md:h-[70vh] max-h-[750px] overflow-hidden bg-black">
        <img
          src={getBackdropUrl(show.backdrop_path, 'original')}
          alt={show.title}
          className="w-full h-full object-cover object-top opacity-50 scale-105 filter contrast-105"
        />
        {/* Obsidian Gradient Scrims */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#070707]/90 via-[#070707]/40 to-transparent"></div>

        {/* Top Back Navigation Bar */}
        <div className="absolute top-6 left-0 right-0 max-w-7xl mx-auto px-margin-mobile md:px-margin z-20">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/15 text-label-mono-sm text-on-surface hover:text-primary hover:border-white/40 backdrop-blur-md transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>BACK TO TELEMETRY STREAM</span>
          </button>
        </div>

        {/* Hero Title and Metadata Overlay */}
        <div className="absolute bottom-8 left-0 right-0 max-w-7xl mx-auto px-margin-mobile md:px-margin z-20">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span className="px-2.5 py-0.5 rounded text-label-mono-sm uppercase tracking-wider font-semibold bg-primary text-background">
                TELEVISION SERIES
              </span>
              <span className="text-label-mono-sm text-outline">
                {formatYear(show.first_air_date)} • {show.number_of_seasons} {show.number_of_seasons === 1 ? 'Season' : 'Seasons'} • {show.number_of_episodes} Episodes
              </span>
              {show.vote_average > 0 && (
                <span className="flex items-center gap-1 text-label-mono-sm text-amber-300 bg-amber-950/40 border border-amber-600/30 px-2 py-0.5 rounded">
                  <span className="material-symbols-outlined text-[14px] fill-1">star</span>
                  {show.vote_average.toFixed(1)} / 10 ({show.vote_count.toLocaleString()} votes)
                </span>
              )}
            </div>

            <h1 className="text-headline-lg-mobile md:text-display-hero text-primary font-syne font-extrabold tracking-tight leading-none mb-3">
              {show.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleWatchlistToggle}
                className={`px-5 py-2.5 rounded text-body-sm font-medium transition-colors flex items-center gap-2 ${
                  inWatchlist
                    ? 'bg-surface-container-highest text-primary border border-outline-variant/60'
                    : 'bg-primary text-background hover:bg-neutral-200 shadow-xl'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {inWatchlist ? 'bookmark_added' : 'bookmark_add'}
                </span>
                <span>{inWatchlist ? 'Archived in Reel' : 'Add to Curated Reel'}</span>
              </button>

              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded bg-[#151517] border border-outline-variant/40 text-on-surface hover:text-primary hover:border-white/40 text-body-sm flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-amber-400">play_arrow</span>
                  <span>Play Official Trailer</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Left Editorial Body (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            {/* Curatorial Overview */}
            <section>
              <h2 className="text-label-mono-sm uppercase text-outline tracking-wider block mb-3">
                Curatorial Logline & Synopsis
              </h2>
              <p className="text-body-lg text-on-surface leading-relaxed font-normal">
                {show.overview || 'Series overview pending curatorial dispatch.'}
              </p>
            </section>

            {/* SECTION: WHY IT'S TRENDING (Phase 9 Requirement) */}
            <section className="bg-[#121215] border border-white/10 rounded-xl p-6 md:p-8 relative overflow-hidden">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="material-symbols-outlined text-emerald-400 text-[20px]">insights</span>
                <h3 className="text-headline-sm font-medium text-primary">Why it's trending</h3>
              </div>
              <p className="text-body-sm text-on-surface-variant mb-6 leading-relaxed">
                Objective telemetry signals collected from the global TMDB live tracking index. Measuring episodic engagement, search momentum, and broadcast volume.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-[#0b0b0d] p-4 rounded-lg border border-white/5">
                  <span className="text-[11px] font-label-mono-sm text-outline block mb-1">TELEMETRY SCORE</span>
                  <span className="text-headline-md font-bold text-emerald-400 leading-tight">
                    {show.popularity.toFixed(1)}
                  </span>
                  <span className="text-[10px] font-label-mono-sm text-outline-variant block mt-1">
                    Normalized daily interest
                  </span>
                </div>

                <div className="bg-[#0b0b0d] p-4 rounded-lg border border-white/5">
                  <span className="text-[11px] font-label-mono-sm text-outline block mb-1">AUDIENCE CONSENSUS</span>
                  <span className="text-headline-md font-bold text-amber-300 leading-tight">
                    {show.vote_average.toFixed(1)} <span className="text-sm text-outline font-normal">/ 10</span>
                  </span>
                  <span className="text-[10px] font-label-mono-sm text-outline-variant block mt-1">
                    {show.vote_count.toLocaleString()} registered votes
                  </span>
                </div>

                <div className="bg-[#0b0b0d] p-4 rounded-lg border border-white/5">
                  <span className="text-[11px] font-label-mono-sm text-outline block mb-1">SERIES STATUS</span>
                  <span className="text-headline-sm font-bold text-primary leading-tight">
                    {show.in_production ? 'In Active Production' : 'Concluded'}
                  </span>
                  <span className="text-[10px] font-label-mono-sm text-outline-variant block mt-1">
                    {show.number_of_seasons} seasons released
                  </span>
                </div>

                <div className="bg-[#0b0b0d] p-4 rounded-lg border border-white/5">
                  <span className="text-[11px] font-label-mono-sm text-outline block mb-1">SERIES PREMIERE</span>
                  <span className="text-headline-sm font-bold text-primary leading-tight">
                    {formatFullDate(show.first_air_date)}
                  </span>
                  <span className="text-[10px] font-label-mono-sm text-outline-variant block mt-1">
                    First broadcast epoch
                  </span>
                </div>

                <div className="bg-[#0b0b0d] p-4 rounded-lg border border-white/5">
                  <span className="text-[11px] font-label-mono-sm text-outline block mb-1">PRIMARY LANGUAGE</span>
                  <span className="text-headline-sm font-bold text-primary leading-tight uppercase font-mono">
                    {show.original_language}
                  </span>
                  <span className="text-[10px] font-label-mono-sm text-outline-variant block mt-1">
                    Original broadcast track
                  </span>
                </div>

                <div className="bg-[#0b0b0d] p-4 rounded-lg border border-white/5">
                  <span className="text-[11px] font-label-mono-sm text-outline block mb-1">NETWORK CARRIERS</span>
                  <span className="text-headline-sm font-bold text-primary leading-tight truncate block">
                    {networks.map((n) => n.name).join(', ') || 'Global Distribution'}
                  </span>
                  <span className="text-[10px] font-label-mono-sm text-outline-variant block mt-1">
                    Primary broadcast home
                  </span>
                </div>
              </div>
            </section>

            {/* Principal Cast Reel */}
            {castList.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-headline-sm font-medium text-primary">Principal Ensemble Cast</h3>
                  <span className="text-label-mono-sm text-outline">
                    {castList.length} performers on call-sheet
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
                  {castList.map((member) => (
                    <div
                      key={member.id}
                      className="bg-[#141416] border border-white/5 rounded-lg p-2.5 flex flex-col items-center text-center"
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-surface-container-high mb-2.5 border border-white/10">
                        <img
                          src={getProfileUrl(member.profile_path, 'w185')}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="text-body-sm font-medium text-primary line-clamp-1">
                        {member.name}
                      </h4>
                      <p className="text-[11px] font-label-mono-sm text-outline line-clamp-1 mt-0.5">
                        {member.character}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Curated Recommendations */}
            {show.recommendations?.results && show.recommendations.results.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-headline-sm font-medium text-primary">Associated Series</h3>
                  <span className="text-label-mono-sm text-outline">Recommended Curations</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {show.recommendations.results.slice(0, 4).map((rec) => (
                    <Link
                      key={rec.id}
                      to={`/tv/${rec.id}`}
                      className="group bg-[#151517] border border-white/10 rounded-lg overflow-hidden transition-all hover:border-white/30"
                    >
                      <div className="aspect-[2/3] w-full bg-surface-container-lowest overflow-hidden">
                        <img
                          src={getPosterUrl(rec.poster_path, 'w342')}
                          alt={rec.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-2.5">
                        <h5 className="text-body-sm font-medium text-primary truncate group-hover:text-amber-100">
                          {rec.title}
                        </h5>
                        <p className="text-[11px] font-label-mono-sm text-outline mt-0.5">
                          {formatYear(rec.release_date)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Slate Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Standalone Poster Plate */}
            <div className="bg-[#121214] border border-white/10 rounded-xl p-4 shadow-xl">
              <div className="aspect-[2/3] w-full rounded-lg overflow-hidden border border-white/10 bg-surface-container-lowest mb-4">
                <img
                  src={getPosterUrl(show.poster_path, 'w500')}
                  alt={show.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Series Slate Metadata */}
              <div className="space-y-3.5 text-body-sm">
                {creators.length > 0 && (
                  <div>
                    <span className="text-label-mono-sm uppercase text-outline block">Creators / Showrunners</span>
                    <span className="text-primary font-medium">
                      {creators.map((c) => c.name).join(', ')}
                    </span>
                  </div>
                )}

                {networks.length > 0 && (
                  <div>
                    <span className="text-label-mono-sm uppercase text-outline block">Original Network / Carrier</span>
                    <span className="text-on-surface font-medium">
                      {networks.map((n) => n.name).join(', ')}
                    </span>
                  </div>
                )}

                <div>
                  <span className="text-label-mono-sm uppercase text-outline block">Broadcast Epoch</span>
                  <span className="text-on-surface">
                    {formatFullDate(show.first_air_date)} {show.last_air_date ? `to ${formatFullDate(show.last_air_date)}` : ''}
                  </span>
                </div>

                <div>
                  <span className="text-label-mono-sm uppercase text-outline block">Total Scale</span>
                  <span className="text-on-surface">
                    {show.number_of_seasons} seasons, {show.number_of_episodes} televised episodes
                  </span>
                </div>

                <div className="pt-2 border-t border-white/5">
                  <span className="text-label-mono-sm uppercase text-outline block mb-1">Genres</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(show.genres || []).map((g) => (
                      <span
                        key={g.id}
                        className="px-2 py-0.5 rounded text-[11px] font-label-mono-sm bg-[#1c1c1f] text-on-surface-variant border border-white/5"
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>
                </div>

                {show.production_companies && show.production_companies.length > 0 && (
                  <div className="pt-2 border-t border-white/5">
                    <span className="text-label-mono-sm uppercase text-outline block mb-1">Production Companies</span>
                    <p className="text-on-surface text-xs leading-relaxed">
                      {show.production_companies.map((p) => p.name).join(' • ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
