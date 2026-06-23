import { useState } from "react";
import { Button, Checkbox, AvatarSelector } from "@/components";
import { useFirebaseContext } from "@/hooks";
import { AVATARS } from "@/core";

export const SettingsView = () => {
  const { user, refreshUser, moviePreferences, toggleMoviePreference, tvPreferences, toggleTvPreference, movieGenres, tvGenres } =
    useFirebaseContext();
  const [value, setValue] = useState(user?.displayName || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [movieError, setMovieError] = useState("");
  const [tvError, setTvError] = useState("");
  const [avatar, setAvatar] = useState(user?.photoURL || AVATARS[0]);
  const handleMoviePreferenceToggle = (genreId: number) => {
    if (moviePreferences.has(genreId) && moviePreferences.size === 1) {
      setMovieError("You must select at least one movie genre.");
      return;
    }

    setMovieError("");
    toggleMoviePreference(genreId);
  };
  const handleTvPreferenceToggle = (genreId: number) => {
    if (tvPreferences.has(genreId) && tvPreferences.size === 1) {
      setTvError("You must select at least one TV genre.");
      return;
    }

    setTvError("");
    toggleTvPreference(genreId);
  };
  const resetUsername = () => {
    setValue(user?.displayName || "");
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <h1 className="font-bold text-4xl">Settings</h1>
        <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-lg">
          <div className="mb-6">
            <h2 className="font-semibold text-xl">Profile</h2>
            <p className="text-gray-400 text-sm">Update your profile information</p>
          </div>
          <div className="max-w-md space-y-2">
            <label className="text-gray-300 text-sm">Change Username and Avatar</label>
            <AvatarSelector avatars={AVATARS} onChange={setAvatar} value={avatar} />
            <input
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(event) => {
                setValue(event.target.value);
                setError("");
              }}
              placeholder="Enter your name"
              type="text"
              value={value}
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button onClick={() => resetUsername()} variant="grey">
              Reset
            </Button>
            <Button
              onClick={() => {
                const trimmed = value.trim();

                if (!trimmed) {
                  setError("Username cannot be empty");
                  return;
                }

                refreshUser({ displayName: value, photoURL: avatar });
                setError("");
              }}
            >
              Save
            </Button>
          </div>
          <div className="max-w-md space-y-2">
            <label className="text-gray-300 text-sm">Change Password</label>
            <input
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(event) => {
                setPassword(event.target.value);
                setPasswordError("");
              }}
              placeholder="Enter your new password"
              type="password"
              value={password}
            />
            {passwordError && <p className="text-red-400 text-sm">{passwordError}</p>}
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => {
                if (password.length < 6) {
                  setPasswordError("Password must be at least 6 characters long");
                  return;
                }
                refreshUser({ password });
                setPassword("");
                setPasswordError("");
              }}
            >
              Change Password
            </Button>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-lg">
            <div className="mb-4">
              <h2 className="font-semibold text-xl">Movie Preferences</h2>
              <p className="text-gray-400 text-sm">Select genres you'd like to see.</p>
            </div>
            <div className="space-y-2">
              {movieGenres.map((genre) => (
                <Checkbox
                  checked={moviePreferences.has(genre.id)}
                  key={genre.id}
                  label={genre.name}
                  onChange={() => handleMoviePreferenceToggle(genre.id)}
                />
              ))}
            </div>
            {movieError && (
              <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-300 text-sm">{movieError}</div>
            )}
          </div>
          <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-lg">
            <div className="mb-4">
              <h2 className="font-semibold text-xl">TV Preferences</h2>
              <p className="text-gray-400 text-sm">Select genres you'd like to see.</p>
            </div>
            <div className="space-y-2">
              {tvGenres.map((genre) => (
                <Checkbox
                  checked={tvPreferences.has(genre.id)}
                  key={genre.id}
                  label={genre.name}
                  onChange={() => handleTvPreferenceToggle(genre.id)}
                />
              ))}
            </div>
            {tvError && (
              <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-300 text-sm">{tvError}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
