import {
  fetchCitySuggestions,
  formatLocationSuggestion,
} from "./autocomplete-api.js";

const btn = document.querySelector("#search-btn");
const input = document.querySelector("#city-postcode");

// Autocomplete state
let autocompleteSuggestions = [];
let selectedSuggestionIndex = -1;
let autocompleteDebounceTimer = null;

(function initialise() {
  // Focus the input for accessibility
  //   if (input) input.focus();

  // Allow pressing Enter in the input to trigger the search
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  });

  // Search by clicking button
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    handleSearch();
  });

  // Autocomplete input handler with debouncing
  input.addEventListener("input", (e) => {
    clearTimeout(autocompleteDebounceTimer);
    autocompleteDebounceTimer = setTimeout(() => {
      handleAutocomplete(e.target.value);
    }, 300);
  });

  // Keyboard navigation for autocomplete
  input.addEventListener("keydown", (e) => {
    if (!resultsContainer.classList.contains("open")) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        navigateSuggestions(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        navigateSuggestions(-1);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          selectSuggestion(autocompleteSuggestions[selectedSuggestionIndex]);
        } else {
          handleSearch();
        }
        break;
      case "Escape":
        e.preventDefault();
        clearAutocomplete();
        break;
    }
  });

  // Close autocomplete when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#search")) {
      clearAutocomplete();
    }
  });

  // Geo icon: get browser geolocation and load weather page for current position
  document.querySelector("i.bi-geo-alt").addEventListener("click", async () => {
    btn.disabled = true;
    showMessage("Detecting your location...");
    try {
      const pos = await new Promise((res, rej) =>
        navigator.geolocation
          ? navigator.geolocation.getCurrentPosition(res, rej, {
              enableHighAccuracy: true,
              timeout: 10000,
            })
          : rej(new Error("Geolocation not supported"))
      );
      loadWeatherPage(pos.coords.latitude, pos.coords.longitude);
    } catch (e) {
      console.error(e);
      showMessage(
        "Unable to detect location. Please allow location access or use the search."
      );
    } finally {
      btn.disabled = false;
    }
  });
})();

// Autocomplete functions

const handleAutocomplete = async (query) => {
  if (!query || query.trim().length < 2) {
    clearAutocomplete();
    return;
  }

  try {
    const suggestions = await fetchCitySuggestions(query);
    autocompleteSuggestions = suggestions;
    selectedSuggestionIndex = -1;
    renderAutocompleteSuggestions(suggestions);
  } catch (error) {
    console.error("Autocomplete error:", error);
    clearAutocomplete();
  }
};

const renderAutocompleteSuggestions = (suggestions) => {
  clearResults();

  if (!suggestions || suggestions.length === 0) {
    return;
  }

  const list = document.createElement("ul");
  list.className = "search-results-list autocomplete-list";
  list.setAttribute("role", "listbox");

  suggestions.forEach((location, index) => {
    const li = document.createElement("li");
    li.className = "search-results-item";
    li.setAttribute("role", "option");

    const button = document.createElement("button");
    button.type = "button";
    button.className = "search-result-btn autocomplete-item";
    button.textContent = formatLocationSuggestion(location);
    button.dataset.index = index;

    button.addEventListener("click", (e) => {
      e.preventDefault();
      selectSuggestion(location);
    });

    // Touch support - use touchend to avoid interfering with scrolling
    button.addEventListener("touchend", (e) => {
      e.preventDefault();
      selectSuggestion(location);
    });

    li.appendChild(button);
    list.appendChild(li);
  });

  resultsContainer.appendChild(list);
  resultsContainer.classList.add("open");
};

const navigateSuggestions = (direction) => {
  const maxIndex = autocompleteSuggestions.length - 1;
  selectedSuggestionIndex = Math.max(
    -1,
    Math.min(maxIndex, selectedSuggestionIndex + direction)
  );

  // Update visual selection
  const items = resultsContainer.querySelectorAll(".autocomplete-item");
  items.forEach((item, index) => {
    if (index === selectedSuggestionIndex) {
      item.classList.add("selected");
      item.setAttribute("aria-selected", "true");
    } else {
      item.classList.remove("selected");
      item.setAttribute("aria-selected", "false");
    }
  });
};

const selectSuggestion = (location) => {
  input.value = location.name;
  clearAutocomplete();
  loadWeatherPage(location.lat, location.lon);
};

const clearAutocomplete = () => {
  clearResults();
  autocompleteSuggestions = [];
  selectedSuggestionIndex = -1;
};

// Generic functions

const clearResults = () => {
  resultsContainer.innerHTML = "";
  resultsContainer.classList.remove("open");
};

const showMessage = (text) => {
  resultsContainer.textContent = text;
  resultsContainer.classList.add("open");
};

// Weather app functions

const getCityOrPostcode = () => {
  const queryString = window.location.search;
  const searchParams = new URLSearchParams(queryString);
  const cityOrPostcode = input.value || searchParams.get("cityOrPostcode");
  return cityOrPostcode;
};

const getCoordinates = async () => {
  const cityOrPostcode = getCityOrPostcode();

  try {
    const geoCoordinates = await fetch(
      `https://strong-mermaid-23f3ab.netlify.app/.netlify/functions/getCoordinates?cityOrPostcode=${cityOrPostcode}`
    );

    const coordinates = await geoCoordinates.json();

    return coordinates.geoCoordinates;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

const loadWeatherPage = (lat, lon) => {
  window.location.href = `./weather.html?lat=${encodeURIComponent(
    lat
  )}&lon=${encodeURIComponent(lon)}&cityOrPostcode=${encodeURIComponent(
    input.value
  )}`;
};

const handleSearch = async () => {
  btn.disabled = true;
  clearResults();
  try {
    const coordinates = await getCoordinates();

    // coordinates may be an array of places or a single object
    if (Array.isArray(coordinates)) {
      if (coordinates.length === 1) {
        const [only] = coordinates;
        loadWeatherPage(only.lat, only.lon);
        return;
      }

      // Multiple matches: render choices for user
      renderChoices(coordinates);
      return;
    }

    // If API returned a single object with lat/lon fields
    if (coords && coords.lat && coords.lon)
      return loadWeatherPage(coords.lat, coords.lon);
    showMessage("No locations found. Please try a different query.");
  } catch (err) {
    console.error("Lookup failed:", err);
    showMessage("Lookup failed. Please try again.");
  } finally {
    btn.disabled = false;
  }
};

const renderChoices = (items) => {
  clearResults();
  if (!items || items.length === 0) return;

  const list = document.createElement("ul");
  list.className = "search-results-list";

  items.forEach((location) => {
    const li = document.createElement("li");
    li.className = "search-results-item";

    const btn = document.createElement("button");
    btn.type = "button";
    // presentational + semantic classes styled via CSS in style.css
    btn.className = "search-result-btn btn btn-sm";

    const label = `${location.name}${
      location.state ? ", " + location.state : ""
    }${location.country ? " (" + location.country + ")" : ""}`;
    btn.textContent = label;

    btn.addEventListener("click", () => {
      loadWeatherPage(location.lat, location.lon);
    });

    li.appendChild(btn);
    list.appendChild(li);
  });

  resultsContainer.appendChild(list);
  resultsContainer.classList.add("open");
};

// Create a dropdown under the input to show multiple coordinate choices
let resultsContainer = document.getElementById("search-results");
const searchWrapper = document.querySelector("#search .d-flex");
if (!resultsContainer) {
  resultsContainer = document.createElement("div");
  resultsContainer.id = "search-results";
  resultsContainer.className = "search-results";
  // Append to the inline search wrapper so we can position absolute relative to it
  if (searchWrapper) {
    // ensure the container that will be used as positioning context is positioned
    searchWrapper.style.position = searchWrapper.style.position || "relative";
    searchWrapper.appendChild(resultsContainer);
  } else {
    const searchEl = document.getElementById("search");
    if (searchEl) searchEl.appendChild(resultsContainer);
  }
}
