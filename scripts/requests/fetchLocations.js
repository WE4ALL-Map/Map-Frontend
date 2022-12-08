import { backendURL } from "../../config.js";

export const loadCities = async () => {
    const response = await fetch(backendURL + 'cities');

    return await response.json();
};

export const fetchCityNames = async () => {
    const response = await fetch(backendURL + `cities/names`);

    return await response.json();
};

export const fetchCityDetails = async (city) => {
    // Needs real implementation once the Backend Endpoint has been created
    const berlin = { fullName: "Berlin", designers: 2, manufacturers: 1, designerTags: [ "Rapid Prototyping", "Produktentwicklung", "Design"], manufacturerTags: ["def", "123", "aldfkjg"] };
    const munich = { fullName: "München", designers: 0, manufacturers: 1, designerTags: ["Rapid Prototyping"], manufacturerTags: ["PLA" ,"ABS"] };
    const hamburg = { fullName: "Hamburg", designers: 3, manufacturers: 2, designerTags: ["Rapid Prototyping", "Produktentwicklung"], manufacturerTags: ["Metalldruck"] };
    return new Promise((resolve) => setTimeout(()=>resolve(city === "berlin" ? berlin : city === "hamburg" ? hamburg : munich), 0));
}