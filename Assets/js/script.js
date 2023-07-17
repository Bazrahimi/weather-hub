// HTML References
const searchBtn = document.querySelector('.search-button');
const inputEl = document.querySelector('.cityInput');
const selectedCityWeather = document.querySelector('.selected-city-weather');
const cityPlusDate = document.getElementById('cityPlusDate');
const tempDiv = document.getElementById('temp');
const windDiv = document.getElementById('wind');
const humidityDiv = document.getElementById('humidity');
const forcastDiv = document.getElementById('days');

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
      renderForcastData(data);
    });
}

// Function to render weather data
function renderWeatherData(data) {
  const city = data.city.name;
  const kelvin = data.list[0].main.temp;
  const windSpeedMetersPerSec = data.list[0].wind.speed;
  const humidity = data.list[0].main.humidity;

  //convert Kelvin to Degree Celsius and round off
  const degreeCelsius = kelvin - 273.15;
  const temperature = Math.round(degreeCelsius);

  //convert Wind Meters per Sec to Km/h and round off
  const windSpeed = Math.round(windSpeedMetersPerSec * 3.6);


  const currentDate = new Date().toLocaleDateString();

  cityPlusDate.textContent = `${city} (${currentDate})`;
  tempDiv.textContent = "Temperature: " + temperature + "\u00B0C";


  windDiv.textContent = "Wind: " + windSpeed + " km/h";
  humidityDiv.textContent = `Humidity: ${humidity} %`;

  selectedCityWeather.style.display = "block";
}

//function to render 5 Days forecast
function renderForcastData(data) {
  const forcastList = data.list;
  forcastDiv.innerHTML = '';

  for (let i = 0; i < forecastList.length; i++) {
    const forecastData = forecastList[i];
    const dateTime = forecastData.dt_txt;
    const kelvin = forecastData.main.temp;

    // Convert Kelvin to Degree Celsius and round off
    const degreeCelsius = kelvin - 273.15;
    const temperature = Math.round(degreeCelsius);

    const forecastItem = document.createElement("div");
    forecastItem.textContent = `${dateTime}: ${temperature}\u00B0C`;
    forcastDiv.appendChild(forecastItem);
  }
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
