import {updateAllRecs} from "./update-reccomendations.js";

//  Generic functions
function formatDate(unix) {
        const date = new Date(unix * 1000);
        console.log('Formatted date:', date);
        return date.toLocaleDateString('en-GB', { weekday: 'short' });
      }

      function isTodayCheck(date)
      {
       return new Date(date * 1000).toDateString() === new Date().toDateString();
      }

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

const populateElement = (label, divId, data) => {
  const element = document.getElementById(divId);
  const content = `<span class="data-value">${data.current[divId]}</span>`;

  const htmlString = label
    ? `<span class="data-label">${label}</span> ${content}`
    : content;

  element.innerHTML = htmlString;
};


function createForecastSection(forecastData) {

        const forecastContainer = document.getElementById('forecast');

      const ICONS = {
        'clear sky': '☀️',
        'light rain': '🌧️',
        'overcast clouds': '☁️',
        'broken clouds': '⛅',
        'partly cloudy': '⛅',
        'rain': '🌧️',
        'clouds': '☁️'
      };


      
      function createCard(day) {
        const card = document.createElement('div');
      
        card.className = 'card';

        const condition = day.weather[0].description;
        const icon = ICONS[condition.toLowerCase()] || '🌤️';

        const isToday = isTodayCheck(day.dt);
        const dayLabel = isToday ? 'Today' : formatDate(day.dt);
         let avg=Math.round((day.temp.max + day.temp.min) / 2);
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
        forecastContainer.innerHTML = '';
        data.forEach(day => createCard(day));
        
      }

      // Only take today + 5 days
      if (forecastData) {
        const fiveDayForecast = forecastData.slice(0, 6);
        renderForecast(fiveDayForecast);
      }
}


// Get weather data from our secure proxy server
(async () => {
  const data = await getWeatherData();

  const dynamicElements = document.querySelectorAll("[data-label]");

  dynamicElements.forEach((element) => {
    const value = element.getAttribute("data-label");
    const key = element.id;
    populateElement(value, key, data);
  });

  console.log(data);
  updateAllRecs(data);

})();

