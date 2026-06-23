import { FaCalendarAlt } from "react-icons/fa";
import { Outlet, useParams } from "react-router-dom";
import { LinkGroup } from "@/components";
import { IMAGE_BASE_URL, PERSON_ENDPOINT, type PersonResponse } from "@/core";
import { useTmdb } from "@/hooks";

export const PersonView = () => {
  const { id } = useParams();
  const { data } = useTmdb<PersonResponse>(`${PERSON_ENDPOINT}/${id}`, { append_to_response: "images,combined_credits" });

  if (!data) {
    return <p className="text-center text-gray-400">Loading...</p>;
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex min-h-0 flex-1 gap-5 p-5">
        <img alt={data.name} className="h-82.5 w-55 shrink-0 rounded-xl object-cover" src={`${IMAGE_BASE_URL}${data.profile_path}`} />
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-2">
          <h1 className="font-bold text-3xl">{data.name}</h1>
          <p className="flex items-center gap-2 text-gray-400">
            <FaCalendarAlt />
            {data.place_of_birth}
          </p>
          <p className="flex items-center gap-2 text-gray-400">
            <FaCalendarAlt />
            {data.birthday}
          </p>
          <p className="text-gray-300">{data.biography}</p>
          <LinkGroup
            options={[
              { label: "Career", to: "career" },
              { label: "Images", to: "images" },
            ]}
          />
          <div className="pt-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
