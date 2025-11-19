function getCoatRecommendation(temperature) {
    // Map for temperature and conditions
    // Sets the coat icon on the card
}

function setCoatIcon(iconPath) {
    /**
    // @param {string} iconPath - The path to the coat icon.
    **/
    const coatIconElement = document.getElementById("coat-icon");
    coatIconElement.src = iconPath;
}

function getUmbrellaRecommendation(weatherConditions) {

}

function setUmbrellaIcon(iconPath) {
    /**
    // @param {string} iconPath - The path to the umbrella icon.
    **/
    
    const umbrellaIconElement = document.getElementById("umbrella-icon");
    umbrellaIconElement.src = iconPath;
}

function getSunglassesRecommendation(uvi, weatherConditions) {


}

function setSunglassesIcon(iconPath) {
    /**
    // @param {string} iconPath - The path to the sunglasses icon.
    **/
    const sunglassesIconElement = document.getElementById("sunglasses-icon");
    sunglassesIconElement.src = iconPath;
}

function getUVClothesRecommendation(uvi) {
    /**
    // @param {number} uvi - The UV index value.
    **/

    // Accept 0 and fractional values; return undefined only when missing/invalid.
    if (uvi == null || isNaN(uvi)) return undefined;

    const uvIndex = Math.floor(Number(uvi));
    let iconPath = "";

    if (uvIndex <= 2) {
        iconPath = "assets/icons/towel.svg";
    } else if (uvIndex <= 5) {
        iconPath = "assets/icons/vest.svg";
    } else if (uvIndex <= 7) {
        iconPath = "assets/icons/tshirt.svg";
    } else if (uvIndex <= 10) {
        iconPath = "assets/icons/straw-hat.svg";
    } else {
        iconPath = "assets/icons/Longsleeve.svg";
    }
    console.log("getUVClothesRecommendation:", uvi, "->", iconPath);
    return iconPath;
}


function setUVClothesIcon(iconPath) {
    /**
    // @param {string} iconPath - The path to the UV clothes icon.
    **/
  const uvClothesIconElement = document.getElementById("uv-clothes-icon");
  uvClothesIconElement.src = iconPath;
}


export function updateAllReccomendations(data) {
    /**
    // @param {object} data - The weatherAPI data object.
    **/
    
    const uvClothesIcon = getUVClothesRecommendation(data.current.uvi);
    // if uvClothesIcon is not undefined, set the icon
    uvClothesIcon && setUVClothesIcon(uvClothesIcon);

    const sunglassesIcon = getSunglassesRecommendation();
    sunglassesIcon && setSunglassesIcon(sunglassesIcon);

    const umbrellaIcon = getUmbrellaRecommendation();
    umbrellaIcon && setUmbrellaIcon(umbrellaIcon);

    const coatIcon = getCoatRecommendation();
    coatIcon && setCoatIcon(coatIcon);
}

// Reorder functions to match the real icons
// Switch function to use pollution level instead of sunglasses?
// Set up function logic to use multiple parameters
// Get icons for each thing and add to folder