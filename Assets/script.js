$(document).ready(function() {
    // Click listeners
    $('#search-btn').on("click", function() {
        var searchVal = $('#search-val').val()

        // clear search
        $('#search-val').val("")
    })


    // variables needed to create today's searched city forecast
    var card = $('<div>').addClass("card")
    var cardBody = $('<div>').addClass("card-body");






    $.ajax(
        {
            url: queryURL,
            method: 'GET'
        }
    )
})