import { backendURL } from "../../config.js";

export const loadCities = async () => {
    const response = await fetch(backendURL + 'cities');

    return await response.json();
};

export const fetchCityNames = async () => {
    const response = await fetch(backendURL + `cities/names`);

    return await response.json();
};

export const fetchCityDetails = async (cityId) => {
    const response = await fetch(backendURL + 'cities/' + cityId);

    return await response.json();
}