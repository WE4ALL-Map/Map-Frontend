import { fetchCityDetails } from './requests/fetchLocations.js';
import { resetActiveMarker } from './map.js';

const sidePanel = document.getElementById("side-panel");

export const showShidePanel = (city) => {
    sidePanel.classList.add("active");
    sidePanel.focus();

    fetchCityDetails(city).then(fillSidePanel)
}

export const hideSidePanel = () => {
    sidePanel.classList.remove("active");
}

const fillSidePanel = (city) => {
    document.getElementById("panel-city-title").innerHTML = city.fullName;

    document.getElementById("partner-count").innerHTML = city.designers + city.manufacturers;

    if (city.designers) {
        document.getElementById("designer-container").classList.remove("invisible");

        document.getElementById("designer-count").innerHTML = city.designers;

        const designerTags = document.getElementById("designer-details");

        createPills(designerTags, city.designerTags)
    } else {
        document.getElementById("designer-container").classList.add("invisible");
    }

    if (city.manufacturers) {
        document.getElementById("manufacturer-container").classList.remove("invisible");

        document.getElementById("manufacturer-count").innerHTML = city.manufacturers;

        const manufacturerTags = document.getElementById("manufacturer-details");
        createPills(manufacturerTags, city.manufacturerTags)
    } else {
        document.getElementById("manufacturer-container").classList.add("invisible");
    }
}

const createPills = (pillContainer, tags) => {
    pillContainer.innerHTML = "";
    for(const tag of tags) {
        const pill = document.createElement("div")
        pill.classList.add("pill");
        pill.title = tag;
        pill.innerHTML = tag;
        pillContainer.appendChild(pill)
    }
}