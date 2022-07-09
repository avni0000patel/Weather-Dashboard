var searchButtonEl = document.querySelector(".searchBtn");
var APIKey = "bd5f7b7cf26bd43cbad8e84e5a8adccd";

function citySearch(event) {
    var city = $('.text').val();
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    event.preventDefault();
    console.log(event);

    fetch(queryURL)
    .then(function (response) {
        return response.json();
    })
    .then (function (data) {
        console.log(data);
    })

}

searchButtonEl.addEventListener("click", citySearch);
