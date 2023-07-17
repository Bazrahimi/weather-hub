// Add API Key
const apiKey = "9d289b87c3721d7d57fae4326e6dad30";

const latitude = -37.8136; // Latitude of Melbourne
const longitude = 144.9631; // Longitude of Melbourne

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

//function to render weatehr dada
function renderWeatherData(data) {
  const city = data.city.name;
  const temprature = data.list[0].main.temp;
  const windSpeed = data.list[0].wind.speed;
  const humidity = data.list[0].main.humidity;
  console.log(city);
  console.log(temprature);
  console.log(windSpeed);
  console.log(humidity);
}
















// Call the fetchApi function with the latitude and longitude parameters
fetchApi(latitude, longitude);
