export function airQualitySanitiser(aqIndex) {
    if (aqIndex >= 1 && aqIndex <= 3) {
        return "Low";
    } else if (aqIndex >= 4 && aqIndex <= 6) {
        return "Moderate";
    } else if (aqIndex >= 7 && aqIndex <= 9) {
        return "High";
    } else if (aqIndex === 10) {
        return "Very High";
    } else if (aqIndex >= 11) {
        return "Extreme";
    } else {
        return "Invalid Index";
    }
}