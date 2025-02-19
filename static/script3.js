document.addEventListener("DOMContentLoaded", function () {
    const API_KEY = "1ea56f1bd7186d778a1a303f42b7842a"; 

    
    const urlParams = new URLSearchParams(window.location.search);
    const layer = urlParams.get("layer");

    const layerNames = {
        "clouds": "Clouds",
        "precipitation": "Precipitation",
        "pressure": "Sea level pressure",
        "wind": "Wind speed",
        "temp": "Temperature"
    };

    
    const mapTitle = document.getElementById("mapTitle");
    mapTitle.textContent = layerNames[layer] || "Weather Map";

    // Inicjalizacja mapy Leaflet
    const map = L.map("mapContainer").setView([51.505, -0.09], 2);

    // Dodanie warstwy bazowej OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    // Warstwy OpenWeather
    const layers = {
        "clouds": "clouds_new",
        "precipitation": "precipitation_new",
        "pressure": "pressure_new",
        "wind": "wind_new",
        "temp": "temp_new"
    };

    // Sprawdzenie poprawności warstwy i dodanie do mapy
    if (layers[layer]) {
        L.tileLayer(`https://tile.openweathermap.org/map/${layers[layer]}/{z}/{x}/{y}.png?appid=${API_KEY}`, {
            opacity: 0.7,
            zIndex: 1
        }).addTo(map);
    } else {
        alert("Invalid map layer.");
    }
});
