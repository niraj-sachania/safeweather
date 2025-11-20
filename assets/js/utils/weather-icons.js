export function getWeatherIcon()
{
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
        // add more rain descriptions if needed
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
    return ICONS;

}