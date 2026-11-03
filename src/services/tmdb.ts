import {
  TrendingItem,
  MovieDetails,
  TVDetails,
  MediaType,
  FilterState
} from '../types/tmdb';
import { FALLBACK_MOVIES, FALLBACK_TV, FALLBACK_MOVIE_DETAILS } from '../data/fallbackData';

const BASE_URL = 'https://api.themoviedb.org/3';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

interface CacheEntry<T> {
  timestamp: number;
  data: T;
}

const memoryCache = new Map<string, CacheEntry<any>>();

export class TmdbService {
  private static storageKey = 'trendo_tmdb_api_key';

  public static getApiKey(): string {
    const customKey = typeof window !== 'undefined' ? localStorage.getItem(this.storageKey) : null;
    if (customKey && customKey.trim().length > 0) {
      return customKey.trim();
    }
    return import.meta.env.VITE_TMDB_API_KEY || '';
  }

  public static setApiKey(key: string): void {
    if (typeof window !== 'undefined') {
      if (key && key.trim()) {
        localStorage.setItem(this.storageKey, key.trim());
      } else {
        localStorage.removeItem(this.storageKey);
      }
      memoryCache.clear();
    }
  }

  public static hasApiKey(): boolean {
    const key = this.getApiKey();
    return !!key && key !== 'your_tmdb_api_key_here';
  }

  private static getCache<T>(key: string): T | null {
    const entry = memoryCache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
      memoryCache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  private static setCache<T>(key: string, data: T): void {
    memoryCache.set(key, {
      timestamp: Date.now(),
      data
    });
  }

  private static async request<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
    const apiKey = this.getApiKey();
    if (!apiKey || apiKey === 'your_tmdb_api_key_here') {
      throw new Error('NO_API_KEY');
    }

    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('language', 'en-US');

    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        url.searchParams.set(k, String(v));
      }
    });

    const cacheKey = url.toString();
    const cached = this.getCache<T>(cacheKey);
    if (cached) return cached;

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('INVALID_API_KEY');
      }
      throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    this.setCache(cacheKey, data);
    return data;
  }

  /**
   * Fetch top 50 trending movies or TV shows
   */
  public static async getTrending(mediaType: MediaType, timeWindow: 'day' | 'week' = 'day'): Promise<TrendingItem[]> {
    if (!this.hasApiKey()) {
      return mediaType === 'movie' ? FALLBACK_MOVIES : FALLBACK_TV;
    }

    try {
      // TMDB returns 20 items per page; fetch pages 1, 2, and 3 to get 50 top items
      const [page1, page2, page3] = await Promise.all([
        this.request<{ results: any[] }>(`/trending/${mediaType}/${timeWindow}`, { page: 1 }),
        this.request<{ results: any[] }>(`/trending/${mediaType}/${timeWindow}`, { page: 2 }),
        this.request<{ results: any[] }>(`/trending/${mediaType}/${timeWindow}`, { page: 3 })
      ]);

      const rawItems = [
        ...(page1.results || []),
        ...(page2.results || []),
        ...(page3.results || [])
      ].slice(0, 50);

      return rawItems.map((item, idx) => {
        const rank = idx + 1;
        let badge_label: string | undefined = undefined;
        let aura_type: 'gold' | 'silver' | 'bronze' | 'standard' = 'standard';

        if (rank === 1) {
          aura_type = 'gold';
          badge_label = mediaType === 'movie' ? 'GLOBAL BOX OFFICE LEADER' : 'GLOBAL TELEMETRY LEADER';
        } else if (rank === 2) {
          aura_type = 'silver';
          badge_label = mediaType === 'movie' ? 'CRITICS HIGH ROTATION' : 'SEASONAL SENSATION';
        } else if (rank === 3) {
          aura_type = 'bronze';
          badge_label = mediaType === 'movie' ? 'PODIUM CONTENDER' : 'STREAMING PHENOMENON';
        } else if (item.vote_average >= 8.2) {
          badge_label = 'CRITICS CONSENSUS';
        } else if (item.popularity > 500) {
          badge_label = 'TELEMETRY SURGE';
        }

        return {
          id: item.id,
          media_type: mediaType,
          title: item.title || item.name || 'Untitled Feature',
          original_title: item.original_title || item.original_name,
          overview: item.overview || 'Archival synopsis currently pending editorial entry.',
          poster_path: item.poster_path,
          backdrop_path: item.backdrop_path,
          release_date: item.release_date || item.first_air_date || '',
          vote_average: typeof item.vote_average === 'number' ? parseFloat(item.vote_average.toFixed(1)) : 0,
          vote_count: item.vote_count || 0,
          popularity: typeof item.popularity === 'number' ? parseFloat(item.popularity.toFixed(1)) : 0,
          genre_ids: item.genre_ids || [],
          original_language: item.original_language || 'en',
          origin_country: item.origin_country,
          rank,
          aura_type,
          badge_label
        };
      });
    } catch (err) {
      console.warn('Falling back to curated TMDB telemetry dataset:', err);
      return mediaType === 'movie' ? FALLBACK_MOVIES : FALLBACK_TV;
    }
  }

  /**
   * Search for Movies & TV shows
   */
  public static async search(query: string, mediaType?: MediaType): Promise<TrendingItem[]> {
    if (!query || !query.trim()) return [];
    if (!this.hasApiKey()) {
      const q = query.toLowerCase();
      const pool = mediaType === 'movie' ? FALLBACK_MOVIES : mediaType === 'tv' ? FALLBACK_TV : [...FALLBACK_MOVIES, ...FALLBACK_TV];
      return pool.filter(i => i.title.toLowerCase().includes(q) || i.overview.toLowerCase().includes(q));
    }

    try {
      if (mediaType) {
        const data = await this.request<{ results: any[] }>(`/search/${mediaType}`, { query: query.trim(), page: 1 });
        return (data.results || []).map((item, idx) => ({
          id: item.id,
          media_type: mediaType,
          title: item.title || item.name || 'Untitled',
          original_title: item.original_title || item.original_name,
          overview: item.overview || '',
          poster_path: item.poster_path,
          backdrop_path: item.backdrop_path,
          release_date: item.release_date || item.first_air_date || '',
          vote_average: typeof item.vote_average === 'number' ? parseFloat(item.vote_average.toFixed(1)) : 0,
          vote_count: item.vote_count || 0,
          popularity: typeof item.popularity === 'number' ? parseFloat(item.popularity.toFixed(1)) : 0,
          genre_ids: item.genre_ids || [],
          original_language: item.original_language || 'en',
          rank: idx + 1
        }));
      }

      const data = await this.request<{ results: any[] }>('/search/multi', { query: query.trim(), page: 1 });
      return (data.results || [])
        .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
        .map((item, idx) => ({
          id: item.id,
          media_type: item.media_type as MediaType,
          title: item.title || item.name || 'Untitled',
          original_title: item.original_title || item.original_name,
          overview: item.overview || '',
          poster_path: item.poster_path,
          backdrop_path: item.backdrop_path,
          release_date: item.release_date || item.first_air_date || '',
          vote_average: typeof item.vote_average === 'number' ? parseFloat(item.vote_average.toFixed(1)) : 0,
          vote_count: item.vote_count || 0,
          popularity: typeof item.popularity === 'number' ? parseFloat(item.popularity.toFixed(1)) : 0,
          genre_ids: item.genre_ids || [],
          original_language: item.original_language || 'en',
          rank: idx + 1
        }));
    } catch (err) {
      console.error('Search failed:', err);
      return [];
    }
  }

  /**
   * Discover movies or TV with filters
   */
  public static async discover(mediaType: MediaType, filters: FilterState): Promise<TrendingItem[]> {
    if (!this.hasApiKey()) {
      let results = mediaType === 'movie' ? [...FALLBACK_MOVIES] : [...FALLBACK_TV];
      if (filters.genre && filters.genre !== 'all') {
        const gid = parseInt(filters.genre, 10);
        results = results.filter(i => i.genre_ids.includes(gid));
      }
      if (filters.year && filters.year !== 'all') {
        results = results.filter(i => i.release_date.startsWith(filters.year));
      }
      if (filters.minRating > 0) {
        results = results.filter(i => i.vote_average >= filters.minRating);
      }
      if (filters.language && filters.language !== 'all') {
        results = results.filter(i => i.original_language === filters.language);
      }
      // Apply sort
      results = this.sortItems(results, filters.sortBy);
      return results;
    }

    try {
      const params: Record<string, string | number> = {
        page: 1,
        'vote_count.gte': 20
      };

      if (filters.genre && filters.genre !== 'all') {
        params['with_genres'] = filters.genre;
      }
      if (filters.year && filters.year !== 'all') {
        if (mediaType === 'movie') {
          params['primary_release_year'] = filters.year;
        } else {
          params['first_air_date_year'] = filters.year;
        }
      }
      if (filters.minRating > 0) {
        params['vote_average.gte'] = filters.minRating;
      }
      if (filters.language && filters.language !== 'all') {
        params['with_original_language'] = filters.language;
      }

      // Sort param
      switch (filters.sortBy) {
        case 'rating':
          params['sort_by'] = 'vote_average.desc';
          break;
        case 'popularity':
          params['sort_by'] = 'popularity.desc';
          break;
        case 'release':
          params['sort_by'] = mediaType === 'movie' ? 'primary_release_date.desc' : 'first_air_date.desc';
          break;
        case 'alpha':
          params['sort_by'] = mediaType === 'movie' ? 'title.asc' : 'name.asc';
          break;
        default:
          params['sort_by'] = 'popularity.desc';
      }

      const [p1, p2] = await Promise.all([
        this.request<{ results: any[] }>(`/discover/${mediaType}`, { ...params, page: 1 }),
        this.request<{ results: any[] }>(`/discover/${mediaType}`, { ...params, page: 2 })
      ]);

      const combined = [...(p1.results || []), ...(p2.results || [])].slice(0, 40);

      return combined.map((item, idx) => ({
        id: item.id,
        media_type: mediaType,
        title: item.title || item.name || 'Untitled',
        original_title: item.original_title || item.original_name,
        overview: item.overview || '',
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path,
        release_date: item.release_date || item.first_air_date || '',
        vote_average: typeof item.vote_average === 'number' ? parseFloat(item.vote_average.toFixed(1)) : 0,
        vote_count: item.vote_count || 0,
        popularity: typeof item.popularity === 'number' ? parseFloat(item.popularity.toFixed(1)) : 0,
        genre_ids: item.genre_ids || [],
        original_language: item.original_language || 'en',
        rank: idx + 1
      }));
    } catch (err) {
      console.warn('Discover failed, falling back:', err);
      const pool = mediaType === 'movie' ? [...FALLBACK_MOVIES] : [...FALLBACK_TV];
      return this.sortItems(pool, filters.sortBy);
    }
  }

  public static sortItems(items: TrendingItem[], sortBy: FilterState['sortBy']): TrendingItem[] {
    const list = [...items];
    switch (sortBy) {
      case 'rating':
        return list.sort((a, b) => b.vote_average - a.vote_average);
      case 'popularity':
        return list.sort((a, b) => b.popularity - a.popularity);
      case 'release':
        return list.sort((a, b) => new Date(b.release_date || 0).getTime() - new Date(a.release_date || 0).getTime());
      case 'alpha':
        return list.sort((a, b) => a.title.localeCompare(b.title));
      case 'rank':
      default:
        return list.sort((a, b) => (a.rank || 999) - (b.rank || 999));
    }
  }

  /**
   * Detailed Movie Information with Cast, Crew, Recommendations, Videos
   */
  public static async getMovieDetails(id: number): Promise<MovieDetails> {
    if (!this.hasApiKey()) {
      if (FALLBACK_MOVIE_DETAILS[id]) {
        return FALLBACK_MOVIE_DETAILS[id];
      }
      const basic = FALLBACK_MOVIES.find(m => m.id === id) || FALLBACK_MOVIES[0];
      return {
        ...basic,
        media_type: 'movie',
        runtime: 142,
        tagline: 'A cinematic dispatch from the global archive.',
        status: 'Released',
        budget: 150000000,
        revenue: 450000000,
        production_companies: [
          { id: 1, name: 'Prestige Productions', logo_path: null, origin_country: 'US' }
        ],
        production_countries: [{ iso_3166_1: 'US', name: 'United States' }],
        spoken_languages: [{ english_name: 'English', iso_639_1: 'en' }],
        credits: {
          cast: [
            { id: 101, name: 'Lead Performer', original_name: 'Lead Performer', character: 'Protagonist', profile_path: null, order: 0 },
            { id: 102, name: 'Co-Star', original_name: 'Co-Star', character: 'Antagonist', profile_path: null, order: 1 }
          ],
          crew: [
            { id: 201, name: 'Director', original_name: 'Director', job: 'Director', department: 'Directing', profile_path: null }
          ]
        },
        recommendations: {
          results: FALLBACK_MOVIES.filter(m => m.id !== id).slice(0, 4)
        }
      };
    }

    try {
      const data = await this.request<any>(`/movie/${id}`, {
        append_to_response: 'credits,recommendations,videos'
      });

      return {
        id: data.id,
        media_type: 'movie',
        title: data.title || 'Untitled',
        original_title: data.original_title,
        overview: data.overview || '',
        poster_path: data.poster_path,
        backdrop_path: data.backdrop_path,
        release_date: data.release_date || '',
        vote_average: typeof data.vote_average === 'number' ? parseFloat(data.vote_average.toFixed(1)) : 0,
        vote_count: data.vote_count || 0,
        popularity: typeof data.popularity === 'number' ? parseFloat(data.popularity.toFixed(1)) : 0,
        genre_ids: (data.genres || []).map((g: any) => g.id),
        genres: data.genres || [],
        original_language: data.original_language || 'en',
        runtime: data.runtime || 0,
        tagline: data.tagline || '',
        status: data.status || 'Released',
        budget: data.budget || 0,
        revenue: data.revenue || 0,
        production_companies: data.production_companies || [],
        production_countries: data.production_countries || [],
        spoken_languages: data.spoken_languages || [],
        credits: data.credits,
        recommendations: {
          results: (data.recommendations?.results || []).map((r: any) => ({
            id: r.id,
            media_type: 'movie' as MediaType,
            title: r.title || 'Untitled',
            overview: r.overview || '',
            poster_path: r.poster_path,
            backdrop_path: r.backdrop_path,
            release_date: r.release_date || '',
            vote_average: parseFloat((r.vote_average || 0).toFixed(1)),
            vote_count: r.vote_count || 0,
            popularity: parseFloat((r.popularity || 0).toFixed(1)),
            genre_ids: r.genre_ids || [],
            original_language: r.original_language || 'en'
          }))
        },
        videos: data.videos
      };
    } catch (err) {
      console.error('getMovieDetails failed:', err);
      const basic = FALLBACK_MOVIES.find(m => m.id === id) || FALLBACK_MOVIES[0];
      return {
        ...basic,
        media_type: 'movie',
        runtime: 120,
        tagline: '',
        status: 'Released',
        budget: 0,
        revenue: 0,
        production_companies: [],
        production_countries: [],
        spoken_languages: [],
        credits: { cast: [], crew: [] }
      };
    }
  }

  /**
   * Detailed TV Show Information with Cast, Networks, Seasons, Episodes, Recommendations
   */
  public static async getTVDetails(id: number): Promise<TVDetails> {
    if (!this.hasApiKey()) {
      const basic = FALLBACK_TV.find(t => t.id === id) || FALLBACK_TV[0];
      return {
        ...basic,
        media_type: 'tv',
        number_of_seasons: 2,
        number_of_episodes: 20,
        episode_run_time: [55],
        first_air_date: basic.release_date,
        last_air_date: '2024-05-01',
        in_production: true,
        networks: [
          { id: 1, name: 'FX / Hulu', logo_path: null, origin_country: 'US' }
        ],
        created_by: [
          { id: 1, name: 'Prestige Creators', profile_path: null }
        ],
        production_companies: [
          { id: 1, name: 'Television Studio', logo_path: null, origin_country: 'US' }
        ],
        credits: {
          cast: [
            { id: 101, name: 'Lead Actor', original_name: 'Lead Actor', character: 'Key Figure', profile_path: null, order: 0 },
            { id: 102, name: 'Supporting Star', original_name: 'Supporting Star', character: 'Adversary', profile_path: null, order: 1 }
          ],
          crew: [
            { id: 201, name: 'Executive Producer', original_name: 'Executive Producer', job: 'Executive Producer', department: 'Production', profile_path: null }
          ]
        },
        recommendations: {
          results: FALLBACK_TV.filter(t => t.id !== id).slice(0, 4)
        }
      };
    }

    try {
      const data = await this.request<any>(`/tv/${id}`, {
        append_to_response: 'credits,recommendations,videos'
      });

      return {
        id: data.id,
        media_type: 'tv',
        title: data.name || 'Untitled Show',
        original_title: data.original_name,
        overview: data.overview || '',
        poster_path: data.poster_path,
        backdrop_path: data.backdrop_path,
        release_date: data.first_air_date || '',
        first_air_date: data.first_air_date || '',
        last_air_date: data.last_air_date || '',
        vote_average: typeof data.vote_average === 'number' ? parseFloat(data.vote_average.toFixed(1)) : 0,
        vote_count: data.vote_count || 0,
        popularity: typeof data.popularity === 'number' ? parseFloat(data.popularity.toFixed(1)) : 0,
        genre_ids: (data.genres || []).map((g: any) => g.id),
        genres: data.genres || [],
        original_language: data.original_language || 'en',
        number_of_seasons: data.number_of_seasons || 1,
        number_of_episodes: data.number_of_episodes || 1,
        episode_run_time: data.episode_run_time || [],
        in_production: !!data.in_production,
        networks: data.networks || [],
        created_by: data.created_by || [],
        production_companies: data.production_companies || [],
        credits: data.credits,
        recommendations: {
          results: (data.recommendations?.results || []).map((r: any) => ({
            id: r.id,
            media_type: 'tv' as MediaType,
            title: r.name || 'Untitled',
            overview: r.overview || '',
            poster_path: r.poster_path,
            backdrop_path: r.backdrop_path,
            release_date: r.first_air_date || '',
            vote_average: parseFloat((r.vote_average || 0).toFixed(1)),
            vote_count: r.vote_count || 0,
            popularity: parseFloat((r.popularity || 0).toFixed(1)),
            genre_ids: r.genre_ids || [],
            original_language: r.original_language || 'en'
          }))
        },
        videos: data.videos
      };
    } catch (err) {
      console.error('getTVDetails failed:', err);
      const basic = FALLBACK_TV.find(t => t.id === id) || FALLBACK_TV[0];
      return {
        ...basic,
        media_type: 'tv',
        number_of_seasons: 1,
        number_of_episodes: 1,
        episode_run_time: [],
        first_air_date: basic.release_date,
        last_air_date: '',
        in_production: false,
        networks: [],
        created_by: [],
        production_companies: [],
        credits: { cast: [], crew: [] }
      };
    }
  }
}
