import { getQueryParams } from "./utils/url-params.js";

export function updateLocationName() {
  const { cityOrPostcode, lat, lon } = getQueryParams();

  const locationElement = document.getElementById("location-name");
  if (!locationElement) return;

  if (cityOrPostcode) {
    const hasNumbers = /\d/.test(cityOrPostcode);
    if (hasNumbers) {
      locationElement.textContent = cityOrPostcode.toUpperCase();
    } else {
      locationElement.textContent = cityOrPostcode
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
  } else if (lat && lon) {
    locationElement.textContent = `${parseFloat(lat).toFixed(4)}, ${parseFloat(
      lon
    ).toFixed(4)}`;
  } else {
    locationElement.textContent = "Unknown Location";
  }
}

function updateCurrentTime() {
  // Get current time from geocoding API
  // Update current time card
}
