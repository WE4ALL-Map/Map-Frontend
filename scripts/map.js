import {fetchBoroughDetails, fetchCityDetails, loadCities} from "./requests/fetchLocations.js";
import {hideSidePanel, showSidePanel} from "./sidePanel.js";

const mapOptions = {
    center: [51.330, 10.453],
    zoom: 6,
    minZoom: 6,
    maxZoom: 12,
    maxBounds: [
        [55.459583, -2.391338],
        [45.296025, 22.065829]
    ],
    zoomControl: false,
};

const defaultIconOptions = {
    className: "numbered-pin",
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -40],
};

const defaultMarkerOptions = {
    draggable: false,
};

const map = L.map("map", mapOptions);

let initialMarkerDetails = [];

let updatedMarkerDetails = [];

let markers = [];

let currentlyVisibleMarkerType = "city";

let activeMarker;

const setActiveMarker = (markerId) => {
    if(activeMarker) {
        resetActiveMarker();
    }

    let details = updatedMarkerDetails.find(details => details.id === markerId);

    showSidePanel(details);

    const activePin = markers.find(obj => obj.id === markerId).marker;
    const icon = activePin.getIcon();

    const iconOptions = { ...icon.options, className: "numbered-pin active"};
    
    const newIcon = L.divIcon(iconOptions);

    activePin.setIcon(newIcon);

    activeMarker = activePin;
};

export const resetActiveMarker = () => {
    if (activeMarker) {
        hideSidePanel();
        
        const icon = activeMarker.getIcon();
        
        const iconOptions = { ...icon.options, className: "numbered-pin"};
        
        const newIcon = L.divIcon(iconOptions);
        
        activeMarker.setIcon(newIcon);

        activeMarker = undefined;
    }
};

export const zoomOnMarker = (markerId) => {
    const searchedMarker = markers.find(marker => marker.id === markerId).marker;

    setActiveMarker(markerId);

    map.flyTo(searchedMarker.getLatLng(), mapOptions.maxZoom);
};

const initializeMapAndMarkers = async (cities) => {
    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 12,
        attribution: "© OpenStreetMap",
    }).addTo(map);

    for (const city of cities) {
        const cityDetails = await fetchCityDetails(city.id);

        createMarker(cityDetails.partners.length, cityDetails.center, cityDetails.id, true, "city");

        for(const borough of cityDetails.boroughs) {
            const boroughDetails = await fetchBoroughDetails(city.id, borough.id);

            createMarker(boroughDetails.partners.length, boroughDetails.center, boroughDetails.id, false, "borough");

            initialMarkerDetails.push(boroughDetails);
        }

        initialMarkerDetails.push(cityDetails);
    }
    updatedMarkerDetails = JSON.parse(JSON.stringify(initialMarkerDetails));

    updateMarkerVisibility();
};

const createMarker = (partnerCount, position, id, shouldBeVisible, markerType) => {
    const markerOptions = createNumberedMarkerOptions(partnerCount);

    const marker = L.marker([position.lat, position.long], markerOptions);

    marker.on("click", zoomOnMarker.bind(null, id));

    markers.push({
        "id": id,
        "visible": shouldBeVisible,
        "markerType": markerType,
        "marker": marker,
    });
};

const createNumberedMarkerOptions = (partnerCount) => {
    const numberedPin = L.divIcon({
        ...defaultIconOptions,
        html: `<span class="pin-number">${partnerCount}</span>`,
    });

    return {
        defaultMarkerOptions,
        icon: numberedPin,
    };
};

const onMapZoomed = () => {
    let zoomLevel = map.getZoom();

    if (zoomLevel >= 11 && currentlyVisibleMarkerType === "city") {
        currentlyVisibleMarkerType = "borough";
        markers.forEach(marker => marker.visible = marker.markerType === "borough");
    }
    else if (zoomLevel <= 10 && currentlyVisibleMarkerType === "borough") {
        currentlyVisibleMarkerType = "city";
        markers.forEach(marker => marker.visible = marker.markerType === "city");
    }

    updateMarkerVisibility();
};

const updateMarkerVisibility = () => {
    markers.forEach((marker) => {
        let details = updatedMarkerDetails.find(details => marker.id === details.id);

        marker.visible && details.partners.length ? marker.marker.addTo(map) : marker.marker.remove();
    });
};

const updateMarkerIcons = () => {
    updatedMarkerDetails.forEach((details) => {
        const marker = markers.find(marker => marker.id === details.id).marker;

        const icon = marker.getIcon();

        icon.options.html = `<span class="pin-number">${details.partners.length}</span>`;

        marker.setIcon(icon);
    });
};

export const setMarkerTypeAsVisible = (type) => {
    updatedMarkerDetails = JSON.parse(JSON.stringify(initialMarkerDetails));

    switch (type) {
        case "designer": {
            updatedMarkerDetails.forEach(details => {
                details.partners = details.partners.filter(partner => partner.designing);
            });
            break;
        }
        case "manufacturer": {
            updatedMarkerDetails.forEach(details => {
                details.partners = details.partners.filter(partner => partner.printing);
            });
        }
    }
    updateMarkerVisibility();

    updateMarkerIcons();

    resetActiveMarker();
};

loadCities().then(initializeMapAndMarkers);

map.on("click", resetActiveMarker);
map.on("zoomend", onMapZoomed);