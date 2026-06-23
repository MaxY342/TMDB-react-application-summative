import { IoMenu } from "react-icons/io5";
import { Link } from "@/components";

export const SideBar = () => {
  return (
    <div className="group">
      <button className="group z-1 rounded-[10px] border-none bg-gray-900 p-2.5 text-[16px] text-white no-underline">
        <IoMenu />
      </button>
      <div className="fixed top-0 left-0 z-50 flex h-screen w-0 flex-col overflow-hidden whitespace-nowrap bg-gray-800 transition-[width] duration-500 ease-in-out group-hover:w-md">
        <Link to="/">Home</Link>
        <Link match="/movies/category/:listType" to="/movies/category/now_playing">
          Movies
        </Link>
        <Link match="/tv/category/:listType" to="/tv/category/airing_today">
          Tv
        </Link>
        <Link match="/trending/:mediaType" to="/trending/movies">
          Trending
        </Link>
        <Link match="/genre/:mediaType/:genreId" to="/genre/movies/28">
          Genres
        </Link>
        <Link to="/favorites">Favorites</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/settings">Settings</Link>
      </div>
      <div className="pointer-events-none fixed inset-0 z-40 bg-black/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:backdrop-blur-xs"></div>
    </div>
  );
};
