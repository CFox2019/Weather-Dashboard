$( document ).ready(function() {
    var DateTime = luxon.DateTime
    var currentDate = DateTime.local()
    var currentDateString = currentDate.toLocaleString(DateTime.DATE_SHORT)

    // Create click listener for 'search' button
    $('#search-btn').on("click", function() {
        var city = $('#search-city').val()
        saveSearchRecord(city)
        showSearchHistory()
        searchWeather(city)

        // clear search
        $('#search-city').val("")
    })

    // Search for the weather for the city entered in search bar
    function searchWeather(city) {
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast",
            data: {
                q: city,
                appid: "6617c4c00e3f102ebf0972604493763d",
                units: "imperial"
            },
            success: parseWeatherData
        })
    }

    function parseWeatherData(data) {
        console.log("weather data", data);
        // TODO: Data needs to include city, the current date, an icon that represents the current
        // weather condition, temp, humidity, wind speed, and UV index
        // UV Index number should have a box around it that changes color, depending on the value
        console.log("City:", data.city.name)
        console.log("current date:", currentDateString)
        data.list.forEach(element => {
            console.log(element.dt_txt)
        // Icon of the current weather condition
        console.log("icon", data.list[0].weather[0].icon)
        // Temperature
        console.log("temp", data.list[0].main.temp)
        // Humidity
        console.log("humidity", data.list[0].main.humidity)
        // Wind Speed
        console.log("wind speed:", data.list[0].wind.speed)
        // UV Index that changes colors depending on the value

        })
    }

    function saveSearchRecord(city) {
        // 1. Load search history from localStorage. If nothing is there, default to an empty array.
        var searchHistoryArr = JSON.parse(localStorage.getItem("searchHistoryData")) || []
        // 2. Push the `city` into the search history array
        searchHistoryArr.push(city)
        // 3. Store the updated search history in localStorage
        localStorage.setItem("searchHistoryData", JSON.stringify(searchHistoryArr))
    }

    function showSearchHistory() {
        // Load search history from localStorage. If nothing is there, default to an empty array.
        var searchHistoryArr = JSON.parse(localStorage.getItem("searchHistoryData")) || []

        // Create list of cities entered in search bar
        var searchHistoryDiv = $('#search-history')
        searchHistoryDiv.empty()
        searchHistoryArr.forEach(element => {
            var row = $('<a>', {class: 'list-group-item list-group-item-action'})
            row.text(element)
            // append new entries to the bottom of the list
            searchHistoryDiv.append(row)
        });

        // Get all list-group-item elements and add an on click listener
        $('.list-group-item').on('click', (e) => {
            console.log('list-group-tem clicked', e.target.textContent);
            // Call searchWeather function and pass in e.target.textContent
            searchWeather(e.target.textContent)
        })
    }

    // Create 'card' class for today's weather data
    var cardContainer = $('<div>', {class: 'card'})
    var currentCardBodyDiv = $('<div>', {class: 'card-body'})
    var currentDayTitle = $('<h3>', {id: 'current-day-card-title'})
    var cardTextP = $('<p>', {class: 'card-text'})

    cardContainer.append(currentCardBodyDiv)
    cardBodyDiv.append(currentDayTitle)
    currentDayTitle.append(cardTextP)

    $('#current-day').append(cardContainer)


    //             <div class="mt-3" id="current-day">
    //                  <div class="card">
    //                     <div class="card-body">
    //                         <h3 id="current-day-card-title">
    //                             Atlanta (1/28/2021)
    //                             <img src="http://openweathermap.org/img/w/01d.png">
    //                         </h3>
    //                         <p class="card-text">Temperature: 40.23 °F</p>
    //                         <p class="card-text">Humidity: 56%</p>
    //                         <p class="card-text">Wind Speed: 21.85 MPH</p>
    //                         <p>
    //                             UV Index:
    //                             <span class="btn btn-sm btn-warning">3.36</span>
    //                         </p>
    //                     </div>
    //                  </div>
    //             </div>

    // Create a 'card' class for the 5 day forecast
        // Data needs to include the following 5 dates, an icon representing the weather condition on each day, temp, and humidity
    var columnDiv = $('<div>', {class: 'col-md-2'})
    var forecastCardDiv = $('<div>', {class: 'card bg-primary text-white'})
    var forecastCardBodyDiv = $('<div>', {class: 'card-body p-2'})
    var forecastCardTitle = $('<h5>', {class: 'card-title'})
    var forecastImg = $('<img>', {src: ''})
    var forecastCardTextP = $('<p>', {class: 'card-text'})

    columnDiv.append(forecastCardDiv)
    forecastCardDiv.append(forecastCardBodyDiv)
    forecastCardBodyDiv.append(forecastCardTitle)
    forecastCardTitle.append(forecastImg)
    forecastImg.append(forecastCardTextP)

    $('#forecast-row').append(columnDiv)

    // <div id="forecast" class="mt-3">
    //                 <h4 class="mt-3">5-Day Forecast:</h4>
    //                 <div class="row" id='forecast-row>
    //                      <div class="col-md-2">
    //                         <div class="card bg-primary text-white">
    //                             <div class="card-body p-2">
    //                                 <h5 class="card-title">1/29/2021</h5>
    //                                 <img src="http://openweathermap.org/img/w/01d.png">
    //                                 <p class="card-text">Temp: 38.55 °F</p>
    //                                 <p class="card-text">Humidity: 63%</p>
    //                             </div>
    //                         </div>
    //                     </div>

    showSearchHistory()

})