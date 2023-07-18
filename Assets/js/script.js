// HTML References
const searchBtn = document.querySelector('.search-button');
const inputEl = document.querySelector('.cityInput');
const selectedCityWeather = document.querySelector('.selected-city-weather');
const cityPlusDate = document.getElementById('cityPlusDate');
const tempDiv = document.getElementById('temp');
const windDiv = document.getElementById('wind');
const humidityDiv = document.getElementById('humidity');
const forecastDiv = document.getElementById('days');

// Add API Key
const apiKey = "9d289b87c3721d7d57fae4326e6dad30";

// Function to fetch data from API
function fetchApi(latitude, longitude) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

  // GET request using Fetch
  fetch(url)
    .then(response => response.json())
    .then(function(data) {
      console.log(data);
      renderWeatherData(data);
      renderForecastData(data);
    });
}

// Function to render weather data
function renderWeatherData(data) {
  const city = data.city.name;
  const mainWeather = data.list[0].weather[0].main;
  const weatherDescription = data.list[0].weather[0].description;
  const kelvin = data.list[0].main.temp;
  const windSpeedMetersPerSec = data.list[0].wind.speed;
  const humidity = data.list[0].main.humidity;

  // Convert Kelvin to Degree Celsius and round off
  const degreeCelsius = kelvin - 273.15;
  const temperature = Math.round(degreeCelsius);

  // Convert Wind Meters per Sec to Km/h and round off
  const windSpeed = Math.round(windSpeedMetersPerSec * 3.6);

  const currentDate = new Date().toLocaleDateString();

  cityPlusDate.textContent = `${city} (${currentDate}) ${mainWeather} ${weatherDescription}`;
  tempDiv.textContent = "Temperature: " + temperature + "\u00B0C";
  windDiv.textContent = "Wind: " + windSpeed + " km/h";
  humidityDiv.textContent = `Humidity: ${humidity} %`;

  selectedCityWeather.style.display = "block";
}

// Function to render 5-day forecast weather
function renderForecastData(data) {
  const forecastItems = data.list.filter((item, index) => [6, 14, 22, 30, 38].includes(index));

  forecastDiv.innerHTML = ""; // Clear previous forecast data

  forecastItems.forEach(forecastItem => {
    const dateTime = forecastItem.dt_txt;
    const date = new Date(dateTime).toLocaleDateString();
    const weatherDescription = forecastItem.weather[0].description;
    const kelvin = forecastItem.main.temp;
    const degreeCelsius = kelvin - 273.15;
    const temperature = Math.round(degreeCelsius);

    // Create a forecast item element
    const forecastItemEl = document.createElement('div');
    forecastItemEl.classList.add('forecast-item');

    // Populate the forecast item element with data
    forecastItemEl.innerHTML = `
      <h5>${date}</h5>
      <p>${weatherDescription}</p>
      <p>Temperature: ${temperature}°C</p>`;

    // Append the forecast item element to the forecast container
    forecastDiv.appendChild(forecastItemEl);
  });
}

searchBtn.addEventListener('click', function() { 
  const city = inputEl.value;
  // Perform direct geocoding API call to get latitude and longitude
  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`)
    .then(response => response.json())
    .then(function(geodata) {
      if (geodata.length > 0) {
        const latitude = geodata[0].lat;
        const longitude = geodata[0].lon;
        fetchApi(latitude, longitude);
      } else {
        console.error("Location not found");
      }
    })
    .catch(error => {
      console.error("Error:", error);
    });
});
