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
          setSavedCity(data.name);
          localStorage.setItem("weatherCity", data.name);
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

  if (!savedCity && !weather) {
    return (
      <div className="weather-card">
        <h3>Setup Weather</h3>
        <p>Enter your city to see local weather.</p>

        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="weather-input"
        />

        <div className="weather-actions">
          <button onClick={handleSaveCity} className="weather-btn">
            Save Location
          </button>

          <button onClick={handleUseCurrentLocation} className="weather-btn secondary">
            Use Current Location
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}
      </div>
    );
  }

  if (loading) {
    return <div className="weather-card">Loading weather...</div>;
  }

  if (error) {
    return <div className="weather-card error-text">{error}</div>;
  }

  return (
    <div className="weather-card">
      <div className="weather-header">
        <h3>{savedCity} Weather</h3>
        <button
          className="change-location-btn"
          onClick={() => {
            localStorage.removeItem("weatherCity");
            setSavedCity("");
            setWeather(null);
            setCity("");
          }}
        >
          Change
        </button>
      </div>

      <h1>{weather.main.temp}°C</h1>
      <p>{weather.weather[0].main}</p>
      <p>Humidity: {weather.main.humidity}%</p>
      <p>Wind Speed: {weather.wind.speed} m/s</p>
    </div>
  );
}

export default WeatherWidget;