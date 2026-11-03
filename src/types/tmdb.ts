export type MediaType = 'movie' | 'tv';

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface CastMember {
  id: number;
  name: string;
  original_name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  original_name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface VideoResult {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface TrendingItem {
  id: number;
  media_type: MediaType;
  title: string;
  original_title?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string; // release_date for movies, first_air_date for tv
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  genres?: Genre[];
  original_language: string;
  origin_country?: string[];
  rank?: number;
  badge_label?: string;
  aura_type?: 'gold' | 'silver' | 'bronze' | 'standard';
}

export interface MovieDetails extends TrendingItem {
  media_type: 'movie';
  runtime: number;
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
  production_companies: ProductionCompany[];
  production_countries: Array<{ iso_3166_1: string; name: string }>;
  spoken_languages: Array<{ english_name: string; iso_639_1: string }>;
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  recommendations?: {
    results: TrendingItem[];
  };
  videos?: {
    results: VideoResult[];
  };
}

export interface TVDetails extends TrendingItem {
  media_type: 'tv';
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number[];
  first_air_date: string;
  last_air_date: string;
  in_production: boolean;
  networks: Array<{ id: number; name: string; logo_path: string | null; origin_country: string }>;
  created_by: Array<{ id: number; name: string; profile_path: string | null }>;
  production_companies: ProductionCompany[];
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  recommendations?: {
    results: TrendingItem[];
  };
  videos?: {
    results: VideoResult[];
  };
}

export interface FilterState {
  genre: string; // 'all' or genreId string
  year: string; // 'all' or year
  minRating: number; // 0 to 10
  sortBy: 'rank' | 'rating' | 'popularity' | 'release' | 'alpha';
  language: string; // 'all' or iso code
}
