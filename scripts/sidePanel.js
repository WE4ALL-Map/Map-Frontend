import { fetchCityDetails } from './requests/fetchLocations.js';

const sidePanel = document.getElementById("side-panel");

const panelTitle = document.getElementById("panel-city-title");
const partnerInformationContainer = document.getElementById("partner-information-container");

const designerContainer = document.getElementById("designer-container");
const manufacturerContainer = document.getElementById("manufacturer-container");

const loadingMessage = document.getElementById("panel-loading-message");

export const showShidePanel = (city) => {
    sidePanel.classList.add("active");

    partnerInformationContainer.classList.add("no-display");
    panelTitle.innerHTML = "";
    loadingMessage.classList.remove("no-display");
    
    fetchCityDetails(city).then(fillSidePanel);
}

export const hideSidePanel = () => {
    sidePanel.classList.remove("active");
}

const fillSidePanel = (city) => {
    loadingMessage.classList.add("no-display");
    partnerInformationContainer.classList.remove("no-display");

    panelTitle.innerHTML = city.fullName;

    document.getElementById("partner-count").innerHTML = city.designers + city.manufacturers;

    if (city.designers) {
        designerContainer.classList.remove("no-display");

        document.getElementById("designer-count").innerHTML = city.designers;

        const designerTags = document.getElementById("designer-details");

        createPills(designerTags, city.designerTags)
    } else {
        designerContainer.classList.add("no-display");
    }

    if (city.manufacturers) {
        manufacturerContainer.classList.remove("no-display");

        document.getElementById("manufacturer-count").innerHTML = city.manufacturers;

        const manufacturerTags = document.getElementById("manufacturer-details");
        createPills(manufacturerTags, city.manufacturerTags)
    } else {
        manufacturerContainer.classList.add("no-display");
    }
}

const createPills = (pillContainer, tags) => {
    pillContainer.innerHTML = "";
    for(const tag of tags) {
        const pill = document.createElement("div");
        const pillText = document.createElement("span");
        pill.classList.add("pill-container");
        pillText.title = tag;
        pillText.innerHTML = tag;
        pill.appendChild(pillText);
        pillContainer.appendChild(pill)
    }
}