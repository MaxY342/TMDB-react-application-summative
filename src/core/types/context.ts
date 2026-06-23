import type { Auth, User } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { ImageCell } from "@/core";

export type FirebaseContextType = {
  auth: Auth;
  firestore: Firestore;
  user: User | null;
  favorites: Map<number, ImageCell>;
  cart: Map<number, ImageCell>;
  setUser: (user: User | null) => void;
  refreshUser: (updates: { displayName?: string; photoURL?: string; password?: string }) => Promise<void>;
  //toggleFavorite: (image: ImageCell) => Promise<void>;
  toggleFavorite: (image: ImageCell) => void;
  toggleCart: (image: ImageCell) => void;
  clearMovieFavorites: () => void;
  clearTvFavorites: () => void;
  clearCart: () => void;
  moviePreferences: Set<number>;
  tvPreferences: Set<number>;
  movieGenres: { id: number; name: string }[];
  tvGenres: { id: number; name: string }[];
  toggleMoviePreference: (genreId: number) => void;
  toggleTvPreference: (genreId: number) => void;
};
