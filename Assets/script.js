$(document).ready(function() {
    // Create click listener for 'search' button
    $('#search-btn').on("click", function() {
        var city = $('#search-city').val()
        getForecast(city)

        // clear search
        $('#search-val').val("")
    })

    // Retrieve the forecast for the city entered in search bar
    function getForecast(city) {
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast",
            data: {
                q: city,
                appid: "6617c4c00e3f102ebf0972604493763d",
                unit: "imperial"
            },
            success: function(data) {
                console.log("data", data);
            }
        })
    }

    // Create list of cities entered in search bar
        // append new entries to the bottom of the list


    // Create 'card' class for today's weather data
        // Data needs to include city, the current date, an icon that represents the current weather condition, temp, humidity, wind speed, and UV index
            // UV Index number should have a box around it that changes color, depending on the value

    // Create a 'card' class for the 5 day forecast
        // Data needs to include the following 5 dates, an icon representing the weather condition on each day, temp, and humidity
})
