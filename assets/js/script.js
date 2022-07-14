// Variables
// Open Weather API Key
var APIKey = "bd5f7b7cf26bd43cbad8e84e5a8adccd";

// Search for a city variables 
var cityForm = document.querySelector("#cityForm");
var cityName = document.querySelector("#cityname");

// Search history variables
var historyEl = document.querySelector("#history");
var trash = document.querySelector("#trash");
var searchHistory = document.querySelector("#searchHistory");
var searchedCitiesArray = []

// Current weather variables
var weather = document.querySelector("#weather");
var currentWeatherDescription = document.querySelector('#currentWeatherDescription');
var currentWeather = document.querySelector('#currentWeather');

// Five day forecast variables
var forecast = document.querySelector("#forecast");
var fiveDayForecast = document.querySelector("#fiveDayForecast");

// Display the current weather on the page
function weatherSection(cityname) {
    console.log(cityname);
    var apiURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=imperial" + "&appid=" + APIKey;
    fetch(apiURL)

        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            console.log(response)
            var latitude = response.coord.lat;
            var longitude = response.coord.lon;
            var city = response.name;
            var weatherIconLink = "<img src='http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png' />"

            // Moment.js is used to display the current day
            var today = moment();
            console.log(today);

            currentWeatherDescription.innerHTML = city + " (" + today.format("l") + ")" + weatherIconLink;

            currentWeather.textContent = "";
            weather.classList.remove("hidden");

            fiveDayForecast.textContent = "";
            forecast.classList.remove("hidden");

            var apiLatLonURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + "&exclude=alerts,minutely,hourly&units=imperial&appid=" + APIKey;
            return fetch(apiLatLonURL);
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            console.log(response);
            console.log(response.current);
            
            var temp = document.createElement("div");
            console.log(response.current.temp);
            temp.innerHTML = "<p>Temp: " + response.current.temp + " °F</p>";
            currentWeather.appendChild(temp);

            var wind = document.createElement("div");
            console.log(response.current.wind_speed);
            wind.innerHTML = "<p>Wind: " + response.current.wind_speed + " MPH</p>";
            currentWeather.appendChild(wind);

            var humidity = document.createElement("div");
            console.log(response.current.humidity);
            humidity.innerHTML = "<p>Humidity: " + response.current.humidity + " %</p>";
            currentWeather.appendChild(humidity);

            var uvIndex = document.createElement("div");
            console.log(response.current.uvi);
            uvIndex.innerHTML = "<p>UV Index: " + response.current.uvi + "</p>";
            currentWeather.appendChild(uvIndex);

            // The UV index is given a color that indicates whether the conditions are favorable, moderate, or severe
            var uvi = response.current.uvi;
            console.log(uvi);

            if (uvi >= 0) {
                console.log("green");
                uvIndex.style.color = "green";

            }
            if (uvi >= 3) {
                console.log("yellow");
                uvIndex.style.color = "yellow";

            }
            if (uvi >= 8) {
                console.log("red");
                uvIndex.style.color = "red";
            }

            extendedWeatherSection(response);
        });
};

// Display the extended weather on the page
function extendedWeatherSection(weather) {
    fiveDayForecastDescription.innerHTML = "5-Day Forecast"

    console.log(weather);

    var day0 = weather.daily[0];
    console.log(day0);
    var day1 = weather.daily[1];
    console.log(day1);
    var day2 = weather.daily[2];
    console.log(day2);
    var day3 = weather.daily[3];
    console.log(day3);
    var day4 = weather.daily[4];
    console.log(day4);
    var day5 = weather.daily[5];
    console.log(day5);

    var fiveDayForecastArray = [day1, day2, day3, day4, day5];
    console.log(fiveDayForecastArray);

    // Shows the weather forecast for the next 5 days 
    for (let i = 0; i < fiveDayForecastArray.length; i++) {
        var date = moment.unix(fiveDayForecastArray[i].dt).add(1, 'days').format('l');
        console.log(date);

        var weatherIconLink = "<img src='http://openweathermap.org/img/wn/" + fiveDayForecastArray[i].weather[0].icon + ".png' />"

        var dayForecast = document.createElement("div");
        dayForecast.classList.add("day");
        dayForecast.innerHTML =
            "<p>" + date + "</p>" +
            "<p>" + weatherIconLink + "</p>" +
            "<p>Temp: " + fiveDayForecastArray[i].temp.day + " °F</p>" +
            "<p>Wind: " + fiveDayForecastArray[i].wind_speed + " MPH</p>" +
            "<p>Humidity: " + fiveDayForecastArray[i].humidity + " %</p>";

        fiveDayForecast.appendChild(dayForecast);
    }
}

// Adds cityname search to search history
function historySection(event) {
    event.preventDefault();

    var cityname = cityName.value;
    console.log(cityname);

    if (cityname) {
        searchedCitiesArray.push(cityname);
        console.log(searchedCitiesArray);
        localStorage.setItem("weatherSearch", JSON.stringify(searchedCitiesArray));
        var searchHistoryButton = document.createElement("button");
        searchHistoryButton.classList.add("btn");
        searchHistoryButton.classList.add("btn-secondary");
        searchHistoryButton.classList.add("block");
        searchHistoryButton.classList.add("mt-2");
        searchHistoryButton.classList.add("mb-2");
        searchHistoryButton.setAttribute("cityNameAttr", cityname);
        searchHistoryButton.innerHTML = cityname;
        searchHistory.appendChild(searchHistoryButton);
        historyEl.removeAttribute("style");
        weatherSection(cityname);
        cityName.value = "";
    }
}

// Shows past history searches
function pastHistory() {
    searchArray = JSON.parse(localStorage.getItem("weatherSearch"));

    if (searchArray) {
        searchedCitiesArray = JSON.parse(localStorage.getItem("weatherSearch"));
        for (let i = 0; i < searchArray.length; i++) {
            var searchHistoryButton = document.createElement("button");
            searchHistoryButton.classList.add("btn");
            searchHistoryButton.classList.add("btn-secondary");
            searchHistoryButton.classList.add("block");
            searchHistoryButton.classList.add("mt-2");
            searchHistoryButton.classList.add("mb-2");
            searchHistoryButton.classList.add("searchHistoryButton");
            searchHistoryButton.setAttribute("cityNameAttr", searchArray[i])
            searchHistoryButton.innerHTML = searchArray[i];
            searchHistory.appendChild(searchHistoryButton);
            historyEl.removeAttribute("style");
        }
    }
}

pastHistory();

// Shows the weather conditions for that city when the city is clicked in the search history
function searchWeatherHistory(event) {
    console.log(event);
    console.log(event.target);
    console.log(event.target.getAttribute("cityNameAttr"));
    var cityname = event.target.getAttribute("cityNameAttr");
    if (cityname) {
        weatherSection(cityname);
    }
}

// Clear history 
function removeSection() {
    localStorage.removeItem("weatherSearch");
    historyEl.setAttribute("style", "display: none");
    currentWeatherDescription.textContent = "";
    fiveDayForecastDescription.textContent = "";
    currentWeather.textContent = "";
    fiveDayForecast.textContent = "";
    currentWeather.style.backgroundColor = "white";
}

// Add event listeners
cityForm.addEventListener("submit", historySection);
searchHistory.addEventListener("click", searchWeatherHistory);
trash.addEventListener("click", removeSection);