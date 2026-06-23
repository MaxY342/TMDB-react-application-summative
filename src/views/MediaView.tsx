import { FaCalendarAlt } from "react-icons/fa";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { ImageOverlay, LinkGroup, Modal } from "@/components";
import {
  calculatePrice,
  cartAction,
  IMAGE_BASE_URL,
  type ImageCell,
  type MediaResponse,
  MOVIE_ENDPOINT,
  ORIGINAL_IMAGE_BASE_URL,
  TV_ENDPOINT,
} from "@/core";
import { useFirebaseContext, useTmdb } from "@/hooks";

export const MediaView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { data } = useTmdb<MediaResponse>(`${location.pathname.includes("/movies") ? MOVIE_ENDPOINT : TV_ENDPOINT}/${id}`, {
    append_to_response: "videos",
  });
  const { cart, toggleCart } = useFirebaseContext();

  if (!data) {
    return <p className="text-center text-gray-400">Loading...</p>;
  }

  const imageCell: ImageCell = {
    id: data.id,
    imageUrl: `${IMAGE_BASE_URL}${data.poster_path}`,
    mediaType: location.pathname.includes("/movies") ? "movie" : "tv",
    primaryText: data.title || data.name,
    secondaryText: data.release_date || data.first_air_date,
  };

  return (
    <Modal onClick={() => navigate(-1)}>
      <div className="flex h-full min-h-0 flex-col">
        <div
          className="h-105 shrink-0 rounded-2xl bg-center bg-cover"
          style={{
            backgroundImage: `url(${ORIGINAL_IMAGE_BASE_URL}${data.backdrop_path})`,
          }}
        />
        <div className="flex min-h-0 flex-1 gap-5 p-5">
          <img
            alt={data.title || data.name}
            className="h-80 w-56 shrink-0 rounded-xl object-cover"
            src={`${IMAGE_BASE_URL}${data.poster_path}`}
          />
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-2">
            <div className="flex">
              <div>
                <h1 className="font-bold text-3xl">{data.title || data.name}</h1>
                <p className="flex items-center gap-2 text-gray-400">
                  <FaCalendarAlt />
                  {data.release_date || data.first_air_date}
                </p>
                <p className="text-gray-300">{data.overview}</p>
              </div>
              {location.pathname.includes("/movies") && (
                <div className="relative">
                  <ImageOverlay actions={[cartAction((imageCell: ImageCell) => cart.has(imageCell.id), toggleCart)]} image={imageCell} />
                  <p className="mt-12 text-gray-400 text-sm">{`$${calculatePrice(data.release_date)}`}</p>
                </div>
              )}
            </div>
            {location.pathname.includes("/movies") ? (
              <LinkGroup
                options={[
                  { label: "Credits", to: "credits" },
                  { label: "Trailers", to: "trailers" },
                  { label: "Reviews", to: "reviews" },
                ]}
              />
            ) : (
              <LinkGroup
                options={[
                  { label: "Seasons", to: "seasons" },
                  { label: "Credits", to: "credits" },
                  { label: "Trailers", to: "trailers" },
                  { label: "Reviews", to: "reviews" },
                ]}
              />
            )}
            <div className="pt-4">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
