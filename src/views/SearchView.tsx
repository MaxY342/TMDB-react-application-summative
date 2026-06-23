import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ImageGrid, ImageOverlay, Pagination } from "@/components";
import {
  calculatePrice,
  cartAction,
  favoriteAction,
  IMAGE_BASE_URL,
  type ImageCell,
  type MediaListResponse,
  SEARCH_ENDPOINT,
} from "@/core";
import { useDebounce, useFirebaseContext, useTmdb } from "@/hooks";

export const SearchView = () => {
  const [page, setPage] = useState<number>(1);
  const [searchParams] = useSearchParams();
  const searchType = searchParams.get("searchType");
  const { favorites, toggleFavorite, cart, toggleCart } = useFirebaseContext();
  const query = searchParams.get("query");
  const debouncedQuery = useDebounce(query, 500);
  const navigate = useNavigate();
  const { data } = useTmdb<MediaListResponse>(`${SEARCH_ENDPOINT}/${searchType}`, { page, query: debouncedQuery });

  useEffect(() => {
    setPage(1);
  }, []);

  const gridData: ImageCell[] = (data?.results ?? []).map((result) => ({
    id: result.id,
    imageUrl: `${IMAGE_BASE_URL}${result.profile_path || result.poster_path || ""}`,
    mediaType: searchType === "movie" ? "movie" : "tv",
    primaryText: result.name || result.original_title || "",
    secondaryText: `${searchType === "movie" ? `$${calculatePrice(result.release_date)}` : ""}`,
  }));

  if (!data) {
    return <p className="text-center text-gray-400">Loading...</p>;
  }

  return (
    <section className="mx-auto max-w-300 space-y-5 p-10">
      <ImageGrid
        images={gridData}
        onClick={(image) =>
          navigate(
            `/${searchType === "movie" ? "movies" : searchType === "tv" ? "tv" : "people"}/${image.id}/${searchType === "movie" ? "credits" : searchType === "tv" ? "seasons" : "career"}`,
          )
        }
      >
        {(image) =>
          searchType === "movie" ? (
            <div>
              <ImageOverlay
                actions={[
                  cartAction((image: ImageCell) => cart.has(image.id), toggleCart),
                  favoriteAction((image: ImageCell) => favorites.has(image.id), toggleFavorite),
                ]}
                image={image}
              />
            </div>
          ) : null
        }
      </ImageGrid>
      {data.results.length ? (
        <Pagination maxPages={data.total_pages} onClick={setPage} page={page} />
      ) : (
        <p className="text-center text-gray-400">No search results found</p>
      )}
    </section>
  );
};
