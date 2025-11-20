import { updateAllRecs } from "./update-recomendations.js";
import { createForecastSection } from "./five-day-forecast.js";
import {
  updateRainCoverage,
  updateAirQualityIndex,
  updateUvIndex,
} from "./update-weather-data.js";

// Store the current weather data globally for map to access without re-fetching
let currentWeatherData = null;

// Export getWeatherData so it can be called by map with specific lat/lon
export const getWeatherData = async (lat, lon) => {
  // If lat/lon not provided, try query parameters
  if (!lat || !lon) {
    const queryString = window.location.search;
    const searchParams = new URLSearchParams(queryString);
    lat = searchParams.get("lat");
    lon = searchParams.get("lon");
  }

  try {
    const weatherData = await fetch(
      `https://strong-mermaid-23f3ab.netlify.app/.netlify/functions/getWeatherData?lat=${lat}&lon=${lon}`
    );

    const data = await weatherData.json();
    currentWeatherData = data;
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

// Export function to get current weather data without re-fetching
export const getCurrentWeatherData = () => currentWeatherData;

const populateElement = (label, divId, data) => {
  const element = document.getElementById(divId);
  if (!element) return;
  const content = `<span class="data-value">${data.current[divId]}</span>`;

  const htmlString = label
    ? `<span class="data-label">${label}</span> ${content}`
    : content;

  element.innerHTML = htmlString;
};

// Export function to render weather data (used when map fetches new location)
export function renderWeatherData(data) {
  if (!data) return;

  const dynamicElements = document.querySelectorAll("[data-label]");

  dynamicElements.forEach((element) => {
    const value = element.getAttribute("data-label");
    const key = element.id;
    populateElement(value, key, data);
  });

  console.log("Rendered weather data:", data);

  updateAllRecs(data);
  createForecastSection(data.forecast);
  updateRainCoverage(data.forecast[0].pop);
  updateAirQualityIndex(data.airPollution[0].aqi);
  updateUvIndex(data.current.uvi);
}

// Get weather data from our secure proxy server (initial load)
(async () => {
  const data = await getWeatherData();
  renderWeatherData(data);
})();
