const getWeatherData = async () => {
  // Get latitude and longitude query parameters
  const queryString = window.location.search;
  const searchParams = new URLSearchParams(queryString);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  try {
    const weatherData = await fetch(
      `https://strong-mermaid-23f3ab.netlify.app/.netlify/functions/getWeatherData?lat=${lat}&lon=${lon}`
    );

    const data = await weatherData.json();

    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

// Get weather data from our secure proxy server
(async () => {
  const data = await getWeatherData();

  console.log(data);
})();
