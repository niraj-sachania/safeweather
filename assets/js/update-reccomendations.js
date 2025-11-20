/**
 * Get a coat recommendation string based on temperature.
 * @param {number} temperature - Temperature in °C (expected). May be negative.
 * @returns {string} Human-readable coat recommendation (e.g. "Light Coat").
 */
function getCoatRec(temperature) {
    // Map for temperature and conditions
    // Sets the coat icon on the card
    // Return a coat emoji (string) so it can be inserted into the DOM
    // Keep the temperature parameter for future logic
    if (temperature < -10) {
        return "Arctic Coat";
    }
    else if (temperature < 0) {
        return "Ski Jacket";
    }
    else if (temperature < 5) {
        return "Heavy Coat";
    }
    else if (temperature < 10) {
        return "Light Coat";
    }
    else if (temperature < 15) {
        return "Thin Jacket";
    }
    else {
        return "No Coat Needed";
    }

}

/**
 * Insert the coat recommendation into the DOM.
 * @param {string} coatRec - HTML or text to insert into the `#coat` element.
 * @returns {void}
 */
function setCoatRec(coatRec) {
    const coatRecElement = document.getElementById("coat");
    // Insert any HTML or text provided by the caller
    if (coatRecElement) {
        coatRecElement.innerHTML = coatRec;
    }
}

/**
 * Decide whether an umbrella is recommended based on forecast values.
 * @param {number} rain - Expected rainfall in mm for the period (may be 0).
 * @param {number} pop - Probability of precipitation (0..1).
 * @returns {string} "Yes" if umbrella recommended, otherwise "No".
 */
function getUmbrellaRec(rain, pop) {
    const rainMM = rain || 0;
    const rainChancePercentage = pop || 0;

    const POP_THRESHOLD = 0.4;      // 40% coverage is on the border
    const RAIN_THRESHOLD = 0.5;     // sensible minimum rainfall

    // Return true if either condition suggests rain
    if (rainChancePercentage >= POP_THRESHOLD && rainMM >= RAIN_THRESHOLD) {
        return "Yes";
    }

    return "No";
}

/**
 * Insert umbrella recommendation into the DOM.
 * @param {string} umbrellaRec - HTML or text to insert into the `#umbrella` element.
 * @returns {void}
 */
function setUmbrellaRec(umbrellaRec) {
    const umbrellaRecElement = document.getElementById("umbrella");
    if (umbrellaRecElement) {
        umbrellaRecElement.innerHTML = umbrellaRec;
    }
}


/**
 * Produce a UV clothes recommendation based on UV index.
 * @param {number} uvi - UV index (may be fractional). Returns undefined for invalid input.
 * @returns {string|undefined} Recommendation text, or undefined if input invalid.
 */
function getUVClothesRec(uvi) {
    // Accept 0 and fractional values; return undefined only when missing/invalid.
    if (uvi == null || isNaN(uvi)) return undefined;

    const uvIndex = Math.floor(Number(uvi));
    let rec = "";

    if (uvIndex <= 2) {
        rec = "Wear Suncream";
    } else if (uvIndex <= 7) {
        rec = "Wear Protection";
    } else {
        rec = "Seek Shade";
    }

    return rec;
}


/**
 * Insert UV clothes recommendation into the DOM.
 * @param {string} uvClothesRec - HTML or text to insert into the `#sun` element.
 * @returns {void}
 */
function setUVClothesRec(uvClothesRec) {
    const uvClothesRecElement = document.getElementById("sun");
    if (uvClothesRecElement) {
        uvClothesRecElement.innerHTML = uvClothesRec;
    }
}


/**
 * Map air pollution index to a recommendation string.
 * Accepts OpenWeather-style AQI (1..5) or 0.0..4.0 category values.
 * @param {number} pollutionIndex - Pollution index (AQI or category).
 * @returns {string|undefined} Recommendation text, or undefined for invalid input.
 */
function getMaskRec(pollutionIndex) {
    // Return a recommendation string based on pollution index.
    // Supports inputs like 0.0-4.0 (zero-based categories) or 1-5 (OpenWeather AQI).
    if (pollutionIndex == null || isNaN(pollutionIndex)) return undefined;

    const maskMap = new Map([
        [0, "Yes"],
        [1, "Yes"],
        [2, "Take caution"],
        [3, "Avoid extended outdoor time"],
        [4, "Close Windows"],
        [5, "Use an air filter"]
    ]);

    let val = Number(pollutionIndex);

    // If the API returns 1-5 (OpenWeather AQI), convert to 0-4 index
    if (val >= 1 && val <= 5 && Number.isInteger(val)) {
        val = val - 1;
    } else {
        // For fractional values (e.g. 0.0, 2.3) use floor to pick the bucket
        val = Math.floor(val);
    }

    // Clamp to valid keys
    val = Math.max(0, Math.min(4, val));

    const rec = maskMap.get(val);

    return rec;

}

/**
 * Insert air quality/mask recommendation into the DOM.
 * @param {string} maskRec - HTML or text to insert into the `#air` element.
 * @returns {void}
 */
function setMaskRec(maskRec) {
    const airQualityRecElement = document.getElementById("air");
    if (airQualityRecElement) {
        airQualityRecElement.innerHTML = maskRec;
    }
}


/**
 * Update all recommendation DOM elements from a weather data object.
 * @param {object} data - Weather API data (expected to include `current`, `forecast`, `airPollution`).
 * @returns {void}
 */
export function updateAllRecs(data) {

    const coatRec = getCoatRec(data.current.feels_like);
    coatRec && setCoatRec(coatRec);

    const umbrellaRec = getUmbrellaRec(data.forecast[0].rain, data.forecast[0].pop);
    umbrellaRec && setUmbrellaRec(umbrellaRec);

    const uvClothesRec = getUVClothesRec(data.current.uvi);
    uvClothesRec && setUVClothesRec(uvClothesRec);

    const maskRec = getMaskRec(data.airPollution[0].aqi);
    maskRec && setMaskRec(maskRec);

}
