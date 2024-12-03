let userLocation = null; // Tallennetaan käyttäjän sijainti, kun se on saatavilla

// Alustetaan kartta ja keskitetään Suomeen
const map = L.map('map').setView([60.1699, 24.9384], 6);

// Lisätään OpenStreetMap-laatat kartalle
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Mukautettu markkeri
const customIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/252/252025.png',
    iconSize: [32, 32]
});

// Alueiden rajat
const regions = {
    finland: { latRange: [60, 70], lngRange: [20, 30] },
    helsinki: { latRange: [60.15, 60.30], lngRange: [24.85, 25.05] },
    lapland: { latRange: [67, 69], lngRange: [23, 28] },
};

// Lista tallennetuista sijainneista
const sijaintiLista = document.getElementById("sijaintiLista");

// Satunnainen sijainti
document.getElementById("satunnainenSijainti").addEventListener("click", () => {
    const region = document.getElementById("regionSelect").value;
    const latRange = regions[region].latRange;
    const lngRange = regions[region].lngRange;

    const lat = latRange[0] + Math.random() * (latRange[1] - latRange[0]);
    const lng = lngRange[0] + Math.random() * (lngRange[1] - lngRange[0]);
    const randomLocation = [lat, lng];

    map.setView(randomLocation, 10);
    const marker = L.marker(randomLocation, { icon: customIcon }).addTo(map)
        .bindPopup(`Satunnainen sijainti: ${lat.toFixed(4)}, ${lng.toFixed(4)}`)
        .openPopup();

    // Lasketaan etäisyys, jos käyttäjän sijainti on tiedossa
    let distanceInfo = '';
    if (userLocation) {
        const distance = calculateDistance(userLocation[0], userLocation[1], lat, lng);
        distanceInfo = ` (Etäisyys: ${distance.toFixed(2)} km)`;
    }

    // Lisää sijainti listaan
    const listItem = document.createElement("li");
    listItem.textContent = `Leveysaste: ${lat.toFixed(4)}, Pituusaste: ${lng.toFixed(4)}${distanceInfo}`;
    sijaintiLista.appendChild(listItem);
});

// Oma sijainti
document.getElementById("omaSijainti").addEventListener("click", () => {
    if (!navigator.geolocation) {
        alert("Selaimesi ei tue paikannusta!");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            userLocation = [latitude, longitude];

            map.setView(userLocation, 10);
            L.marker(userLocation, { icon: customIcon }).addTo(map)
                .bindPopup("Olet tässä!")
                .openPopup();

            // Lisää sijainti listaan
            const listItem = document.createElement("li");
            listItem.textContent = `Oma sijainti: Leveysaste: ${latitude.toFixed(4)}, Pituusaste: ${longitude.toFixed(4)}`;
            sijaintiLista.appendChild(listItem);
        },
        () => {
            alert("Paikannus epäonnistui.");
        }
    );
});

// Etäisyyden laskeminen kahden pisteen välillä (Haversine-kaava)
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Maapallon säde kilometreinä
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(value) {
    return value * Math.PI / 180;
}
