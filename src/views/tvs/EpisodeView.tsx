import { FaCalendarAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { ImageGrid } from "@/components";
import { IMAGE_BASE_URL, type ImageCell, type SeasonResponse, TV_ENDPOINT } from "@/core";
import { useTmdb } from "@/hooks";

export const EpisodeView = () => {
  const { id, seasonNumber } = useParams();
  const { data } = useTmdb<SeasonResponse>(`${TV_ENDPOINT}/${id}/season/${seasonNumber}`, {});

  const gridData: ImageCell[] = (data?.episodes ?? []).map((result) => ({
    id: result.id,
    imageUrl: result.still_path ? `${IMAGE_BASE_URL}${result.still_path}` : "",
    primaryText: result.name,
    secondaryText: result.air_date,
  }));

  if (!data) {
    return <p className="text-center text-gray-400">Loading...</p>;
  }

  return (
    <section className="p-5">
      <button
        className="mb-5 inline-block rounded-2xl bg-blue-600 px-6 py-3 font-medium text-white shadow-lg transition hover:bg-blue-500"
        onClick={() => window.history.back()}
      >
        Back
      </button>
      <h1 className="mb-2 font-bold text-3xl">{data.name}</h1>
      <p className="flex items-center gap-2 text-gray-400">
        <FaCalendarAlt />
        {data.air_date}
      </p>
      <p className="text-gray-400">{data.overview}</p>
      <h2 className="mb-6 font-bold text-2xl">Episodes</h2>
      {data.episodes?.length ? <ImageGrid images={gridData} /> : <p className="text-center text-gray-400">No seasons available.</p>}
    </section>
  );
};
