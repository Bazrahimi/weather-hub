// HTML References
const searchBtn = document.querySelector('.search-button');
const inputEl = document.querySelector('.cityInput');
const selectedCityWeather = document.querySelector('.selected-city-weather');
const cityPlusDate = document.getElementById('cityPlusDate');
const tempDiv = document.getElementById('temp');
const windDiv = document.getElementById('wind');
const humidityDiv = document.getElementById('humidity');
const forecastDiv = document.getElementById('days');
const selectedCitySection = document.getElementById('selected-city');

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
  const countryCode = data.city.country;
  const weatherIconCode = data.list[0].weather[0].icon;
  const weatherIconUrl = `https://openweathermap.org/img/wn/${weatherIconCode}.png`;
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

  //create weather Icon element
  const weatherIconEl = document.createElement('img');
  weatherIconEl.src = weatherIconUrl;
  weatherIconEl.alt = weatherDescription;

  cityPlusDate.textContent = `${city}, ${countryCode} (${currentDate}) ${weatherDescription}`;
  cityPlusDate.appendChild(weatherIconEl);
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
    const weatherIconCode = forecastItem.weather[0].icon;
    const weatherIconUrl = `https://openweathermap.org/img/wn/${weatherIconCode}.png`;
    const kelvin = forecastItem.main.temp;
    const windSpeedMetersPerSec = forecastItem.wind.speed;
    const humidity = forecastItem.main.humidity;
 
    //convert kelvin to degreeCelsius
    const degreeCelsius = kelvin - 273.15;
    const temperature = Math.round(degreeCelsius); 

    // Convert Wind Meters per Sec to Km/h and round off
    const windSpeed = Math.round(windSpeedMetersPerSec * 3.6);

    // Create the weather icon element
    const weatherIconEl = document.createElement('img');
    weatherIconEl.src = weatherIconUrl;
    weatherIconEl.alt = weatherDescription;

    // Create a forecast item element
    const forecastItemEl = document.createElement('div');
    forecastItemEl.classList.add('forecast-item');

    // Populate the forecast item element with data
    forecastItemEl.innerHTML = `
      <h5>${date}</h5>
      <p>${weatherIconEl.outerHTML}</p>
      <p>${weatherDescription}</p>
      <p>Temp: ${temperature}°C</p>
      <p>Wind: ${windSpeed} km/h</p>
      <p>Humidity: ${humidity}%</p>`;

    // Append the forecast item element to the forecast container
    forecastDiv.appendChild(forecastItemEl);
  });
}

//event listener for selected-city section
selectedCitySection.addEventListener('click', function(event) {
  if (event.target.tagName === 'H4') {
    const city = event.target.textContent;

    //call apoi to get the liatiude and and logitude
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`)
    .then(response => response.json())
    .then(function(geodata) {
      if (geodata.length > 0) {
        const latitude = geodata[0].lat;
        const longitude = geodata[0].lon;
        fetchApi(latitude, longitude);
      }
    });
  }
});

searchBtn.addEventListener('click', function() { 
  const city = inputEl.value;

  // Perform direct geocoding API call to get latitude and longitude
  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`)
    .then(response => response.json())
    .then(function(geodata) {
      if (geodata.length > 0) {
        const latitude = geodata[0].lat;
        const longitude = geodata[0].lon;
        console.log(latitude);
        console.log(longitude);
        fetchApi(latitude, longitude);
      } else {
        console.error("Location not found");
      }
    })
    .catch(error => {
      console.error("Error:", error);
    });
});

//set Melbourne as the default city
// document.addEventListener('DOMContentLoaded', () => {
//   const latitude = '-37.8142';
//   const longitude = '144.9632';
//   fetchApi(latitude, longitude)
// });


