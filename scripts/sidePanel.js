const sidePanel = document.getElementById("side-panel");

const loadingMessage = document.getElementById("panel-loading-message");

const panelHeader = document.getElementById("panel-header");
const panelTitleText = document.getElementById("panel-city-name");
const partnerInformationContainer = document.getElementById("partner-information-container");

const designerElement = document.getElementById("designer-row");
const manufacturerElement = document.getElementById("manufacturer-row");

const pillContainer = document.getElementById("pill-container");


export const showSidePanel =  (markerDetails) => {
    sidePanel.classList.add("active");

    partnerInformationContainer.classList.add("no-display");
    panelHeader.classList.add("no-display");

    loadingMessage.classList.remove("no-display");

    let viewModel = mapMarkerDetailsToViewModel(markerDetails);

    fillSidePanel(viewModel);
};

export const hideSidePanel = () => {
    sidePanel.classList.remove("active");
};

const fillSidePanel = (viewModel) => {
    loadingMessage.classList.add("no-display");
    
    partnerInformationContainer.classList.remove("no-display");
    panelHeader.classList.remove("no-display");

    panelTitleText.innerHTML = viewModel.markerName;

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


const mapMarkerDetailsToViewModel = (markerDetails) => {
    const viewModel = {
        markerName: "",
        partnerCount: 0,
        designerCount: 0,
        manufacturerCount: 0,
        services: [],
        tags: []
    };

    viewModel.markerName = markerDetails.display_name;
    viewModel.partnerCount = markerDetails.partners.length;

    let duplicateServices = [];
    let duplicateTags = [];
    for (const partner of markerDetails.partners) {
        if (partner.designing) {
            viewModel.designerCount++;
        }
        if (partner.printing) {
            viewModel.manufacturerCount++;
        }

        duplicateServices = duplicateServices.concat(partner.services);
        duplicateTags = duplicateTags.concat(partner.tags);
    }

    viewModel.services = new Set(duplicateServices);
    viewModel.tags = new Set(duplicateTags);

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
        pillContainer.appendChild(pill);
    }
};
