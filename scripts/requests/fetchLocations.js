import { backendURL } from "../../config.js";

export const loadCities = async () => {
    const response = await fetch(backendURL + 'cities');

    return await response.json();
};

export const fetchCityDetails = async (cityId) => {
    const response = await fetch(backendURL + 'cities/' + cityId);

    return await response.json();
};

export const fetchBoroughDetails = async (cityId, boroughId) => {
    const response = await fetch(backendURL + 'cities/' + cityId + "/boroughs/" + boroughId);

    return await response.json();
};
