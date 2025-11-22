/**
 * Utility functions for handling URL query parameters
 */

/**
 * Get query parameters from current URL
 * @returns {Object} Object containing lat, lon, and cityOrPostcode
 */
export function getQueryParams() {
  const searchParams = new URLSearchParams(window.location.search);
  return {
    lat: searchParams.get("lat"),
    lon: searchParams.get("lon"),
    cityOrPostcode: searchParams.get("cityOrPostcode"),
  };
}

/**
 * Update URL query parameters without page reload
 * @param {Object} params - Object containing parameters to update
 * @param {string} params.lat - Latitude
 * @param {string} params.lon - Longitude
 * @param {string} params.cityOrPostcode - City or postcode name
 */
export function updateQueryParams({ lat, lon, cityOrPostcode }) {
  const url = new URL(window.location);

  if (lat !== undefined) {
    if (lat === null) {
      url.searchParams.delete("lat");
    } else {
      url.searchParams.set("lat", lat);
    }
  }

  if (lon !== undefined) {
    if (lon === null) {
      url.searchParams.delete("lon");
    } else {
      url.searchParams.set("lon", lon);
    }
  }

  if (cityOrPostcode !== undefined) {
    if (cityOrPostcode === null) {
      url.searchParams.delete("cityOrPostcode");
    } else {
      url.searchParams.set("cityOrPostcode", cityOrPostcode);
    }
  }

  window.history.pushState({}, "", url);
}
