import { useNavigate, useParams } from "react-router-dom";
import { ImageGrid } from "@/components";
import { IMAGE_BASE_URL, type ImageCell, PERSON_ENDPOINT, type PersonResponse } from "@/core";
import { useTmdb } from "@/hooks";

export const CareerView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useTmdb<PersonResponse>(`${PERSON_ENDPOINT}/${id}`, { append_to_response: "combined_credits" });

  const gridData: ImageCell[] = (data?.combined_credits?.cast ?? []).map((result) => ({
    id: result.id,
    imageUrl: result.poster_path ? `${IMAGE_BASE_URL}${result.poster_path}` : "",
    mediaType: result.media_type || "movie",
    primaryText: result.title,
    secondaryText: result.character,
  }));

  if (!data) {
    return <p className="text-center text-gray-400">Loading...</p>;
  }

  return (
    <section className="p-5">
      <h2 className="mb-6 font-bold text-2xl">Career</h2>
      {data.combined_credits?.cast.length ? (
        <ImageGrid
          images={gridData}
          onClick={(image) => {
            const entry = gridData.find((item) => item.id === image.id);
            if (entry) {
              navigate(
                `/${entry.mediaType === "movie" ? "movies" : "tv"}/${image.id}/${entry.mediaType === "movie" ? "credits" : "seasons"}`,
              );
            }
          }}
        />
      ) : (
        <p className="text-center text-gray-400">No career entries available.</p>
      )}
    </section>
  );
};
