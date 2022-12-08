import { loadCities } from "./requests/fetchLocations.js";
import { showShidePanel, hideSidePanel } from "./sidePanel.js";

const mapOptions = {
    center: [51.330, 10.453],
    zoom: 6,
    minZoom: 6,
    maxZoom: 9,
    maxBounds: [
        [55.459583, -2.391338],
        [45.296025, 22.065829]
    ],
    zoomControl: false,
};

const map = L.map("map", mapOptions);

L.control.zoom({
    position: 'topright'
}).addTo(map);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 10,
    attribution: "© OpenStreetMap",
}).addTo(map);

let markers = [];

let activeMarker = undefined;

const setActiveMarker = (city) => {
    if(activeMarker) {
        resetActiveMarker();
    }

    showShidePanel(city);

    const activePin = markers.find((obj) => obj.city === city).marker;
    const icon = activePin.getIcon();

    const iconOptions = { ...icon.options, className: "numbered-pin active"};
    
    const newIcon = L.divIcon(iconOptions);

    activePin.setIcon(newIcon);

    activeMarker = activePin;
}

export const resetActiveMarker = () => {
    if (activeMarker) {
        hideSidePanel();
        
        const icon = activeMarker.getIcon();
        
        const iconOptions = { ...icon.options, className: "numbered-pin"};
        
        const newIcon = L.divIcon(iconOptions);
        
        activeMarker.setIcon(newIcon);

        activeMarker = undefined;
    }
}

const placeMarkers = (cities) => {
    for (let city in cities) {
        const cityObj = cities[city];

        const numberedPin = L.divIcon({
            className: "numbered-pin",
            iconSize: [40, 50],
            iconAnchor: [20, 50],
            popupAnchor: [0, -40],
            html: `<span class="pin-number">${cityObj.partners}</span>`,
        });

        const iconOptions = {
            draggable: false,
            icon: numberedPin,
        };

        const marker = L.marker([cityObj.lat, cityObj.long], iconOptions).on("click", ()=>setActiveMarker(city));

        markers.push({
            "city": city,
            "marker": marker,
        });
    }

    for (let marker of markers) {
        marker.marker.addTo(map);
    }
};

export const zoomOnCity = (cityName) => {
    const searchedMarker = markers.find((marker) => marker.city === cityName).marker;

    setActiveMarker(cityName);
    
    map.flyTo(searchedMarker.getLatLng(), mapOptions.maxZoom);
};

loadCities().then(placeMarkers);
map.on("click", resetActiveMarker);
//document.getElementById("side-panel").addEventListener("focusout", resetActiveMarker)