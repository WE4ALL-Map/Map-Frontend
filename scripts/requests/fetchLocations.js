import {backendURL} from "../../config.js";

export const loadCities = async () => {
    const response = await fetch(backendURL + 'cities');

    return await response.json();
};

export const loadFilteredCities = async (cityName) => {
    const response = await fetch(backendURL + `cities/filtered?cityName=${cityName.toUpperCase()}`);

    return await response.json();
};

export const fetchCityNames = async () => {
    const response = await fetch(backendURL + `cities/names`);

    return await response.json();
};