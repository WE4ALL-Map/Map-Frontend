import {placeFilteredMarkers} from "./map.js";
import {fetchCityNames} from "./requests/fetchLocations.js";


let search = document.getElementsByClassName("search-city-input")[0]
let searchButton = document.getElementsByClassName("search-button")[0]
let cities = await fetchCityNames()

const createCityName = (city, strongUntil) => {
    const nameTag = document.createElement('span');

    const strongTag = document.createElement('strong');

    strongTag.innerText = city.substring(0, strongUntil);

    nameTag.appendChild(strongTag);
    nameTag.append(city.substring(strongUntil));

    return nameTag;
}

search.addEventListener('input', function() {
        let val = this.value;
        let autocompleteSuggestions

        removeSuggestionList()

        document.getElementsByClassName("search-city-input")[0].classList.add("active")

        autocompleteSuggestions = document.createElement("div")
        autocompleteSuggestions.classList.add("autocompleteSuggestions")
        this.parentNode.parentNode.appendChild(autocompleteSuggestions)

        for (let city in cities) {
            if (cities[city].substring(0, val.length).toUpperCase() === val.toUpperCase()) {

                let suggestion = document.createElement("div");
                suggestion.classList.add("autocompleteSuggestion")

                const capitalizedCityName = cities[city].substring(0, 1).toUpperCase() + cities[city].substring(1);

                const strongCityName = createCityName(capitalizedCityName, val.length);
                suggestion.appendChild(strongCityName);

                const input = document.createElement('input');
                input.setAttribute('type', 'hidden');
                input.value = capitalizedCityName;

                suggestion.appendChild(input);

                suggestion.addEventListener("click", function () {
                    placeFilteredMarkers(city)
                    search.value = this.getElementsByTagName("input")[0].value;
                    removeSuggestionList()
                });
                autocompleteSuggestions.appendChild(suggestion);
            }
        }
        if(val.length === 0) {
            placeFilteredMarkers()
            removeSuggestionList()
        }
        else if(autocompleteSuggestions.children.length === 0) {
            removeSuggestionList()
        }
    }
)

const removeSuggestionList = () => {
    if(document.getElementsByClassName("autocompleteSuggestions").length > 0) {
        document.getElementsByClassName("autocompleteSuggestions")[0].remove()
    }
    document.getElementsByClassName("search-city-input")[0].classList.remove("active")
}

searchButton.addEventListener("click", () => {
    search.value = ""
    removeSuggestionList()
    placeFilteredMarkers()
})