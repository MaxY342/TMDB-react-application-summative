import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ImageGrid, ImageOverlay, LinkGroup, Pagination } from "@/components";
import { calculatePrice, cartAction, favoriteAction, IMAGE_BASE_URL, type ImageCell, MOVIE_ENDPOINT, type MoviesResponse } from "@/core";
import { useFirebaseContext, useTmdb } from "@/hooks";

export const MoviesView = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const { listType = "now_playing" } = useParams();
  const { favorites, toggleFavorite, cart, toggleCart } = useFirebaseContext();
  const { data } = useTmdb<MoviesResponse>(`${MOVIE_ENDPOINT}/${listType}`, { page });

  const gridData: ImageCell[] = (data?.results ?? []).map((result) => ({
    id: result.id,
    imageUrl: `${IMAGE_BASE_URL}${result.poster_path}`,
    mediaType: "movie",
    primaryText: result.original_title,
    secondaryText: `$${calculatePrice(result.release_date)}`,
  }));

  if (!data) {
    return <p className="text-center text-gray-400">Loading...</p>;
  }

  return (
    <section className="mx-auto max-w-300 space-y-5 p-5">
      <LinkGroup
        options={[
          { label: "NowPlaying", to: "/movies/category/now_playing" },
          { label: "Popular", to: "/movies/category/popular" },
          { label: "Top Rated", to: "/movies/category/top_rated" },
          { label: "Upcoming", to: "/movies/category/upcoming" },
        ]}
      />
      <ImageGrid images={gridData} onClick={(image) => navigate(`/movies/${image.id}/credits`)}>
        {(image) => (
          <div>
            <ImageOverlay actions={[favoriteAction((image: ImageCell) => favorites.has(image.id), toggleFavorite)]} image={image} />
            <ImageOverlay actions={[cartAction((image: ImageCell) => cart.has(image.id), toggleCart)]} image={image} />
          </div>
        )}
      </ImageGrid>
      <Pagination maxPages={data.total_pages} onClick={setPage} page={page} />
    </section>
  );
};
