import {updateAllReccomendations} from "./update-reccomendations.js";

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
  updateAllReccomendations(data);


})();

