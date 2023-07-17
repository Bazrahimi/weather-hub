// HTML References
const searchBtn = document.querySelector('.search-button');
const inputEl = document.querySelector('.cityInput');

// Add API Key
const apiKey = "9d289b87c3721d7d57fae4326e6dad30";

// Function to fetch data from API
function fetchApi(latitude, longitude) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

  // GET request using Fetch
  fetch(url)
    .then(response => response.json())
    .then(function(data) {
      renderWeatherData(data);
    });
}

// Function to render weather data
function renderWeatherData(data) {
  const city = data.city.name;
  const temperature = data.list[0].main.temp;
  const windSpeed = data.list[0].wind.speed;
  const humidity = data.list[0].main.humidity;
  console.log(city);
  console.log(temperature);
  console.log(windSpeed);
  console.log(humidity);
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

