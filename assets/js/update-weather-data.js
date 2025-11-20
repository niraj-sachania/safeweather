function airQualitySanitiser() {
  return null;
}

export const updateAirQualityName = (aqi) =>
  (document.querySelector("#aqi").innerHTML = airQualitySanitiser(aqi));

export const updateUvIndex = (uvi) =>
  (document.querySelector("#uvi").innerHTML = uvi);

export const updateRainCoverage = (propOfPercipitation) =>
  (document.querySelector(".rain-coverage-value").innerHTML =
    propOfPercipitation * 100);
