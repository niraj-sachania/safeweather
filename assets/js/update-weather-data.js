import {getWeatherIcon} from "./utils/weather-icons.js";


export function updateWeatherIcon(data) {
  let weatherIcon = getWeatherIcon(data[0].weather[0]);
  const iconElement = document.getElementById("weather-icon-box");
  if (iconElement) {
    iconElement.innerHTML = weatherIcon;
  }
}