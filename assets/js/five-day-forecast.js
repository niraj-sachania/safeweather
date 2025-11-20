import { getWeatherIcon } from "./utils/weather-icons.js";
import { isTodayCheck, formatDate } from "./utils/format-date.js";

export function createForecastSection(forecastData) {
  const forecastContainer = document.getElementById("forecast");

    function createCard(day) {
    const ICONS = getWeatherIcon();
    const card = document.createElement("div");
    card.className = "card";

    const main = day.weather[0].main.toLowerCase();
    const description = day.weather[0].description.toLowerCase();
    let icon;

    if (main === 'clouds') { 
        // Match description if available, fallback to ☁️
        icon = ICONS.clouds[description] || '☁️';
    } else if (main === 'rain') {
        // Match description if available, fallback to 🌧️
        icon = ICONS.rain[description] || '🌧️';
    } else {
        icon = ICONS[main] || '🌤️'; // fallback icon
    }

    const isToday = isTodayCheck(day.dt);
    const dayLabel = isToday ? "Today" : formatDate(day.dt);
    let avg = Math.round((day.temp.max + day.temp.min) / 2);

    card.innerHTML = `
        <h3>${dayLabel}</h3>
        <div class="icon" aria-label="${main}">${icon}</div>
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

    // Only take today + 4 days
    if (forecastData) {
        const fiveDayForecast = forecastData.slice(0, 5);
        renderForecast(fiveDayForecast);
    }
}