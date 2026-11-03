export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const MOVIE_GENRES: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

export const TV_GENRES: Record<number, string> = {
  10759: 'Action & Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  10762: 'Kids',
  9648: 'Mystery',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
  37: 'Western',
};

export function getPosterUrl(path: string | null | undefined, size: 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
  if (!path) {
    return 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450" fill="%23141414"%3E%3Crect width="100%25" height="100%25" fill="%23151517"/%3E%3Ctext x="50%25" y="48%25" dominant-baseline="middle" text-anchor="middle" fill="%23707070" font-family="monospace" font-size="14"%3E[NO POSTER ARCHIVE]%3C/text%3E%3Ctext x="50%25" y="55%25" dominant-baseline="middle" text-anchor="middle" fill="%23444748" font-family="sans-serif" font-size="12"%3Etrendo. curation%3C/text%3E%3C/svg%3E';
  }
  if (path.startsWith('http')) return path;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getBackdropUrl(path: string | null | undefined, size: 'w780' | 'w1280' | 'original' = 'w1280'): string {
  if (!path) {
    return 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720" fill="%23101012"%3E%3Crect width="100%25" height="100%25" fill="%23101012"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23353534" font-family="monospace" font-size="18"%3Etrendo. telemetric backdrop%3C/text%3E%3C/svg%3E';
  }
  if (path.startsWith('http')) return path;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getProfileUrl(path: string | null | undefined, size: 'w185' | 'h632' | 'original' = 'w185'): string {
  if (!path) {
    return 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="185" height="278" viewBox="0 0 185 278" fill="%2318181b"%3E%3Crect width="100%25" height="100%25" fill="%2318181b"/%3E%3Ccircle cx="92" cy="90" r="40" fill="%2327272a"/%3E%3Cpath d="M30 220 Q92 150 155 220" stroke="%2327272a" stroke-width="20" fill="none"/%3E%3C/svg%3E';
  }
  if (path.startsWith('http')) return path;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getGenreNames(genreIds: number[] = [], mediaType: 'movie' | 'tv' = 'movie'): string[] {
  const mapping = mediaType === 'movie' ? MOVIE_GENRES : TV_GENRES;
  return genreIds.map((id) => mapping[id] || (mediaType === 'movie' ? TV_GENRES[id] : MOVIE_GENRES[id]) || 'Cinema').filter(Boolean);
}

export function formatYear(dateStr: string | null | undefined): string {
  if (!dateStr) return 'TBA';
  const match = dateStr.match(/^(\d{4})/);
  return match ? match[1] : 'TBA';
}

export function formatFullDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Not Dispatched';
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function formatRuntime(minutes: number | null | undefined): string {
  if (!minutes || minutes <= 0) return 'Variable';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
}

export function formatCurrency(amount: number | null | undefined): string {
  if (!amount || amount <= 0) return 'Undisclosed';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}
