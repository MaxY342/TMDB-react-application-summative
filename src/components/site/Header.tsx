import { useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { GoGear } from "react-icons/go";
import { IoCartOutline } from "react-icons/io5";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ButtonGroup, LinkGroup, SearchBar, SideBar } from "@/components";
import { ICON_SIZE } from "@/core/constants/images";
import { useFirebaseContext } from "@/hooks";

export const Header = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    searchType: "movie",
  });
  const [searchType, setSearchType] = useState("movie");
  const query = searchParams.get("query") || "";
  const location = useLocation();
  const navigate = useNavigate();
  const { user, auth, favorites, cart, moviePreferences, movieGenres } = useFirebaseContext();
  const onSearch = (query: string) => {
    navigate({
      pathname: "/search",
      search: `?query=${encodeURIComponent(query)}&searchType=${searchType}`,
    });
  };
  const signOut = () => {
    auth.signOut();
    navigate("/");
  };
  return (
    <header>
      <nav className="flex justify-between bg-gray-800 p-4">
        <div className="flex items-center gap-4">
          <SideBar />
          <h1 className="font-bold text-2xl text-white-900">TMDB Explorer</h1>
          <LinkGroup
            options={[
              {
                label: "Movies",
                match: "/movies/category/:listType",
                to: "/movies/category/now_playing",
              },
              {
                label: "TV",
                match: "/tv/category/:listType",
                to: "/tv/category/airing_today",
              },
              {
                label: "Trending",
                match: "/trending/:mediaType",
                to: "/trending/movies",
              },
              {
                label: "Genres",
                match: "/genre/:mediaType/:genreId",
                to: `/genre/movies/${movieGenres.filter((g) => moviePreferences.has(g.id))[0]?.id}`,
              },
            ]}
          />
        </div>
        <div className="flex items-center gap-4">
          <SearchBar onChange={(value) => onSearch(value)} value={query} />
          <ButtonGroup
            onClick={(value) => {
              setSearchType(value);
              if (location.pathname === "/search") {
                setSearchParams({ query, searchType: value });
              }
            }}
            options={[
              { label: "Movies", value: "movie" },
              { label: "TV", value: "tv" },
              { label: "Person", value: "person" },
            ]}
            value={searchType}
          />
          <img alt="User Avatar" className="h-8 w-8 rounded-full" src={user?.photoURL || undefined} />
          <h1 className="mr-4 text-gray-300 text-xl">{user?.displayName}</h1>
          <button className="relative rounded-full p-2 transition hover:bg-gray-700" onClick={() => navigate("/favorites")}>
            <FaRegHeart size={ICON_SIZE} />
            {favorites.size > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">
                {favorites.size}
              </span>
            )}
          </button>
          <button className="relative rounded-full p-2 transition hover:bg-gray-700" onClick={() => navigate("/cart")}>
            <IoCartOutline size={ICON_SIZE} />
            {cart.size > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">
                {cart.size}
              </span>
            )}
          </button>
          <button className="relative rounded-full p-2 transition hover:bg-gray-700" onClick={() => navigate("/settings")}>
            <GoGear size={ICON_SIZE} />
          </button>
          <button className="relative rounded-full p-2 transition hover:bg-gray-700" onClick={() => signOut()}>
            <FiLogOut size={ICON_SIZE} />
          </button>
        </div>
      </nav>
    </header>
  );
};
