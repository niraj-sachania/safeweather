/**
 * Autocomplete API module for city name suggestions
 * Uses OpenWeatherMap Geocoding API via the existing proxy
 */

/**
 * Fetch city suggestions based on user input
 * @param {string} query - The search query
 * @returns {Promise<Array>} Array of city suggestions
 */
export async function fetchCitySuggestions(query) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      `https://strong-mermaid-23f3ab.netlify.app/.netlify/functions/getCoordinates?cityOrPostcode=${encodeURIComponent(
        query.trim()
      )}`
    );

    if (!response.ok) {
      console.warn("Autocomplete API request failed:", response.status);
      return [];
    }

    const data = await response.json();
    const coordinates = data.geoCoordinates;

    // Normalize response to always return an array
    if (Array.isArray(coordinates)) {
      // Filter and limit to top 5 suggestions
      return coordinates.slice(0, 5);
    } else if (coordinates && coordinates.lat && coordinates.lon) {
      return [coordinates];
    }

    return [];
  } catch (error) {
    console.error("Error fetching city suggestions:", error);
    return [];
  }
}

/**
 * Format a location suggestion for display
 * @param {Object} location - Location object with name, state, country, lat, lon
 * @returns {string} Formatted location string
 */
export function formatLocationSuggestion(location) {
  if (!location || !location.name) return "";

  const parts = [location.name];

  if (location.state) {
    parts.push(location.state);
  }

  if (location.country) {
    parts.push(`(${location.country})`);
  }

  return parts.join(", ");
}
