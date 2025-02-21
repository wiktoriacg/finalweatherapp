document.addEventListener("DOMContentLoaded", () => {
    const city = localStorage.getItem('city'); // Pobranie miasta zapisane w index.html
    const cityNameElement = document.getElementById('cityName');

    if (city) {
        cityNameElement.textContent = `Weather forecast for: ${city}`;
        getFiveDaysForecast(city); // Pobranie prognozy dla wybranego miasta
    } else {
        console.error("City not entered.");
        document.getElementById('forecastContainer').innerHTML = "<p>No information about the city. Return to the home page.</p>";
    }
});

const API_KEY = "1ea56f1bd7186d778a1a303f42b7842a"; 

function getFiveDaysForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const forecastContainer = document.getElementById('forecastContainer');
            forecastContainer.innerHTML = '';

            if (data.cod !== "200") {
                forecastContainer.innerHTML = '<p>No forecast found for this city.</p>';
            } else {
                const days = {};
                data.list.forEach(entry => {
                    const date = entry.dt_txt.split(' ')[0];
                    if (!days[date]) days[date] = [];
                    days[date].push(entry);
                });

                Object.keys(days).forEach(day => {
                    const dayData = days[day];

                    const dayContainer = document.createElement('div');
                    dayContainer.classList.add('day-container');

                    const dateHeading = document.createElement('h3');
                    dateHeading.classList.add('date-heading');
                    dateHeading.innerText = `Date: ${day}`;
                    dayContainer.appendChild(dateHeading);

                    const canvas = document.createElement('canvas');
                    canvas.id = `chart-${day}`;
                    dayContainer.appendChild(canvas);
                    
                    displayTemperatureChart(dayData, canvas); 

                    const table = generateTableForDay(dayData); 
                    dayContainer.appendChild(table);

                    forecastContainer.appendChild(dayContainer);
                });
            }
        })
        .catch(error => console.error('Error:', error));
}

// Funkcja generująca wykres temperatury 
function displayTemperatureChart(data, canvas) {
    const times = data.map(forecast => convertToUTC(forecast.dt_txt)); // Zmiana z CST na UTC
    const temperatures = data.map(forecast => forecast.main.temp);

    new Chart(canvas, {
        type: 'line',
        data: {
            labels: times,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Time' }},
                y: { title: { display: true, text: 'Temperature (°C)' }}
            }
        }
    });
}

// Funkcja pomocnicza do konwersji czasu UTC → UTC
function convertToUTC(datetimeString) {
    const date = new Date(datetimeString + ' UTC');
    return date.toISOString().slice(11, 16);   // Zwraca czas w formacie: YYYY-MM-DD HH:MM:SS
}

// Funkcja generująca tabelę dla prognozy
function generateTableForDay(dayData) {
    const table = document.createElement('table');
    table.classList.add('forecast-table');

    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>Time</th>
        <th>Temperature (F/°C)</th>
        <th>Feels like (F/°C)</th>
        <th>Humidity (%)</th>
        <th>Description</th>
    `;
    table.appendChild(headerRow);

    dayData.forEach(forecast => {
        const row = document.createElement('tr');
        const utcTime = convertToUTC(forecast.dt_txt); // Zmiana na UTC
        const tempF = convertToFahrenheit(forecast.main.temp);
        const feelsLikeF = convertToFahrenheit(forecast.main.feels_like);
        row.innerHTML = `
            <td>${utcTime}</td>
            <td><span class="temperature-fahrenheit">${tempF} F</span> / ${forecast.main.temp}°C</td>
            <td><span class="temperature-fahrenheit">${feelsLikeF} F</span> / ${forecast.main.feels_like}°C</td>
            <td>${forecast.main.humidity}%</td>
            <td>${forecast.weather[0].description}</td>
        `;
        table.appendChild(row);
    });

    return table;
}

// Funkcja pomocnicza do konwersji temperatury na Fahrenheity
function convertToFahrenheit(celsius) {
    return (celsius * 9/5 + 32).toFixed(1);
}
