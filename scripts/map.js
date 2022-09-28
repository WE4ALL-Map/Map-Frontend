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

let markers = []

const placeMarkers = (cities) => {
    for (let city in cities) {
        const obj = cities[city];

        const numberedPin = L.divIcon({
            className: "numbered-pin",
            iconSize: [40, 50],
            iconAnchor: [20, 50],
            popupAnchor: [20, 0],
            html: `<span class='pin-number'>${obj.partners}</span>`
        })
    
        const iconOptions = {
            draggable: false,
            icon: numberedPin,
        }

        markers.push(
            {
                "city": city,
                "marker": L.marker([obj.lat, obj.long], iconOptions).bindPopup(`${obj.partners} Partner`)
            }
        )
        markers[markers.length - 1].marker.addTo(map)
    }
};

const clearMarkers = () => {
    markers.forEach(marker => {
        marker.marker.remove()
    })
    markers = []
}
export const placeFilteredMarkers = async (cityName = "") => {
    clearMarkers()

    if (cityName === "") {
        loadCities().then(placeMarkers);
        return
    }

    let filteredCity = await loadFilteredCities(cityName)

    placeMarkers(filteredCity)
}

loadCities().then(placeMarkers);
