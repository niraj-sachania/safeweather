const getWeatherData = async (lat, lon, apiKey) => {
  try {
    const weatherData = await fetch(
      `https://strong-mermaid-23f3ab.netlify.app/.netlify/functions/getWeatherData?lat=${lat}&lon=${lon}`
    );
    const data = await weatherData.json();
    console.log(data);

    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

const data = getWeatherData("50", "50");
