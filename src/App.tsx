import { Route, Routes } from "react-router-dom";
import { MainLayout } from "@/layouts";
import {
  CareerView,
  CartView,
  CreditsView,
  EpisodeView,
  ErrorView,
  FavoritesView,
  GenreView,
  HomeView,
  ImagesView,
  MediaView,
  MoviesView,
  PersonView,
  ProtectedRoutes,
  ReviewsView,
  SearchView,
  SeasonsView,
  SettingsView,
  SignInView,
  TelevisionView,
  TrailersView,
  TrendingView,
} from "@/views";

export const App = () => {
  return (
    <Routes>
      <Route element={<HomeView />} path="/" />
      <Route element={<SignInView />} path="/signIn" />
      <Route element={<ProtectedRoutes />}>
        <Route element={<MainLayout />}>
          <Route path="/movies">
            <Route element={<MoviesView />} path="category/:listType" />
            <Route element={<MediaView />} path=":id">
              <Route element={<CreditsView />} path="credits" />
              <Route element={<TrailersView />} path="trailers" />
              <Route element={<ReviewsView />} path="reviews" />
            </Route>
          </Route>
          <Route path="/tv">
            <Route element={<TelevisionView />} path="category/:listType" />
            <Route element={<MediaView />} path=":id">
              <Route element={<SeasonsView />} path="seasons">
                <Route element={<EpisodeView />} path=":seasonNumber" />
              </Route>
              <Route element={<CreditsView />} path="credits" />
              <Route element={<TrailersView />} path="trailers" />
              <Route element={<ReviewsView />} path="reviews" />
            </Route>
          </Route>
          <Route element={<PersonView />} path="/people/:id">
            <Route element={<CareerView />} path="career" />
            <Route element={<ImagesView />} path="images" />
          </Route>
          <Route element={<TrendingView />} path="/trending/:mediaType" />
          <Route element={<GenreView />} path="/genre/:mediaType/:genreId" />
          <Route element={<SearchView />} path="/search" />
          <Route element={<FavoritesView />} path="/favorites" />
          <Route element={<CartView />} path="/cart" />
          <Route element={<SettingsView />} path="/settings" />
        </Route>
      </Route>
      <Route element={<ErrorView />} path="*" />
    </Routes>
  );
};
