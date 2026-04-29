"use client";

import { useEffect, useState } from "react";
import { getWeatherByCity, getWeatherByCoords } from "../services/weather";

function WeatherWidget() {
  const [city, setCity] = useState("");
  const [savedCity, setSavedCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedCity = localStorage.getItem("weatherCity");

    if (storedCity) {
      setSavedCity(storedCity);
      fetchWeatherByCity(storedCity);
    } else {
      fetchWeatherByCity("Amritsar");
      setSavedCity("Amritsar");
      localStorage.setItem("weatherCity", "Amritsar");
    }
  }, []);

  const fetchWeatherByCity = async (selectedCity) => {
    try {
      setLoading(true);
      setError("");

      const data = await getWeatherByCity(selectedCity);
      setWeather(data);
    } catch (err) {
      console.error("Weather error:", err);
      setError("Weather data load hoyni");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCity = () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    localStorage.setItem("weatherCity", city);
    setSavedCity(city);
    fetchWeatherByCity(city);
    setCity("");
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation support kore na");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          setLoading(true);
          setError("");

          const { latitude, longitude } = position.coords;
          const data = await getWeatherByCoords(latitude, longitude);

          setWeather(data);
          setSavedCity(data.name || "Current Location");
          localStorage.setItem("weatherCity", data.name || "Current Location");
        } catch (err) {
          console.error("Location weather error:", err);
          setError("Current location weather load hoyni");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location permission den nai");
      }
    );
  };

  const handleChangeLocation = () => {
    localStorage.removeItem("weatherCity");
    setSavedCity("");
    setWeather(null);
    setCity("");
    setError("");
  };

  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/70 p-6 shadow-lg backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-cyan-300">Live Weather</p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            {savedCity || "Setup Weather"}
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Check temperature, condition, humidity, and wind
          </p>
        </div>

        {savedCity && weather && (
          <button
            className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-cyan-400/40 hover:text-white"
            onClick={handleChangeLocation}
          >
            Change
          </button>
        )}
      </div>

      {!savedCity && !weather ? (
        <div className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={handleSaveCity}
              className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Save Location
            </button>

            <button
              onClick={handleUseCurrentLocation}
              className="rounded-2xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-slate-800"
            >
              Use Current Location
            </button>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>
      ) : loading ? (
        <div className="mt-8 space-y-3">
          <div className="h-10 w-28 animate-pulse rounded-lg bg-slate-800" />
          <div className="h-4 w-40 animate-pulse rounded-lg bg-slate-800" />
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="h-20 animate-pulse rounded-2xl bg-slate-800" />
            <div className="h-20 animate-pulse rounded-2xl bg-slate-800" />
          </div>
        </div>
      ) : error ? (
        <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      ) : (
        weather && (
          <>
            <div className="mt-8">
              <div className="flex items-end gap-2">
                <h3 className="text-5xl font-bold tracking-tight text-white">
                  {Math.round(weather.main.temp)}°
                </h3>
                <span className="pb-2 text-sm text-slate-400">Celsius</span>
              </div>

              <p className="mt-3 text-sm text-slate-300">
                {weather.weather?.[0]?.main || "Weather unavailable"}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Humidity
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {weather.main.humidity}%
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Wind
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {weather.wind.speed}
                  <span className="ml-1 text-sm text-slate-400">m/s</span>
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-500/10 bg-cyan-500/5 p-4">
              <p className="text-sm text-slate-300">
                Stay updated with current weather before planning outdoor work.
              </p>
            </div>
          </>
        )
      )}
    </div>
  );
}

export default WeatherWidget;