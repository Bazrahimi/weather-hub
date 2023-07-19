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
const searchHistory = document.querySelector('.searchHistory');

// Add API Key
const apiKey = "9d289b87c3721d7d57fae4326e6dad30";

// Function to fetch data from API
function fetchApi(latitude, longitude) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

  // GET request using Fetch
  fetch(url)
    .then(response => response.json())
    .then(function(data) {

      //Store latitude and Longitude in localStorage
      localStorage.setItem('latitude', latitude);
      localStorage.setItem('longitude', longitude);
      
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

  //Add the city name as a placeholder on inputEl
  inputEl.placeholder = city;
  const cityName = city;
  addToSearchHistory(cityName);


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

//Get the existing searched cities from localStorage or initialize an empty array
let searchedCities = JSON.parse(localStorage.getItem('searchedCities')) || [];
function addToSearchHistory(city) {
  if(!searchedCities.includes(city)) {
    searchedCities.push(city);
    localStorage.setItem('searchedCities', JSON.stringify(searchedCities));
    appendToSearchHistory();
  }
}

function appendToSearchHistory() {
  searchHistory.innerHTML = '';
  const localStorageArray = JSON.parse(localStorage.getItem('searchedCities'));
  if (localStorageArray && localStorageArray.length > 0) {
    localStorageArray.forEach(cityName => {
      const searchHistoryEl = document.createElement('h4');
      searchHistoryEl.textContent = cityName;
      searchHistory.appendChild(searchHistoryEl);
    });
  }
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

// Event listener for selected-city section
selectedCitySection.addEventListener('click', function(event) {
  if (event.target.tagName === 'H4') {
    const city = event.target.textContent;

    // Call API to get the latitude and longitude
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

// Event listener for search button
searchBtn.addEventListener('click', function() { 
  const city = inputEl.value;
 
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
        const noCityMessage = document.getElementById('noCityMessage');
        noCityMessage.innerHTML = 'City not found!';
      }
    })
    .catch(error => {
      console.error("Error:", error);
    });
});

// Set Melbourne as the default city and add two cities to localStorage when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const latitude = localStorage.getItem('latitude');
  const longitude = localStorage.getItem('longitude');

  // Add two cities to the searchedCities array in localStorage if they don't already exist
  let searchedCities = JSON.parse(localStorage.getItem('searchedCities')) || [];
  const citiesToAdd = ['Melbourne'];
  citiesToAdd.forEach(city => {
    if (!searchedCities.includes(city)) {
      searchedCities.push(city);
    }
  });
  localStorage.setItem('searchedCities', JSON.stringify(searchedCities));

  // Call appendToSearchHistory to display the search history
  appendToSearchHistory();

  if (latitude && longitude) {
    fetchApi(latitude, longitude);
  } else {
    const defaultLatitude = '-37.8142';
    const defaultLongitude = '144.9632';
    fetchApi(defaultLatitude, defaultLongitude);
  }
});
