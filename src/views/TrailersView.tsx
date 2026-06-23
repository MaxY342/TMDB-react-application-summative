import { useParams } from "react-router-dom";
import { type MediaResponse, MOVIE_ENDPOINT, TV_ENDPOINT } from "@/core";
import { useTmdb } from "@/hooks";

export const TrailersView = () => {
  const { id } = useParams();
  const { data } = useTmdb<MediaResponse>(`${location.pathname.includes("/movies") ? MOVIE_ENDPOINT : TV_ENDPOINT}/${id}`, {
    append_to_response: "videos",
  });

  let trailerVideos = data?.videos?.results.filter(
    (video) => video.site === "YouTube" && video.type === "Trailer" && video.name?.toLowerCase().includes("official"),
  );

  if (trailerVideos && trailerVideos.length < 1) {
    trailerVideos = data?.videos?.results.filter((video) => video.site === "YouTube" && video.type === "Trailer");
  }

  if (!data) {
    return <p className="text-center text-gray-400">Loading...</p>;
  }

  return (
    <section className="space-y-4 p-5">
      <h2 className="font-bold text-2xl">Trailers</h2>
      {trailerVideos && (
        <div className="aspect-video w-[50%]">
          {trailerVideos.map((element) => (
            <iframe
              allowFullScreen
              className="h-full w-full rounded-xl"
              key={element.key}
              src={`https://www.youtube.com/embed/${element.key}`}
              title="Movie Trailer"
            />
          ))}
        </div>
      )}
    </section>
  );
};
