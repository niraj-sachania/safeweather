import { updateAllRecs } from "./update-reccomendations.js";

// Store the current weather data globally for map to access without re-fetching
let currentWeatherData = null;

//  Generic functions
function formatDate(unix) {
  const date = new Date(unix * 1000);
  console.log("Formatted date:", date);
  return date.toLocaleDateString("en-GB", { weekday: "short" });
}

function isTodayCheck(date) {
  return new Date(date * 1000).toDateString() === new Date().toDateString();
}

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

function createForecastSection(forecastData) {
  const forecastContainer = document.getElementById("forecast");

  const ICONS = {
    "clear sky": "☀️",
    "light rain": "🌧️",
    "overcast clouds": "☁️",
    "broken clouds": "⛅",
    "partly cloudy": "⛅",
    rain: "🌧️",
    clouds: "☁️",
  };

  function createCard(day) {
    const card = document.createElement("div");

    card.className = "card";

    const condition = day.weather[0].description;
    const icon = ICONS[condition.toLowerCase()] || "🌤️";

    const isToday = isTodayCheck(day.dt);
    const dayLabel = isToday ? "Today" : formatDate(day.dt);
    let avg = Math.round((day.temp.max + day.temp.min) / 2);
    card.innerHTML = `
          <h3>${dayLabel}</h3>
          <div class="icon" aria-label="${condition}">${icon}</div>
          <div class="temps">
              <span class="high">${avg}°C</span>
          </div>
        `;
    forecastContainer.appendChild(card);
  }

  function renderForecast(data) {
    forecastContainer.innerHTML = "";
    data.forEach((day) => createCard(day));
  }

  // Only take today + 5 days
  if (forecastData) {
    const fiveDayForecast = forecastData.slice(0, 6);
    renderForecast(fiveDayForecast);
  }
}

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

  createForecastSection(data.forecast);
  updateAllRecs(data);
}

// Get weather data from our secure proxy server (initial load)
(async () => {
  const data = await getWeatherData();
  renderWeatherData(data);
})();
