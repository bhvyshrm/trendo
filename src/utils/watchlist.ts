import { TrendingItem } from '../types/tmdb';

const WATCHLIST_STORAGE_KEY = 'trendo_curated_watchlist';

export function getWatchlist(): TrendingItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to parse watchlist:', err);
    return [];
  }
}

export function addToWatchlist(item: TrendingItem): void {
  if (typeof window === 'undefined') return;
  const list = getWatchlist();
  if (!list.some(i => i.id === item.id && i.media_type === item.media_type)) {
    const updated = [item, ...list];
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('trendo_watchlist_updated'));
  }
}

export function removeFromWatchlist(id: number, mediaType: string): void {
  if (typeof window === 'undefined') return;
  const list = getWatchlist();
  const updated = list.filter(i => !(i.id === id && i.media_type === mediaType));
  localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('trendo_watchlist_updated'));
}

export function isInWatchlist(id: number, mediaType: string): boolean {
  const list = getWatchlist();
  return list.some(i => i.id === id && i.media_type === mediaType);
}
