import {loadCities, loadFilteredCities} from "./requests/fetchLocations.js";

const map = L.map('map', {
    center: [51.330, 10.453],
    zoom: 6,
    minZoom: 6,
    maxZoom: 9
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 10,
    attribution: '© OpenStreetMap',
}).addTo(map);

let markers = [];

const placeMarkers = (cities) => {
    for (let city in cities) {
        const obj = cities[city];

        const numberedPin = L.divIcon({
            className: "numbered-pin",
            iconSize: [40, 50],
            iconAnchor: [20, 50],
            popupAnchor: [0, -40],
            html: `<span class='pin-number'>${obj.partners}</span>`
        });
    
        const iconOptions = {
            draggable: false,
            icon: numberedPin,
        };

        markers.push({
            "city": city,
            "marker": L.marker([obj.lat, obj.long], iconOptions).bindPopup(`${obj.partners} Partner`)
        });
    }

    for (let marker of markers) {
        marker.marker.addTo(map);
    }
};

const clearMarkers = () => {
    for (let marker of markers) {
        marker.marker.remove();
    }

    markers = [];
};
export const placeFilteredMarkers = (cityName) => {
    if (!cityName) {
        loadCities().then(placeMarkers);
        return;
    }

    loadFilteredCities(cityName).then((filteredCity) => {
        clearMarkers();
        placeMarkers(filteredCity);
    });
};

loadCities().then(placeMarkers);
