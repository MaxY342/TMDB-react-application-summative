import type { ReactNode } from "react";

export type SearchType = "movie" | "tv" | "person";

export type Media = "movie" | "tv";

export type ImageAction = {
  id: string;
  icon: (active: boolean) => ReactNode;
  active: (image: ImageCell) => boolean;
  onClick: (image: ImageCell) => void;
  position: "left" | "right";
};

export type Message<Category extends string = string> = {
  type: "error" | "success";
  category: Category;
  message: string;
};

export type CreditsResponse = {
  cast: Array<{
    id: number;
    name: string;
    profile_path: string | null;
    character: string;
  }>;
};

export type ImageCell = {
  id: number;
  imageUrl: string;
  primaryText?: string;
  secondaryText?: string;
  showId?: number;
  seasonNumber?: number;
  season?: number;
  mediaType?: string;
};

export type GridData = {
  id: number;
  uniqueId?: string;
  imagePath: string | null;
  primaryText?: string;
  secondaryText?: string;
};

export type MediaListResponse = {
  results: Array<{
    id: number;
    original_title?: string;
    name?: string;
    poster_path?: string;
    profile_path?: string;
    release_date?: string;
  }>;
  total_pages: number;
};

export type MediaResponse = {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: string;
  videos?: {
    results: Array<{
      key: string;
      name: string;
      site: string;
      type: string;
    }>;
  };
  reviews?: {
    results: Array<{
      id: string;
      author: string;
      content: string;
    }>;
  };
  seasons?: Array<{
    id: number;
    name: string;
    air_date: string;
    poster_path: string | null;
    character: string;
    season_number: number;
  }>;
};

export type MoviesResponse = {
  results: Array<{
    id: number;
    original_title: string;
    poster_path: string;
    release_date: string;
  }>;
  total_pages: number;
};

export type ReviewsResponse = {
  results: Array<{
    id: string;
    author: string;
    content: string;
  }>;
};

export type SearchResponse = {
  results: Array<{
    id: number;
    name: string;
    profile_path: string | null;
  }>;
  total_pages: number;
  total_results: number;
};

export type GenresResponse = {
  genres: Array<{
    id: number;
    name: string;
  }>;
};

export type PersonResponse = {
  id: number;
  name: string;
  profile_path: string | null;
  place_of_birth: string;
  birthday: string;
  biography: string;
  images?: {
    profiles: Array<{
      file_path: string;
    }>;
  };
  combined_credits?: {
    cast: Array<{
      id: number;
      title: string;
      character: string;
      poster_path: string | null;
      media_type: string;
    }>;
  };
};

export type SeasonResponse = {
  id: number;
  name: string;
  episodes: Array<{
    id: number;
    name: string;
    air_date: string;
    still_path: string | null;
  }>;
  air_date: string;
  overview: string;
};
