// Show/hide loading state using Bootstrap utility classes

export function showLoadingState() {
  const loadingState = document.getElementById("loading-state");
  const errorState = document.getElementById("error-state");
  const weatherContent = document.getElementById("weather-content");

  loadingState && loadingState.classList.remove("d-none");
  errorState && errorState.classList.add("d-none");
  weatherContent && weatherContent.classList.add("d-none");
}

export function showWeatherContent() {
  const loadingState = document.getElementById("loading-state");
  const errorState = document.getElementById("error-state");
  const weatherContent = document.getElementById("weather-content");
  const footer = document.getElementById("weather-footer");

  loadingState && loadingState.classList.add("d-none");
  errorState && errorState.classList.add("d-none");
  weatherContent && weatherContent.classList.remove("d-none");
  footer && footer.classList.remove("d-none");
}

export function showErrorState(errorMessage) {
  const loadingState = document.getElementById("loading-state");
  const errorState = document.getElementById("error-state");
  const weatherContent = document.getElementById("weather-content");
  const footer = document.getElementById("weather-footer");
  const errorMessageEl = document.getElementById("error-message");

  loadingState && loadingState.classList.add("d-none");
  errorState && errorState.classList.remove("d-none");
  weatherContent && weatherContent.classList.add("d-none");
  footer && footer.classList.remove("d-none");
  errorMessageEl && errorMessage && (errorMessageEl.textContent = errorMessage);
}
