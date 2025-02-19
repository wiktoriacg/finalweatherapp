const API_KEY = "1ea56f1bd7186d778a1a303f42b7842a"; // Wstaw swój klucz OpenWeatherMap

document.getElementById('weatherForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('city').value;
    localStorage.setItem('city', city);
    getWeather(city);
});

function getWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== 200) {
                showError("City not found");
                return;
            }
            displayWeather(data);
        })
        .catch(error => console.error('Error:', error));
}

function displayWeather(data) {
    const tempCelsius = data.main.temp;
    const tempFahrenheit = (tempCelsius * 9/5) + 32;

    document.getElementById('cityName').textContent = `Weather in ${data.name}`;
    document.getElementById('temperature').innerHTML = `Temperature: <span class="fahrenheit">${tempFahrenheit.toFixed(1)}°F</span> / ${tempCelsius}°C`;
    document.getElementById('description').textContent = `Description: ${data.weather[0].description}`;
    document.getElementById('icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    document.getElementById('icon').style.display = 'block';
    document.getElementById('goToIndex2').style.display = 'block';

    setWeatherBackground(data.weather[0].icon);
}

function setWeatherBackground(icon) {
    let imageUrl = "";
    switch (icon) {
        case '01d': case '02d':
            imageUrl = "sun.jpg"; break;
        case '02n': case '03d': case '04d': case '03n': case '04n':
            imageUrl = "clouds.png"; break;
        case '09d': case '10d': case '09n': case '10n':
            imageUrl = "rain.png"; break;
        case '11d': case '11n':
            imageUrl = "storm.jpg"; break;
        case '13d': case '13n':
            imageUrl = "snow.png"; break;
        case '50d': case '50n':
            imageUrl = "fog.png"; break;
    }
    document.body.style.backgroundImage = imageUrl ? `url('/static/images/${imageUrl}')` : '';
}

function showError(message) {
    document.getElementById('cityName').textContent = message;
    document.getElementById('temperature').textContent = '';
    document.getElementById('description').textContent = '';
    document.getElementById('icon').style.display = 'none';
    document.getElementById('goToIndex2').style.display = 'none';
}

function goToIndex2() {
    window.location.href = 'index2.html';
}
