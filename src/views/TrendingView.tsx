import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ButtonGroup, ImageGrid, ImageOverlay, LinkGroup, Pagination } from "@/components";
import {
  calculatePrice,
  cartAction,
  favoriteAction,
  IMAGE_BASE_URL,
  type ImageCell,
  type MediaListResponse,
  TRENDING_ENDPOINT,
} from "@/core";
import { useFirebaseContext, useTmdb } from "@/hooks";

export const TrendingView = () => {
  const navigate = useNavigate();
  const { mediaType = "movies" } = useParams();
  const [page, setPage] = useState<number>(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const interval = searchParams.get("interval") || "day";
  const { favorites, toggleFavorite, cart, toggleCart } = useFirebaseContext();

  const { data } = useTmdb<MediaListResponse>(`${TRENDING_ENDPOINT}/${mediaType === "movies" ? "movie" : "tv"}/${interval}`, {
    page,
    time_window: interval,
  });

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
      <div className="mb-4 flex items-center justify-between">
        <ButtonGroup
          onClick={(value) => {
            setSearchParams({ interval: value });
          }}
          options={[
            { label: "Today", value: "day" },
            { label: "Week", value: "week" },
          ]}
          value={interval}
        />
        <LinkGroup
          options={[
            { label: "Movies", to: "/trending/movies" },
            { label: "TV Shows", to: "/trending/tv" },
          ]}
        />
      </div>
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
