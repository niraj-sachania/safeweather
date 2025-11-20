const btn = document.querySelector("#search-btn");
const input = document.querySelector("#city-postcode");

(function initiliase() {
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

// Generic functions

const clearResults = () => {
  resultsContainer.innerHTML = "";
  resultsContainer.style.display = "none";
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
    if (coordinates && coordinates.lat && coordinates.lon) {
      const lat = coordinates.lat;
      const lon = coordinates.lon;
      loadWeatherPage(lat, lon);
      return;
    }

    // Otherwise, show a helpful message
    resultsContainer.textContent =
      "No locations found. Please try a different query.";
  } catch (err) {
    console.error("Lookup failed:", err);
    resultsContainer.textContent = "Lookup failed. Please try again.";
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
  resultsContainer.style.display = "block";
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
