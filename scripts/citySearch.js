import { loadCities } from "./requests/fetchLocations.js";
import { zoomOnCity } from './map.js';

const citySearch = document.getElementById("city-search");
const deleteSearchButton = document.getElementById("delete-city-search-button");
const citySearchFilter = document.getElementById("city-search-form");

const mapCitiesToCityNames = (cities) => {
    const cityNames = {};
    for (const city of cities) {
        cityNames[city.id] = city.display_name;
    }
    return cityNames;
}

const cityNames = await loadCities().then(mapCitiesToCityNames);


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
        .forEach(([cityId, visibleCityName]) => {
            const suggestion = createNewSuggestion(cityId, visibleCityName, searchFieldValue.length);

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
    autocompleteSuggestionContainer.dataset.currentlyFocusedElement = -1;

    citySearchFilter.appendChild(autocompleteSuggestionContainer);

    return autocompleteSuggestionContainer;
};

const createNewSuggestion = (cityId, visibleCityName, strongUntil) => {
    const suggestion = document.createElement("div");
    suggestion.classList.add("autocompleteSuggestion");

    const capitalizedCityName = capitalizeCityName(visibleCityName);

    const strongCityName = createCityName(capitalizedCityName, strongUntil);
    suggestion.appendChild(strongCityName);

    suggestion.addEventListener("click", onSuggestionClicked.bind(null, cityId, visibleCityName));

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

const onSuggestionClicked = (cityId, visibleCityName) => {
    zoomOnCity(cityId);

    removeAutocompleteContainerIfExists();

    citySearch.value = visibleCityName;
};

const onDeleteButtonClicked = (deleteButton) => {
    deleteButton.preventDefault();

    removeAutocompleteContainerIfExists();

    citySearch.value = "";
};

const ARROW_UP = 38;
const ARROW_DOWN = 40;
const ENTER = 13;

const onKeyPressed = (event) => {
    const suggestionContainer = document.getElementById("autocompleteSuggestions");

    if (!suggestionContainer) {
        return;
    }

    switch (event.keyCode) {
        case ARROW_UP:
            onArrowUpPressed(event, suggestionContainer);
            break;
        case ARROW_DOWN:
            onArrowDownPressed(event, suggestionContainer);
            break;
        case ENTER:
            onEnterPressed(event, suggestionContainer);
            break;
    }
};

const clamp = (n, min, max) =>
    Math.min(Math.max(n, min), max);

const focusSelection = (container, offset) => {
    const dataset = container.dataset;
    const suggestions = container.getElementsByClassName("autocompleteSuggestion");

    const topMostSuggestionIndex = 0;
    const bottomMostSuggestionIndex = suggestions.length - 1;
    const newFocusIndex = parseInt(dataset.currentlyFocusedElement) + offset;

    // noinspection JSValidateTypes
    dataset.currentlyFocusedElement = clamp(newFocusIndex, topMostSuggestionIndex, bottomMostSuggestionIndex);

    const suggestionToFocus = suggestions[dataset.currentlyFocusedElement];
    unfocusAllSuggestions(suggestions);
    suggestionToFocus.classList.add("focused");
};

const onArrowUpPressed = (event, suggestionContainer) => {
    event.preventDefault();

    focusSelection(suggestionContainer, -1);
};

const onArrowDownPressed = (event, suggestionContainer) => {
    event.preventDefault();

    focusSelection(suggestionContainer, 1);
};

const onEnterPressed = (event, suggestionContainer) => {
    event.preventDefault();

    const suggestionList = suggestionContainer.getElementsByClassName("autocompleteSuggestion");

    const suggestion = suggestionList[suggestionContainer.dataset.currentlyFocusedElement];

    suggestion.click();
};

const unfocusAllSuggestions = (suggestionList) => {
    for (const suggestion of suggestionList) {
        suggestion.classList.remove("focused");
    }
};

const setInputListeners = () => {
    citySearch.addEventListener("input", onCitySearchInput);
    citySearch.addEventListener("keydown", onKeyPressed);

    deleteSearchButton.addEventListener("click", onDeleteButtonClicked);
};

setInputListeners();
