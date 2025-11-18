// Example JSON structure for weather data
//   "weatherData": {
//     "airPollution": [
//       {
//         "date": 1763467200,
//         "aqi": 2
//       },

//     ],
//     "current": {
//       "dt": 1763468575,
//       "sunrise": 1763470677,
//       "sunset": 1763505711,
//       "temp": 3.63,
//       "feels_like": -0.76,
//       "pressure": 1012,
//       "humidity": 92,
//       "dew_point": 2.45,
//       "uvi": 0,
//       "clouds": 100,
//       "visibility": 10000,
//       "wind_speed": 5.82,
//       "wind_deg": 97,
//       "wind_gust": 10.51,
//       "weather": [
//         {
//           "id": 804,
//           "main": "Clouds",
//           "description": "overcast clouds",
//           "icon": "04n"
//         }
//       ]
//     },


function getWeatherIcon(currentWeather) {
    // Map example
    //const weatherIconMap = new Map();

    // weatherIconMap.set("overcast clouds", "assets/icons/overcast.png");
    // weatherIconMap.set("sunny", "assets/icons/sunny.png");
    // weatherIconMap.set("snow", "assets/icons/cloudy.png");

    return WeatherIconMap.get(currentWeather);
}

(function updateWeatherIcon() {
    const weatherIcon = document.querySelector('#weather-icon');
    // Map of temperature + weather conditions to icon URLs
    // Logic that determines the correct icon based on temperature and conditions
    // What data we need from weatherData:
    // weatherData.current.weather[0].main
    // weatherData.current.weather[0].description
    
    let currentWeather = weatherData.current.weather[0].description;
    let Icon = getWeatherIcon(currentWeather);



})();


function getNext5Days() {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 5; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        days.push(date.toLocaleDateString([], { weekday: 'short' }));
    }
    
    return days;
}


(function Update5dayForecast() {
    // Create 5-day forecast cards

    // 5 Cards with days from today
    // For each forecast data object:
        // Day of the week (Mon, Tue, Wed, Thu, Fri, Sat, Sun) - getNext5Days();
        // Weatrher icon - getWeatherIcon(CurrentWeather);
        // Temperature - weatherData.current.temp
    
})();