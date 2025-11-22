// Show/hide loading state using Bootstrap utility classes

export function showLoadingState() {
  const loadingState = document.getElementById("loading-state");
  const errorState = document.getElementById("error-state");
  const weatherContent = document.getElementById("weather-content");

  if (loadingState) loadingState.classList.remove("d-none");
  if (errorState) errorState.classList.add("d-none");
  if (weatherContent) weatherContent.classList.add("d-none");
}

export function showWeatherContent() {
  const loadingState = document.getElementById("loading-state");
  const errorState = document.getElementById("error-state");
  const weatherContent = document.getElementById("weather-content");
  const footer = document.getElementById("weather-footer");

  if (loadingState) loadingState.classList.add("d-none");
  if (errorState) errorState.classList.add("d-none");
  if (weatherContent) weatherContent.classList.remove("d-none");
  if (footer) footer.classList.remove("d-none");
}

export function showErrorState(errorMessage) {
  const loadingState = document.getElementById("loading-state");
  const errorState = document.getElementById("error-state");
  const weatherContent = document.getElementById("weather-content");
  const footer = document.getElementById("weather-footer");
  const errorMessageEl = document.getElementById("error-message");

  if (loadingState) loadingState.classList.add("d-none");
  if (errorState) errorState.classList.remove("d-none");
  if (weatherContent) weatherContent.classList.add("d-none");
  if (footer) footer.classList.remove("d-none");
  if (errorMessageEl && errorMessage) {
    errorMessageEl.textContent = errorMessage;
  }
}
