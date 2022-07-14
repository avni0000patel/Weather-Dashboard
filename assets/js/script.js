var APIKey = "bd5f7b7cf26bd43cbad8e84e5a8adccd";

var cityForm = document.querySelector("#cityForm");
var cityName = document.querySelector("#cityname");

var historyEl = document.querySelector("#history");
var trash = document.querySelector("#trash");
var searchHistory = document.querySelector("#searchHistory");
var searchedCitiesArray = []

var weather = document.querySelector("#weather");
var currentWeatherDescription = document.querySelector('#currentWeatherDescription');
var currentWeather = document.querySelector('#currentWeather');

var forecast = document.querySelector("#forecast");
var fiveDayForecast = document.querySelector("#fiveDayForecast");


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
        searchHistoryButton.setAttribute("cityNameAttr", cityname);
        searchHistoryButton.innerHTML = cityname;
        searchHistory.appendChild(searchHistoryButton);
        historyEl.removeAttribute("style");
        weatherSection(cityname);
        cityName.value = "";
    }
}

function weatherSection(cityname) {
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
            var weather = `
                <p>Temp: ${response.current.temp} °F</p>
                <p>Wind: ${response.current.wind_speed} MPH</p>
                <p>Humidity: ${response.current.humidity} %</p>
                <p class="uvIndex" id="uvIndex">UV Index: ${response.current.uvi}</p>
                `;

            var uvi = response.current.uvi;
            console.log(uvi);

            // The UV index is given a color that indicates whether the conditions are favorable, moderate, or severe
            if (uvi >= 0) {
                console.log("green");
                currentWeather.style.backgroundColor = "green";
            }
            if (uvi >= 2) {
                console.log("yellow");
                currentWeather.style.backgroundColor = "yellow";

            }
            if (uvi >= 6) {
                console.log("orange");
                currentWeather.style.backgroundColor = "orange";
            }
            if (uvi >= 8) {
                console.log("red");
                currentWeather.style.backgroundColor = "red";
            }
            if (uvi >= 11) {
                console.log("purple");
                currentWeather.style.backgroundColor = "purple";
            }

            // Append the results to the DOM
            $('#currentWeather').append(weather);

            console.log(weather);

            extendedWeatherSection(response);
        });
};

// Display the weather on page
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


    // Create day cards for extended forecast
    for (let i = 0; i < fiveDayForecastArray.length; i++) {

        var date = moment.unix(fiveDayForecastArray[i].dt).add(1, 'days').format('l');
        console.log(date);

        var weatherIconLink = "<img src='http://openweathermap.org/img/wn/" + fiveDayForecastArray[i].weather[0].icon + ".png' />"
        var dayEl = document.createElement("div");
        dayEl.classList.add("day");
        dayEl.innerHTML =
            "<p>" + date + "</p>" +
            "<p>" + weatherIconLink + "</p>" +
            "<p>Temp: " + fiveDayForecastArray[i].temp.day + " °F</p>" +
            "<p>Wind: " + fiveDayForecastArray[i].wind_speed + " MPH</p>" +
            "<p>Humidity: " + fiveDayForecastArray[i].humidity + " %</p>";

        fiveDayForecast.appendChild(dayEl);
    }
}

// Load any past city weather searches
function loadHistory() {
    searchArray = JSON.parse(localStorage.getItem("weatherSearch"));

    if (searchArray) {
        searchedCitiesArray = JSON.parse(localStorage.getItem("weatherSearch"));
        for (let i = 0; i < searchArray.length; i++) {
            var searchHistoryButton = document.createElement("button");
            searchHistoryButton.classList.add("btn");
            searchHistoryButton.classList.add("btn-secondary");
            searchHistoryButton.classList.add("block");
            searchHistoryButton.classList.add("mt-2");
            searchHistoryButton.setAttribute("cityNameAttr", searchArray[i])
            searchHistoryButton.innerHTML = searchArray[i];
            searchHistory.appendChild(searchHistoryButton);
            historyEl.removeAttribute("style");
        }

    }
}

loadHistory();

// Search weather using search history buttons
function searchWeatherHistory(event) {
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

// Event listeners
cityForm.addEventListener("submit", historySection);
searchHistory.addEventListener("click", searchWeatherHistory);
trash.addEventListener("click", removeSection);