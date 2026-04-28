export async function getWeatherByCity(city) {
  const API_KEY = "1a3cca7263e58d29409f0ec9e49314db";
  
  // City cleanup (spaces/special chars remove)
  const cleanCity = city.trim().replace(/[^a-zA-Z\s]/g, '');
  
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cleanCity}&appid=${API_KEY}&units=metric`
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || `Weather for "${city}" not found`);
  }

  return res.json();
}

export async function getWeatherByCoords(lat, lon) {
  const API_KEY = "1a3cca7263e58d29409f0ec9e49314db";
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );

  if (!res.ok) {
    throw new Error("Location weather not found");
  }

  return res.json();
}
