import { placeFilteredMarkers } from "./map.js";
import { fetchCityNames } from "./requests/fetchLocations.js";


const searchCityTextField = document.getElementById("search-city-text-field");
const deleteSearchButton = document.getElementById("delete-city-search-button");
const citySearchFilter = document.getElementById("city-search-filter");

const cityNames = await fetchCityNames();

const onSearchCityInput = () => {
    const searchFieldValue = searchCityTextField.value;

    removeAutocompleteContainerIfExists();

    if (searchFieldValue.length === 0) {
        placeFilteredMarkers();
        return;
    }

    const autocompleteSuggestionContainer = createAutocompleteSuggestionContainer();

    Object.entries(cityNames)
        .filter(([internalCityName, visibleCityName]) => checkIfSearchValueMatches(visibleCityName, searchFieldValue))
        .forEach(([internalCityName, visibleCityName]) => {
            const suggestion = createNewSuggestion(internalCityName, visibleCityName, searchFieldValue.length);

            autocompleteSuggestionContainer.appendChild(suggestion);
        })

    if (autocompleteSuggestionContainer.children.length === 0) {
        removeAutocompleteContainerIfExists();
        return;
    }

    searchCityTextField.classList.add("active");
}

const checkIfSearchValueMatches = (cityName, fieldValue) => {
    return cityName.substring(0, fieldValue.length).toUpperCase() === fieldValue.toUpperCase()
}

const createCityName = (city, strongUntil) => {
    const nameTag = document.createElement("span");

    const strongTag = document.createElement("strong");

    strongTag.innerText = city.substring(0, strongUntil);

    nameTag.appendChild(strongTag);
    nameTag.append(city.substring(strongUntil));

    return nameTag;
}

const createAutocompleteSuggestionContainer = () => {
    let autocompleteSuggestionContainer = document.createElement("div");

    autocompleteSuggestionContainer.classList.add("autocompleteSuggestions");
    autocompleteSuggestionContainer.id = "autocompleteSuggestions"

    citySearchFilter.appendChild(autocompleteSuggestionContainer);

    return autocompleteSuggestionContainer;
}

const createNewSuggestion = (internalCityName, visibleCityName, strongUntil) => {
    const suggestion = document.createElement("div");
    suggestion.classList.add("autocompleteSuggestion");

    const capitalizedCityName = visibleCityName.substring(0, 1).toUpperCase() + visibleCityName.substring(1);

    const strongCityName = createCityName(capitalizedCityName, strongUntil);
    suggestion.appendChild(strongCityName);

    suggestion.addEventListener("click", onSuggestionClick.bind(null, internalCityName, visibleCityName));

    return suggestion;
}

const setCitySearchTextFieldValue = (value) => {
    searchCityTextField.value = value;
}

const removeAutocompleteContainerIfExists = () => {
    const autocompleteContainer = document.getElementById("autocompleteSuggestions")

    if (autocompleteContainer) {
        autocompleteContainer.remove()
    }

    searchCityTextField.classList.remove("active");
}

const onSuggestionClick = (internalCityName, visibleCityName) => {
    placeFilteredMarkers(internalCityName);

    setCitySearchTextFieldValue(visibleCityName);

    removeAutocompleteContainerIfExists();
}

const onDeleteSearchButtonClick = (deleteSearchButton) => {
    deleteSearchButton.preventDefault();

    setCitySearchTextFieldValue("");

    removeAutocompleteContainerIfExists();

    placeFilteredMarkers();
}

const setInputListeners = () => {
    searchCityTextField.addEventListener("input", onSearchCityInput);
    deleteSearchButton.addEventListener("click", onDeleteSearchButtonClick);
}

setInputListeners()
