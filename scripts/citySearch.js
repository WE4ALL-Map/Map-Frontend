import { fetchCityNames } from "./requests/fetchLocations.js";
import { zoomOnCity } from './map.js';

const citySearch = document.getElementById("city-search");
const deleteSearchButton = document.getElementById("delete-city-search-button");
const citySearchFilter = document.getElementById("city-search-form");

const cityNames = await fetchCityNames();

const onCitySearchInput = () => {
    const searchFieldValue = citySearch.value;

    removeAutocompleteContainerIfExists();

    /*If the field is empty, no suggestions should be created*/
    if (searchFieldValue.length === 0) {
        return;
    }

    const autocompleteSuggestionContainer = createAutocompleteSuggestionContainer();

    createAutocompleteSuggestions(cityNames, searchFieldValue, autocompleteSuggestionContainer);

    if (autocompleteSuggestionContainer.children.length === 0) {
        return;
    }

    citySearch.classList.add("active");
};

const createAutocompleteSuggestions = (cityNames, searchFieldValue, suggestionContainer) => {
    Object.entries(cityNames)
        .filter(([_, visibleCityName]) => checkIfSearchValueMatches(visibleCityName, searchFieldValue))
        .forEach(([internalCityName, visibleCityName]) => {
            const suggestion = createNewSuggestion(internalCityName, visibleCityName, searchFieldValue.length);

            suggestionContainer.appendChild(suggestion);
        });
};

const checkIfSearchValueMatches = (cityName, fieldValue) => {
    return cityName.substring(0, fieldValue.length).toUpperCase() === fieldValue.toUpperCase();
};

const createCityName = (city, strongUntil) => {
    const nameTag = document.createElement("span");

    const strongTag = document.createElement("strong");

    strongTag.innerText = city.substring(0, strongUntil);

    nameTag.appendChild(strongTag);
    nameTag.append(city.substring(strongUntil));

    return nameTag;
};

const createAutocompleteSuggestionContainer = () => {
    let autocompleteSuggestionContainer = document.createElement("div");

    autocompleteSuggestionContainer.id = "autocompleteSuggestions";

    citySearchFilter.appendChild(autocompleteSuggestionContainer);

    return autocompleteSuggestionContainer;
};

const createNewSuggestion = (internalCityName, visibleCityName, strongUntil) => {
    const suggestion = document.createElement("div");
    suggestion.classList.add("autocompleteSuggestion");

    const capitalizedCityName = capitalizeCityName(visibleCityName);

    const strongCityName = createCityName(capitalizedCityName, strongUntil);
    suggestion.appendChild(strongCityName);

    suggestion.addEventListener("click", onSuggestionClicked.bind(null, internalCityName, visibleCityName));

    return suggestion;
};

const capitalizeCityName = (cityName) =>
    cityName.substring(0, 1).toUpperCase() + cityName.substring(1);

const removeAutocompleteContainerIfExists = () => {
    const autocompleteContainer = document.getElementById("autocompleteSuggestions");

    if (autocompleteContainer) {
        autocompleteContainer.remove();
    }

    /*
    The "active" class rounds the top left/right corners of the search field. This statement ensures that the
    field returns to normal when the suggestion list is removed.
     */
    citySearch.classList.remove("active");
};

const onSuggestionClicked = (internalCityName, visibleCityName) => {
    zoomOnCity(internalCityName);

    removeAutocompleteContainerIfExists();

    citySearch.value = visibleCityName;
};

const onDeleteButtonClicked = (deleteButton) => {
    deleteButton.preventDefault();

    removeAutocompleteContainerIfExists();

    citySearch.value = "";
};

const setInputListeners = () => {
    citySearch.addEventListener("input", onCitySearchInput);
    deleteSearchButton.addEventListener("click", onDeleteButtonClicked);
};

setInputListeners();
