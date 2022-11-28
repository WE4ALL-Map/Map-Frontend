import { loadCities } from "./requests/fetchLocations.js";

const mapOptions = {
    center: [51.330, 10.453],
    zoom: 6,
    minZoom: 6,
    maxZoom: 9,
    maxBounds: [
        [55.459583, -2.391338],
        [45.296025, 22.065829]
    ],
};

const map = L.map("map", mapOptions);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 10,
    attribution: "© OpenStreetMap",
}).addTo(map);

let markers = [];

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

        const marker = L.marker([cityObj.lat, cityObj.long], iconOptions).bindPopup(`${cityObj.partners} Partner`);

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
    
    map.flyTo(searchedMarker.getLatLng(), mapOptions.maxZoom);
};

loadCities().then(placeMarkers);
