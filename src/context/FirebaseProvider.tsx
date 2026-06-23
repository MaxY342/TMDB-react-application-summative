import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, type User, updatePassword, updateProfile } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { FirebaseContext } from "@/context";
import { GENRE_ENDPOINT, type GenresResponse, type ImageCell } from "@/core";
import { useLocalStorage, useTmdb } from "@/hooks";

const firebaseConfig = {
  // Your Firebase configuration goes here
  apiKey: "AIzaSyDrD1AOLcV1eGXuzaeeEzLbzI33-4xH_Wk",
  appId: "1:662360335411:web:cf3976920462ac15e5ef46",
  authDomain: "react-summative.firebaseapp.com",
  messagingSenderId: "662360335411",
  projectId: "react-summative",
  storageBucket: "react-summative.firebasestorage.app",
};

export const FirebaseProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: movieGenresData } = useTmdb<GenresResponse>(`${GENRE_ENDPOINT}/movie/list`);
  const movieGenres = movieGenresData?.genres ?? [];
  const { data: tvGenresData } = useTmdb<GenresResponse>(`${GENRE_ENDPOINT}/tv/list`);
  const tvGenres = tvGenresData?.genres ?? [];
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useLocalStorage<Map<number, ImageCell>, [number, ImageCell][]>("favorites", new Map(), {
    deserialize: (entries) => new Map(entries),
    serialize: (map) => Array.from(map.entries()),
  });
  const [cart, setCart] = useLocalStorage<Map<number, ImageCell>, [number, ImageCell][]>("cart", new Map(), {
    deserialize: (entries) => new Map(entries),
    serialize: (map) => Array.from(map.entries()),
  });
  const [moviePreferences, setMoviePreferences] = useState<Set<number>>(new Set());
  const [tvPreferences, setTvPreferences] = useState<Set<number>>(new Set());

  const { auth, firestore } = useMemo(() => {
    const app = initializeApp(firebaseConfig);

    return { auth: getAuth(app), firestore: getFirestore(app) };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (movieGenres.length > 0 && tvGenres.length > 0) {
        try {
          if (user) {
            const snapshot = await getDoc(doc(firestore, "users", user.uid));
            setUser(user);
            setMoviePreferences(new Set(snapshot.exists() ? snapshot.data().moviePreferences : movieGenres.map((g) => g.id)));
            setTvPreferences(new Set(snapshot.exists() ? snapshot.data().tvPreferences : tvGenres.map((g) => g.id)));
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("User sync error:", error);
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [auth, firestore, movieGenres, tvGenres]);

  const refreshUser = async (updates: { displayName?: string; photoURL?: string; password?: string }) => {
    if (!auth.currentUser) {
      return;
    }

    try {
      await updateProfile(auth.currentUser, updates);
      if (updates.password) {
        await updatePassword(auth.currentUser, updates.password);
      }
      await auth.currentUser.reload();
      setUser(Object.assign(Object.create(Object.getPrototypeOf(auth.currentUser)), auth.currentUser));
    } catch (error) {
      console.error("Refresh error:", error);
    }
  };

  const toggleFavorite = (image: ImageCell) => {
    setFavorites((prev) => {
      const cloned = new Map(prev);

      if (cloned.has(image.id)) {
        cloned.delete(image.id);
      } else {
        cloned.set(image.id, image);
      }

      return cloned;
    });
    setCart((prev) => {
      const cloned = new Map(prev);

      if (cloned.has(image.id)) {
        cloned.delete(image.id);
      }

      return cloned;
    });
  };

  const clearMovieFavorites = () => {
    setFavorites((prev) => {
      const cloned = new Map(prev);
      Array.from(cloned.values()).forEach((fav) => {
        if (fav.mediaType === "movie") {
          cloned.delete(fav.id);
        }
      });
      return cloned;
    });
  };

  const clearTvFavorites = () => {
    setFavorites((prev) => {
      const cloned = new Map(prev);
      Array.from(cloned.values()).forEach((fav) => {
        if (fav.mediaType === "tv") {
          cloned.delete(fav.id);
        }
      });
      return cloned;
    });
  };

  const toggleCart = (image: ImageCell) => {
    setCart((prev) => {
      const cloned = new Map(prev);

      if (cloned.has(image.id)) {
        cloned.delete(image.id);
      } else {
        cloned.set(image.id, image);
      }

      return cloned;
    });
    setFavorites((prev) => {
      const cloned = new Map(prev);

      if (cloned.has(image.id)) {
        cloned.delete(image.id);
      }

      return cloned;
    });
  };

  const clearCart = () => {
    setCart(new Map());
  };

  const toggleMoviePreference = async (genreId: number) => {
    const next = new Set(moviePreferences);
    next.has(genreId) ? next.delete(genreId) : next.add(genreId);

    setMoviePreferences(next);

    if (user) {
      await setDoc(doc(firestore, "users", user.uid), { moviePreferences: Array.from(next) }, { merge: true });
    }
  };

  const toggleTvPreference = async (genreId: number) => {
    const next = new Set(tvPreferences);
    next.has(genreId) ? next.delete(genreId) : next.add(genreId);

    setTvPreferences(next);

    if (user) {
      await setDoc(doc(firestore, "users", user.uid), { tvPreferences: Array.from(next) }, { merge: true });
    }
  };

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;

  return (
    <FirebaseContext.Provider
      value={{
        auth,
        cart,
        clearCart,
        clearMovieFavorites,
        clearTvFavorites,
        favorites,
        firestore,
        movieGenres,
        moviePreferences,
        refreshUser,
        setUser,
        toggleCart,
        toggleFavorite,
        toggleMoviePreference,
        toggleTvPreference,
        tvGenres,
        tvPreferences,
        user,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
