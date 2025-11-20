export function getWeatherIcon(weather) {
    /**
     * Returns a weather icon based on the provided weather object.
     * @param {Object} weather - The weather object containing 'main' and 'description' properties.
     * @returns {string} - A string representing the weather icon.
    */

    const ICONS = {
        clear: '☀️',
        clouds: {
            'few clouds': '🌤️',
            'scattered clouds': '🌥️',
            'broken clouds': '☁️',
            'overcast clouds': '☁️'
        },
        drizzle: '🌦️',
        rain: {
            'light rain': '🌦️',
            'moderate rain': '🌧️',
            'heavy intensity rain': '🌧️'
        },
        thunderstorm: '⛈️',
        snow: '❄️',
        mist: '🌫️',
        smoke: '💨',
        sand: '💨',
        squall: '💨',
        haze: '🌫️',
        dust: '🌫️',
        fog: '🌫️',
        ash: '🌋',
        tornado: '🌪️'
    };

    // Extract main and description from the weather object
    const main = weather.main.toLowerCase();
    const description = weather.description.toLowerCase();

    // Return the icon based on the main and description
    if (main === 'clouds') {
        return ICONS.clouds[description] || '☁️';
    } else if (main === 'rain') {
        return ICONS.rain[description] || '🌧️';
    } else {
        return ICONS[main] || '🌤️'; // fallback icon
    }
}