document.addEventListener("DOMContentLoaded", function () {
    const API_KEY = "1ea56f1bd7186d778a1a303f42b7842a"; 

    document.getElementById("pollutionForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const city = document.getElementById("pollutionCity").value.trim();
        if (!city) {
            alert("Please enter the name of the city.");
            return;
        }

        fetchPollutionData(city);
    });

    function fetchPollutionData(city) {
        // Pobierz współrzędne geograficzne miasta
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                if (!data.coord) {
                    document.getElementById("pollutionResult").innerHTML = `<p>No data found for city: ${city}</p>`;
                    return;
                }

                const { lat, lon } = data.coord;

                // Pobierz dane o zanieczyszczeniu powietrza na podstawie współrzędnych
                fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
                    .then(response => response.json())
                    .then(pollutionData => {
                        if (!pollutionData.list || pollutionData.list.length === 0) {
                            document.getElementById("pollutionResult").innerHTML = `<p>No pollution data found for ${city}.</p>`;
                            return;
                        }

                        const pollution = pollutionData.list[0].components;
                        document.getElementById("pollutionCityName").textContent = `Pollution in: ${city}`;
                        updatePollutionLevel("so2", pollution.so2, [20, 80, 250, 350]);
                        updatePollutionLevel("no2", pollution.no2, [40, 70, 150, 200]);
                        updatePollutionLevel("pm10", pollution.pm10, [20, 50, 100, 200]);
                        updatePollutionLevel("pm25", pollution.pm2_5, [10, 25, 50, 75]);
                        updatePollutionLevel("o3", pollution.o3, [60, 100, 140, 180]);
                        updatePollutionLevel("co", pollution.co, [4400, 9400, 12400, 15400]);
                    })
                    .catch(error => {
                        console.error("Error fetching pollution data:", error);
                        alert("There was a problem downloading pollution data.");
                    });
            })
            .catch(error => {
                console.error("Error fetching city coordinates:", error);
                alert("There was a problem downloading city coordinates.");
            });
    }

    function updatePollutionLevel(id, value, thresholds) {
        const element = document.getElementById(id);
        element.textContent = `${id.toUpperCase()}: ${value} µg/m³`;

        if (value >= thresholds[3]) {
            element.style.color = "red";  // Very Poor
        } else if (value >= thresholds[2]) {
            element.style.color = "red";  // Poor
        } else if (value >= thresholds[1]) {
            element.style.color = "orange";  // Moderate
        } else {
            element.style.color = "black";  // Good or Fair
        }
    }
});
