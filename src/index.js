let now = new Date();
let currentTime = document.querySelector("#current-time");
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let month = months[now.getMonth()];
let date = now.getDate();
let hour = now.getHours();
if (hour < 10) {
  hour = `0${hour}`;
}
let minute = now.getMinutes();
if (minute < 10) {
  minute = `0${minute}`;
}
currentTime.innerHTML = `${day} | ${month} ${date} | ${hour}:${minute}`;

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function getForecast(coordinates) {
  let apiKey = "ff1d9ea9376b5c27a82e04fc2b2abdbb";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function showPosition(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  celsiusTemperature = response.data.main.temp;
  document.querySelector("#current-temperature").innerHTML =
    Math.round(celsiusTemperature);
  document.querySelector("#temperature-feels").innerHTML = `${Math.round(
    response.data.main.feels_like
  )}°C`;
  document.querySelector("#wind").innerHTML = `${Math.round(
    response.data.wind.speed
  )}km/h`;
  document.querySelector(
    "#humidity"
  ).innerHTML = `${response.data.main.humidity}%`;
  document.querySelector(
    "#visibility"
  ).innerHTML = `${response.data.visibility}m`;
  document.querySelector(
    "#pressure"
  ).innerHTML = `${response.data.main.pressure}mb`;
  document.querySelector("#weather-description").innerHTML =
    response.data.weather[0].main;
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].main);

  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiKey = "bb0df6985c2eab6a171d64a6bacbb4e1";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showPosition);
}

function search(event) {
  event.preventDefault();
  let city = document.querySelector("#city-search-input").value;
  searchCity(city);
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", search);
searchCity("Kyiv");

function searchLocation(position) {
  let apiKey = "bb0df6985c2eab6a171d64a6bacbb4e1";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showPosition);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let locationButton = document.querySelector("#location-button");
locationButton.addEventListener("click", getCurrentLocation);

function convertToFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temperature");
  celsius.classList.remove("active");
  fahrenheit.classList.add("active");
  let temperature = temperatureElement.innerHTML;
  temperature = Number(temperature);
  temperatureElement.innerHTML = Math.round((celsiusTemperature * 9) / 5 + 32);
}

let celsiusTemperature = null;

function convertToCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temperature");
  celsius.classList.add("active");
  fahrenheit.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", convertToFahrenheit);

let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", convertToCelsius);

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#week-forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `<div class="col">
            <h4>${formatDay(forecastDay.dt)}</h4>
            <img src="http://openweathermap.org/img/wn/${
              forecastDay.weather[0].icon
            }@2x.png" alt="Sunny" id="icon" />
            <h6>${forecastDay.weather[0].description}</h6>
            <span class="forecast-temperature"><strong>${Math.round(
              forecastDay.temp.max
            )}°</strong>/${Math.round(forecastDay.temp.min)}°</span>
          </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
