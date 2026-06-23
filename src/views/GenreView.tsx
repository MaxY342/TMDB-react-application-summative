import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ImageGrid, ImageOverlay, LinkGroup, Pagination } from "@/components";
import {
  calculatePrice,
  cartAction,
  DISCOVER_ENDPOINT,
  favoriteAction,
  IMAGE_BASE_URL,
  type ImageCell,
  type MediaListResponse,
} from "@/core";
import { useFirebaseContext, useTmdb } from "@/hooks";

export const GenreView = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const { mediaType = "movies", genreId = "0" } = useParams();
  const { favorites, toggleFavorite, cart, toggleCart, moviePreferences, tvPreferences, movieGenres, tvGenres } = useFirebaseContext();
  const { data } = useTmdb<MediaListResponse>(`${DISCOVER_ENDPOINT}/${mediaType === "movies" ? "movie" : "tv"}`, {
    page,
    with_genres: genreId,
  });
  const genresData =
    mediaType === "movies" ? movieGenres.filter((g) => moviePreferences.has(g.id)) : tvGenres.filter((g) => tvPreferences.has(g.id));

  const gridData: ImageCell[] = (data?.results ?? []).map((result) => ({
    id: result.id || 0,
    imageUrl: `${IMAGE_BASE_URL}${result.poster_path}` || "",
    mediaType: mediaType === "movies" ? "movie" : "tv",
    primaryText: result.original_title || result.name || "",
    secondaryText: `${mediaType === "movies" ? `$${calculatePrice(result.release_date)}` : ""}`,
  }));

  if (!data) {
    return <p className="text-center text-gray-400">Loading...</p>;
  }

  return (
    <section className="mx-auto max-w-300 space-y-5 p-5">
      <LinkGroup
        options={[
          {
            label: "Movies",
            match: "/genre/movies/:genreId",
            to: `/genre/movies/${movieGenres.filter((g) => moviePreferences.has(g.id))[0]?.id}`,
          },
          {
            label: "TV",
            match: "/genre/tv/:genreId",
            to: `/genre/tv/${tvGenres.filter((g) => tvPreferences.has(g.id))[0]?.id}`,
          },
        ]}
      />
      <LinkGroup
        options={genresData.map((g) => ({
          label: g.name,
          match: `/genre/${mediaType}/${g.id}`,
          to: `/genre/${mediaType}/${g.id}`,
        }))}
      />
      <ImageGrid
        images={gridData}
        onClick={(image) => navigate(`/${mediaType}/${image.id}/${mediaType === "movies" ? "credits" : "seasons"}`)}
      >
        {(image) => (
          <div>
            {mediaType === "movies" && (
              <ImageOverlay
                actions={[
                  cartAction((image: ImageCell) => cart.has(image.id), toggleCart),
                  favoriteAction((image: ImageCell) => favorites.has(image.id), toggleFavorite),
                ]}
                image={image}
              />
            )}
          </div>
        )}
      </ImageGrid>
      <Pagination maxPages={data.total_pages} onClick={setPage} page={page} />
    </section>
  );
};
