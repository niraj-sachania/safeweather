import { getWeatherIcon } from "./utils/weather-icons.js";
import { isTodayCheck, formatDate } from "./utils/format-date.js";

export function createForecastSection(forecastData) {
  const forecastContainer = document.getElementById("forecast");

  function createCard(day) {
    const card = document.createElement("div");
    card.className = "card";

    const weather = day.weather[0]; // OpenWeather API weather object
    const icon = getWeatherIcon(weather);
    card.title = day.summary.replace("today", "day");

    const isToday = isTodayCheck(day.dt);
    const dayLabel = isToday ? "Today" : formatDate(day.dt);
    let avg = Math.round((day.temp.max + day.temp.min) / 2);

    card.innerHTML = `
        <h3>${dayLabel}</h3>
        <div class="icon" aria-label="${weather.main.toLowerCase()}">${icon}</div>
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

  // Only take 5 days for small screens and 7 for larger screens
  let maxCards = window.innerWidth < 767 ? 5 : 7;
  const forecastLabel = document.getElementById("forecast-label");
  function updateMaxCards() {
    maxCards = window.innerWidth < 767 ? 5 : 7;
    const maxCardsText = maxCards === 5 ? "5-Day Forecast" : "7-Day Forecast";
    forecastLabel && (forecastLabel.innerText = maxCardsText);
    if (forecastData) {
      forecastContainer.innerHTML = "";
      const slicedForecast = forecastData.slice(0, maxCards);
      renderForecast(slicedForecast);
    }
  }

  updateMaxCards();
  window.addEventListener("resize", updateMaxCards);
}
