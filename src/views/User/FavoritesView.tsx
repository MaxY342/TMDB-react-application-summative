import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonGroup, ImageGrid, ImageOverlay } from "@/components";
import { cartAction, favoriteAction, type ImageCell } from "@/core";
import { useFirebaseContext } from "@/hooks";

export const FavoritesView = () => {
  const navigate = useNavigate();
  const { cart, favorites, toggleCart, toggleFavorite, clearMovieFavorites, clearTvFavorites } = useFirebaseContext();
  const [listType, setListType] = useState<"movie" | "tv">("movie");

  const filteredFavorites = Array.from(favorites.values()).filter((fav) => fav.mediaType === listType);

  return (
    <section className="mx-auto max-w-7xl space-y-5 p-5">
      <h1 className="font-bold text-3xl">Favorites</h1>
      <div>
        <ButtonGroup
          onClick={(value) => setListType(value as "movie" | "tv")}
          options={[
            { label: "Movies", value: "movie" },
            { label: "TV Shows", value: "tv" },
          ]}
          value={listType}
        />
      </div>
      {(listType === "movie" && filteredFavorites.length > 0 && (
        <button
          className="rounded bg-red-500 p-2 text-white hover:bg-red-600"
          disabled={favorites.size === 0}
          onClick={() => clearMovieFavorites()}
        >
          Clear
        </button>
      )) ||
        (listType === "tv" && filteredFavorites.length > 0 && (
          <button
            className="rounded bg-red-500 p-2 text-white hover:bg-red-600"
            disabled={favorites.size === 0}
            onClick={() => clearTvFavorites()}
          >
            Clear
          </button>
        ))}
      {filteredFavorites.length === 0 ? (
        <p className="mt-10 text-gray-400">You have no favorites yet.</p>
      ) : (
        <ImageGrid
          images={filteredFavorites}
          onClick={(image) =>
            navigate(
              `/${image.mediaType === "movie" ? "movies" : "tv"}/${image.mediaType === "movie" ? image.id : image.showId}/${image.mediaType === "movie" ? "credits" : "seasons"}`,
            )
          }
        >
          {(image) => (
            <ImageOverlay
              actions={[
                favoriteAction((image: ImageCell) => favorites.has(image.id), toggleFavorite),
                cartAction((image: ImageCell) => cart.has(image.id), toggleCart),
              ]}
              image={image}
            />
          )}
        </ImageGrid>
      )}
    </section>
  );
};
