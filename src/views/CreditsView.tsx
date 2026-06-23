import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ImageGrid } from "@/components";
import { type CreditsResponse, IMAGE_BASE_URL, MOVIE_ENDPOINT, TV_ENDPOINT } from "@/core";
import { useTmdb } from "@/hooks";

export const CreditsView = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = useTmdb<CreditsResponse>(`${location.pathname.startsWith("/movies") ? MOVIE_ENDPOINT : TV_ENDPOINT}/${id}/credits`, {});

  const gridData = (data?.cast ?? []).map((result) => ({
    id: result.id,
    imageUrl: result.profile_path ? `${IMAGE_BASE_URL}${result.profile_path}` : "",
    primaryText: result.name,
    secondaryText: result.character,
  }));

  if (!data) {
    return <p className="text-center text-gray-400">Loading...</p>;
  }

  return (
    <section className="p-5">
      <h2 className="mb-6 font-bold text-2xl">Credits</h2>
      {data.cast.length ? (
        <ImageGrid images={gridData} onClick={(image) => navigate(`/people/${image.id}/career`)} />
      ) : (
        <p className="text-center text-gray-400">No credits available.</p>
      )}
    </section>
  );
};
