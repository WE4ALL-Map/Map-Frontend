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

const we4AllIcon = L.icon({
    iconUrl: "./Assets/we4all_logo.png",
    iconSize: [40, 40]
})

const iconOptions = {
    draggable: false,
    icon: we4AllIcon,
}

const placeMarkers = (cities) => {

    for (let city in cities) {
        const obj = cities[city];
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
export const placeFilteredMarkers = (cityName = "") => {

    if (cityName === "") {
        loadCities().then(placeMarkers);
        return
    }

    loadFilteredCities(cityName).then((filteredCity) =>{
        clearMarkers()
        placeMarkers(filteredCity)
    })
}

loadCities().then(placeMarkers);

