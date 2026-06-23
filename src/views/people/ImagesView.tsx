import { useParams } from "react-router-dom";
import { ImageGrid } from "@/components";
import { IMAGE_BASE_URL, type ImageCell, PERSON_ENDPOINT, type PersonResponse } from "@/core";
import { useTmdb } from "@/hooks";

export const ImagesView = () => {
  const { id } = useParams();
  const { data } = useTmdb<PersonResponse>(`${PERSON_ENDPOINT}/${id}`, { append_to_response: "images" });

  const gridData: ImageCell[] = (data?.images?.profiles ?? []).map((result) => ({
    id: 0,
    imageUrl: `${IMAGE_BASE_URL}${result.file_path}`,
  }));

  if (!data) {
    return <p className="text-center text-gray-400">Loading...</p>;
  }

  return (
    <section className="p-5">
      <h2 className="mb-6 font-bold text-2xl">Images</h2>
      {data.images?.profiles.length ? <ImageGrid images={gridData} /> : <p className="text-center text-gray-400">No images available.</p>}
    </section>
  );
};
