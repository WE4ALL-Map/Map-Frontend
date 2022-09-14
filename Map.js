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

const loadCities = async () => {
    const response = await fetch('http://localhost:8080/cities');

    return await response.json();
};

const placeMarkers = (cities) => {
    const we4AllIcon = L.icon({
        iconUrl: "./Assets/we4all_logo.png",
        iconSize: [40,40]
    })

    const iconOptions = {
        draggable: false,
        icon: we4AllIcon,
    }

    for (let city in cities) {
        const obj = cities[city];
        L.marker([obj.lat, obj.long],iconOptions).bindPopup(`${obj.partners} Partner`).addTo(map);
    }
};

loadCities().then(placeMarkers);
