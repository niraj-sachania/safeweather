import {
  getWeatherData,
  getCurrentWeatherData,
  renderWeatherData,
} from "./weather-data.js";

import { airQualitySanitiser } from "./utils/conversion-sanatisers.js";
import { updateQueryParams } from "./utils/url-params.js";
import { updateLocationName } from "./update-location-data.js";

// Wait for initial weather data to load
const initMap = async () => {
  // Wait a bit for the weather-data module to complete initial fetch
  await new Promise((resolve) => setTimeout(resolve, 100));

  let data = getCurrentWeatherData();

  // If data not yet loaded, fetch it
  if (!data) {
    data = await getWeatherData();
  }

  const lat = data?.geolocation?.lat || 52.536190007425056;
  const lon = data?.geolocation?.lon || -2.0708189979933964;

  // Create map centered on current location
  const map = L.map("interactive-map").setView([lat, lon], 10);

  // Add OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Add initial marker
  let marker = L.marker([lat, lon]).addTo(map);

  // Create popup content
  const createPopupContent = (weatherData) => {
    const temp = weatherData?.current?.temp ?? "N/A";
    const desc =
      weatherData?.current?.weather?.[0]?.description ?? "No description";
    const aqi = weatherData?.airPollution?.[0]?.aqi ?? "N/A";

    return `
      <div style="color: #000; text-align: left;">
        <strong>Weather Info</strong><br>
        <strong>Temp:</strong> ${temp}°C<br>
        <strong>Conditions:</strong> ${desc}<br>
        <strong>Air Pollution:</strong> ${airQualitySanitiser(aqi)}
      </div>
    `;
  };

  marker.bindPopup(createPopupContent(data)).openPopup();

  // Handle map clicks - fetch weather for clicked location
  map.on("click", async (e) => {
    const clickedLat = e.latlng.lat;
    const clickedLon = e.latlng.lng;

    try {
      // Fetch weather data for clicked location
      const newData = await getWeatherData(clickedLat, clickedLon);

      // Update page with new weather data
      renderWeatherData(newData);

      // Remove old marker and add new one
      if (marker) {
        map.removeLayer(marker);
      }

      marker = L.marker([clickedLat, clickedLon]).addTo(map);
      marker.bindPopup(createPopupContent(newData)).openPopup();

      // Update URL with new coordinates (remove cityOrPostcode since we're using coords)
      updateQueryParams({
        lat: clickedLat,
        lon: clickedLon,
        cityOrPostcode: null,
      });

      // Update the location name display
      updateLocationName();
    } catch (error) {
      console.error("Error fetching weather for clicked location:", error);
      alert(
        "Failed to fetch weather data for this location. Please try again."
      );
    }
  });
};

// Initialize map when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMap);
} else {
  initMap();
}
