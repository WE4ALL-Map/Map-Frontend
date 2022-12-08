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
    const berlin = { fullName: "Berlin", designers: 3, manufacturers: 5, designerTags: ["abc", "Test", "Rapid Prototyping", "Produktentwicklung", "Und wieder ein Viel zu langer Text, ich frage mich was damit passiert", "1", "1", "1", "1", "1", "1", "1", "1"], manufacturerTags: ["def", "123", "aldfkjg"] };
    const munich = { fullName: "München", designers: 0, manufacturers: 3, designerTags: ["asd", "gdf", "Rapid Prototyping", "1234", "hahahaha"], manufacturerTags: ["ghi", "456", "asdasdasd"] };
    return new Promise((resolve) => setTimeout(()=>resolve(city === "berlin" ? berlin : munich), 1000));
}