import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MovieDetails } from '../types/tmdb';
import { TmdbService } from '../services/tmdb';
import {
  getBackdropUrl,
  getPosterUrl,
  getProfileUrl,
  formatFullDate,
  formatRuntime,
  formatCurrency,
  formatYear
} from '../utils/tmdb';
import { addToWatchlist, isInWatchlist, removeFromWatchlist } from '../utils/watchlist';

export const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [inWatchlist, setInWatchlist] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!id) return;

    const movieId = parseInt(id, 10);
    if (isNaN(movieId)) {
      setError('Invalid cinematic identifier.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    TmdbService.getMovieDetails(movieId)
      .then((data) => {
        setMovie(data);
        setInWatchlist(isInWatchlist(data.id, 'movie'));
      })
      .catch((err) => {
        console.error('Failed to load movie details:', err);
        setError('Unable to retrieve archival telemetry for this feature.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleWatchlistToggle = () => {
    if (!movie) return;
    if (inWatchlist) {
      removeFromWatchlist(movie.id, 'movie');
      setInWatchlist(false);
    } else {
      addToWatchlist(movie);
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
            Retrieving Archival Dispatch & Telemetry...
          </p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen max-w-3xl mx-auto px-6 py-24 text-center">
        <span className="material-symbols-outlined text-outline-variant text-5xl mb-4 block">
          error_outline
        </span>
        <h2 className="text-headline-lg font-medium text-primary">Archival Dispatch Missing</h2>
        <p className="text-body-md text-on-surface-variant mt-2 mb-8 leading-relaxed">
          {error || 'This cinematic title could not be resolved in the global telemetry database.'}
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded bg-primary text-background font-medium text-body-sm hover:bg-neutral-200 transition-colors inline-flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Return to Live Index</span>
        </button>
      </div>
    );
  }

  const directors = movie.credits?.crew?.filter((c) => c.job === 'Director') || [];
  const writers = movie.credits?.crew?.filter((c) => c.department === 'Writing' || c.job === 'Screenplay' || c.job === 'Writer') || [];
  const dop = movie.credits?.crew?.find((c) => c.job === 'Director of Photography');
  const composer = movie.credits?.crew?.find((c) => c.job === 'Original Music Composer' || c.job === 'Music');
  const castList = (movie.credits?.cast || []).slice(0, 10);
  const trailer = movie.videos?.results?.find((v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));

  return (
    <div className="relative pb-24">
      {/* Hero Backdrop Viewport with Cinematic Vignette Scrim */}
      <div className="relative w-full h-[55vh] md:h-[70vh] max-h-[750px] overflow-hidden bg-black">
        <img
          src={getBackdropUrl(movie.backdrop_path, 'original')}
          alt={movie.title}
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
                FEATURE FILM
              </span>
              <span className="text-label-mono-sm text-outline">
                {formatYear(movie.release_date)} • {formatRuntime(movie.runtime)}
              </span>
              {movie.vote_average > 0 && (
                <span className="flex items-center gap-1 text-label-mono-sm text-amber-300 bg-amber-950/40 border border-amber-600/30 px-2 py-0.5 rounded">
                  <span className="material-symbols-outlined text-[14px] fill-1">star</span>
                  {movie.vote_average.toFixed(1)} / 10 ({movie.vote_count.toLocaleString()} votes)
                </span>
              )}
            </div>

            <h1 className="text-headline-lg-mobile md:text-display-hero text-primary font-syne font-extrabold tracking-tight leading-none mb-3">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-body-lg text-secondary italic font-light tracking-wide mb-4">
                "{movie.tagline}"
              </p>
            )}

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
                {movie.overview || 'Synopsis pending archival entry.'}
              </p>
            </section>

            {/* SECTION: WHY IT'S TRENDING (Phase 8 Requirement) */}
            <section className="bg-[#121215] border border-white/10 rounded-xl p-6 md:p-8 relative overflow-hidden">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="material-symbols-outlined text-emerald-400 text-[20px]">insights</span>
                <h3 className="text-headline-sm font-medium text-primary">Why it's trending</h3>
              </div>
              <p className="text-body-sm text-on-surface-variant mb-6 leading-relaxed">
                Objective telemetry signals collected from the global TMDB live tracking index. Trendo indexes real user actions, logging velocity, and search volume without editorial distortion.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-[#0b0b0d] p-4 rounded-lg border border-white/5">
                  <span className="text-[11px] font-label-mono-sm text-outline block mb-1">TELEMETRY SCORE</span>
                  <span className="text-headline-md font-bold text-emerald-400 leading-tight">
                    {movie.popularity.toFixed(1)}
                  </span>
                  <span className="text-[10px] font-label-mono-sm text-outline-variant block mt-1">
                    Normalized daily interest
                  </span>
                </div>

                <div className="bg-[#0b0b0d] p-4 rounded-lg border border-white/5">
                  <span className="text-[11px] font-label-mono-sm text-outline block mb-1">AUDIENCE CONSENSUS</span>
                  <span className="text-headline-md font-bold text-amber-300 leading-tight">
                    {movie.vote_average.toFixed(1)} <span className="text-sm text-outline font-normal">/ 10</span>
                  </span>
                  <span className="text-[10px] font-label-mono-sm text-outline-variant block mt-1">
                    {movie.vote_count.toLocaleString()} registered votes
                  </span>
                </div>

                <div className="bg-[#0b0b0d] p-4 rounded-lg border border-white/5">
                  <span className="text-[11px] font-label-mono-sm text-outline block mb-1">RELEASE MOMENTUM</span>
                  <span className="text-headline-sm font-bold text-primary leading-tight">
                    {movie.status || 'Released'}
                  </span>
                  <span className="text-[10px] font-label-mono-sm text-outline-variant block mt-1">
                    Dispatched {formatFullDate(movie.release_date)}
                  </span>
                </div>

                <div className="bg-[#0b0b0d] p-4 rounded-lg border border-white/5">
                  <span className="text-[11px] font-label-mono-sm text-outline block mb-1">PRIMARY LANGUAGE</span>
                  <span className="text-headline-sm font-bold text-primary leading-tight uppercase font-mono">
                    {movie.original_language}
                  </span>
                  <span className="text-[10px] font-label-mono-sm text-outline-variant block mt-1">
                    Original audio track
                  </span>
                </div>

                <div className="bg-[#0b0b0d] p-4 rounded-lg border border-white/5">
                  <span className="text-[11px] font-label-mono-sm text-outline block mb-1">BOX OFFICE GROSS</span>
                  <span className="text-headline-sm font-bold text-primary leading-tight">
                    {formatCurrency(movie.revenue)}
                  </span>
                  <span className="text-[10px] font-label-mono-sm text-outline-variant block mt-1">
                    Worldwide theatrical return
                  </span>
                </div>

                <div className="bg-[#0b0b0d] p-4 rounded-lg border border-white/5">
                  <span className="text-[11px] font-label-mono-sm text-outline block mb-1">BUDGET ALLOCATION</span>
                  <span className="text-headline-sm font-bold text-primary leading-tight">
                    {formatCurrency(movie.budget)}
                  </span>
                  <span className="text-[10px] font-label-mono-sm text-outline-variant block mt-1">
                    Reported production outlay
                  </span>
                </div>
              </div>
            </section>

            {/* Principal Cast & Crew Reel */}
            {castList.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-headline-sm font-medium text-primary">Principal Cast</h3>
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
            {movie.recommendations?.results && movie.recommendations.results.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-headline-sm font-medium text-primary">Associated Dispatches</h3>
                  <span className="text-label-mono-sm text-outline">Recommended Curations</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {movie.recommendations.results.slice(0, 4).map((rec) => (
                    <Link
                      key={rec.id}
                      to={`/movie/${rec.id}`}
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
                  src={getPosterUrl(movie.poster_path, 'w500')}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Directorial & Studio Slate */}
              <div className="space-y-3.5 text-body-sm">
                <div>
                  <span className="text-label-mono-sm uppercase text-outline block">Director</span>
                  <span className="text-primary font-medium">
                    {directors.map((d) => d.name).join(', ') || 'Archival record unlisted'}
                  </span>
                </div>

                {writers.length > 0 && (
                  <div>
                    <span className="text-label-mono-sm uppercase text-outline block">Screenplay</span>
                    <span className="text-on-surface">
                      {writers.map((w) => w.name).slice(0, 3).join(', ')}
                    </span>
                  </div>
                )}

                {dop && (
                  <div>
                    <span className="text-label-mono-sm uppercase text-outline block">Cinematography</span>
                    <span className="text-on-surface">{dop.name}</span>
                  </div>
                )}

                {composer && (
                  <div>
                    <span className="text-label-mono-sm uppercase text-outline block">Original Score</span>
                    <span className="text-on-surface">{composer.name}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-white/5">
                  <span className="text-label-mono-sm uppercase text-outline block mb-1">Genres</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(movie.genres || []).map((g) => (
                      <span
                        key={g.id}
                        className="px-2 py-0.5 rounded text-[11px] font-label-mono-sm bg-[#1c1c1f] text-on-surface-variant border border-white/5"
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>
                </div>

                {movie.production_companies && movie.production_companies.length > 0 && (
                  <div className="pt-2 border-t border-white/5">
                    <span className="text-label-mono-sm uppercase text-outline block mb-1">Production Houses</span>
                    <p className="text-on-surface text-xs leading-relaxed">
                      {movie.production_companies.map((p) => p.name).join(' • ')}
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
