$( document ).ready(function() {
    var DateTime = luxon.DateTime
    var currentDate = DateTime.local()
    var currentDateString = currentDate.toLocaleString(DateTime.DATE_SHORT)
    var currentDayDiv = $('#current-day')
    var searchCityInput = $('#search-city')
    var forecastRow = $('#forecast-row')

    // Create click listener for 'search' button
    $('#search-btn').on("click", function() {
        var city = searchCityInput.val()
        saveSearchRecord(city)
        showSearchHistory()
        searchWeather(city)

        // clear search
        searchCityInput.val("")
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
            success: searchWeatherUV
        })
    }

    function searchWeatherUV(data) {
        var coord = data.city.coord
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/onecall",
            data: {
                lat: coord.lat,
                lon: coord.lon,
                appid: "6617c4c00e3f102ebf0972604493763d",
                units: "imperial"
            },
            success: (uvData) => {
                parseWeatherData({...data, ...uvData})
            }
        })
    }

    function parseWeatherData(data) {
        // TODO: Data needs to include city, the current date, an icon that represents the current
        // weather condition, temp, humidity, wind speed, and UV index
        // UV Index number should have a box around it that changes color, depending on the value
        var uvIndex = data.current.uvi
        var uvClass = 'btn btn-success'
        if (uvIndex >= 7) {
            uvClass = 'btn btn-danger'
        } else if (uvIndex >= 3 && uvIndex < 7){
            uvClass = 'btn btn-warning'
        }
        var currentDayData = {
            title: `${data.city.name} (${currentDateString})`,
            icon: data.current.weather[0].icon,
            infoList: [
                {
                    title: 'Temperature',
                    value: `${data.current.temp} ºF`,
                    class: null
                },
                {
                    title: 'Humidity',
                    value: `${data.current.humidity} %`,
                    class: null
                },
                {
                    title: 'Wind Speed',
                    value: `${data.current.wind_speed} MPH`,
                    class: null
                },
                {
                    title: 'UV Index',
                    value: uvIndex,
                    class: uvClass
                },
            ]
        }
        showCurrentDay(currentDayData)

        forecastRow.empty()
        data.daily.slice(1, 6).forEach(element => {
            var forecastData = {
                title: `${DateTime.fromMillis(element.dt * 1000).toLocaleString(DateTime.DATE_SHORT)}`,
                icon: element.weather[0].icon,
                infoList: [
                    {
                        title: 'Temp',
                        value: `${element.temp.day} ºF`
                    },
                    {
                        title: 'Humidity',
                        value: `${element.humidity} %`
                    }
                ]
            }
            showDailyForecast(forecastData)
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

    function showCurrentDay(currentDayData) {
        currentDayDiv.empty()

        // Create 'card' class for today's weather data
        var cardContainer = $('<div>', {class: 'card'})
        var currentCardBodyDiv = $('<div>', {class: 'card-body'})
        var currentDayTitle = $('<h3>', {id: 'current-day-card-title'})
        var currentDayIcon = $("<img>").attr("src", "http://openweathermap.org/img/w/" + currentDayData.icon + ".png")

        cardContainer.append(currentCardBodyDiv)
        currentCardBodyDiv.append(currentDayTitle)

        currentDayTitle.text(currentDayData.title)
        currentDayTitle.append(currentDayIcon)

        currentDayData.infoList.forEach(element => {
            var cardTextP = $('<p>', {class: 'card-text'})
            var cardTextSpan = $('<span>', {class: element.class})

            cardTextP.text(`${element.title}: `)
            cardTextSpan.text(element.value)

            cardTextP.append(cardTextSpan)
            currentCardBodyDiv.append(cardTextP)
        });

        currentDayDiv.append(cardContainer)
    }

    function showDailyForecast(forecastData) {
        // Create a 'card' class for the 5 day forecast
        //  - Data needs to include the following 5 dates, an icon representing the weather condition on each day, temp, and humidity
        var columnDiv = $('<div>', {class: 'col-md-2'})
        var forecastCardDiv = $('<div>', {class: 'card bg-primary text-white'})
        var forecastCardBodyDiv = $('<div>', {class: 'card-body p-2'})
        var forecastCardTitle = $('<h5>', {class: 'card-title'})
        var forecastImg = $("<img>").attr("src", "http://openweathermap.org/img/w/" + forecastData.icon + ".png")

        columnDiv.append(forecastCardDiv)
        forecastCardDiv.append(forecastCardBodyDiv)
        forecastCardBodyDiv.append(forecastCardTitle)

        forecastCardTitle.text(forecastData.title)
        forecastCardTitle.append(forecastImg)

        forecastData.infoList.forEach(element => {
            var forecastTextP = $('<p>', {class: 'card-text'})
            forecastTextP.text(`${element.title}: ${element.value}`)
            forecastCardBodyDiv.append(forecastTextP)
        })

        forecastRow.append(columnDiv)
    }

    showSearchHistory()

})