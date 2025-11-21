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

// Fetch list of countries and cities and return matches based on the user's query.
// Returns an array of { country, city, display } objects (city may be null)
// Note: The countriesnow.space API returns country and city names without coordinates.
// Coordinates are resolved separately using the geocodeLocation helper.
const getCoordinates = async () => {
  const cityOrPostcode = getCityOrPostcode();
  if (!cityOrPostcode) return null;

  try {
    const resp = await fetch("https://countriesnow.space/api/v0.1/countries");
    const json = await resp.json();
    if (!json || !json.data) return null;

    const q = cityOrPostcode.trim().toLowerCase();
    const matches = [];

    json.data.forEach(({ country, cities }) => {
      if (!country) return;

      // if the query matches the country name, add country + its cities (if any)
      if (country.toLowerCase().includes(q)) {
        if (Array.isArray(cities) && cities.length) {
          cities.forEach((city) =>
            matches.push({ country, city, display: `${city}, ${country}` })
          );
        } else {
          matches.push({ country, city: null, display: country });
        }
        return;
      }

      // otherwise check individual city names
      if (Array.isArray(cities)) {
        cities.forEach((city) => {
          if (city.toLowerCase().includes(q)) {
            matches.push({ country, city, display: `${city}, ${country}` });
          }
        });
      }
    });

    // Deduplicate on display label
    const deduped = Array.from(
      new Map(matches.map((m) => [m.display.toLowerCase(), m])).values()
    );

    return deduped;
  } catch (error) {
    console.error("Error fetching countries list:", error);
    throw error;
  }
};

// Lightweight geocoding using Nominatim (OpenStreetMap). Returns { lat, lon } or null.
// Note: Nominatim has usage terms/rate limits. For production use, consider a server-side
// geocode service or an API key-based provider.
const geocodeLocation = async (city, country) => {
  const q = city ? `${city}, ${country}` : country;
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
    q
  )}`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "SafeWeather/1.0 (https://github.com/niraj-sachania/safeweather)",
      },
    });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    }
    return null;
  } catch (err) {
    console.error("Geocode error:", err);
    return null;
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
    const items = await getCoordinates();

    if (!items || items.length === 0) {
      showMessage("No locations found. Please try a different query.");
      return;
    }

    // If exactly one match, attempt to geocode immediately and load weather page
    if (items.length === 1) {
      const only = items[0];
      const coords = await geocodeLocation(only.city, only.country);
      if (coords) {
        loadWeatherPage(coords.lat, coords.lon);
        return;
      } else {
        showMessage("Found location but couldn't resolve coordinates.");
        return;
      }
    }

    // Multiple matches: render choices for the user to pick
    renderChoices(items);
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

    const choiceBtn = document.createElement("button");
    choiceBtn.type = "button";
    choiceBtn.className = "search-result-btn btn btn-sm";
    choiceBtn.textContent = location.display;

    // When user chooses an item, geocode and navigate to weather page
    choiceBtn.addEventListener("click", async () => {
      // disable this button while resolving
      choiceBtn.disabled = true;
      showMessage("Resolving location...");
      try {
        const coords = await geocodeLocation(location.city, location.country);
        if (coords) {
          loadWeatherPage(coords.lat, coords.lon);
        } else {
          showMessage("Unable to resolve chosen location to coordinates.");
        }
      } catch (err) {
        console.error("Choice resolution failed:", err);
        showMessage("Failed to resolve location. Please try another.");
      } finally {
        choiceBtn.disabled = false;
      }
    });

    li.appendChild(choiceBtn);
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
