var searchButtonEl = document.querySelector(".searchBtn");
var APIKey = "bd5f7b7cf26bd43cbad8e84e5a8adccd";

// Moment.js is used to display the current day
var today = moment();
console.log(today);
$("#currentDay").text(today.format("dddd, MMMM Do YYYY"));

function citySearch(event) {
    var city = $('.text').val();
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + APIKey;
    event.preventDefault();
    console.log(event);

    fetch(queryURL)
    .then(function (response) {
        console.log(response);
        return response.json();
    })
    .then (function (data) {
        console.log(data);
        console.log(data.main);
        console.log(data.main.temp);
        var weather = `
            <p>Temperature: ${data.main.temp} &#8457</p>
            <p>Wind: ${data.wind.speed} MPH</p>
            <p>Humidity: ${data.main.humidity} %</p>
            <p>UV Index: </p>`;

            // Append the results to the DOM
            $('#currentWeather').html(weather);
    })

}

searchButtonEl.addEventListener("click", citySearch);
