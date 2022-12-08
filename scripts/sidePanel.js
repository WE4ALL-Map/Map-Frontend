import { fetchCityDetails } from './requests/fetchLocations.js';

const sidePanel = document.getElementById("side-panel");

const loadingMessage = document.getElementById("panel-loading-message");

const panelHeader = document.getElementById("panel-header");
const panelTitleText = document.getElementById("panel-city-name");
const partnerInformationContainer = document.getElementById("partner-information-container");

const designerElement = document.getElementById("designer-row");
const manufacturerElement = document.getElementById("manufacturer-row");

const pillContainer = document.getElementById("pill-container");


export const showShidePanel = (cityId) => {
    sidePanel.classList.add("active");

    partnerInformationContainer.classList.add("no-display");
    panelHeader.classList.add("no-display");

    loadingMessage.classList.remove("no-display");
    
    getCityDetails(cityId).then(fillSidePanel);
};

export const hideSidePanel = () => {
    sidePanel.classList.remove("active");
};

const fillSidePanel = (viewModel) => {
    loadingMessage.classList.add("no-display");
    
    partnerInformationContainer.classList.remove("no-display");
    panelHeader.classList.remove("no-display");

    panelTitleText.innerHTML = viewModel.cityName;

    document.getElementById("partner-count").innerHTML = viewModel.partnerCount;
    if (viewModel.designerCount) {
        designerElement.classList.remove("no-display");
        document.getElementById("designer-count").innerHTML = viewModel.designerCount;

    } else {
        designerElement.classList.add("no-display");
    }

    if (viewModel.manufacturerCount) {
        manufacturerElement.classList.remove("no-display");
        document.getElementById("manufacturer-count").innerHTML = viewModel.manufacturerCount;

    } else {
        manufacturerElement.classList.add("no-display");
    }

    createPills(viewModel.services);
    createPills(viewModel.tags);
};

const getCityDetails = async (cityId) => {
    return fetchCityDetails(cityId).then(mapCityToViewModel);
};

const mapCityToViewModel = (city) => {
    const viewModel = {
        cityName: "",
        partnerCount: 0,
        designerCount: 0,
        manufacturerCount: 0,
        services: [],
        tags: []
    };

    viewModel.cityName = city.display_name;
    viewModel.partnerCount = city.partners.length;

    let dublicateServices = [];
    let dublicateTags = [];
    for (const partner of city.partners) {
        if (partner.designing) {
            viewModel.designerCount++;
        }
        if (partner.printing) {
            viewModel.manufacturerCount++;
        }

        dublicateServices = dublicateServices.concat(partner.services);
        dublicateTags = dublicateTags.concat(partner.tags);
    }

    viewModel.services = new Set(dublicateServices);
    viewModel.tags = new Set(dublicateTags);

    return viewModel;
};

const createPills = (services) => {
    pillContainer.innerHTML = "";
    for(const tag of services) {
        const pill = document.createElement("div");
        const pillText = document.createElement("span");

        pill.classList.add("pill");
        pillText.title = tag;
        pillText.innerHTML = tag;

        pill.appendChild(pillText);
        pillContainer.appendChild(pill)
    }
};
