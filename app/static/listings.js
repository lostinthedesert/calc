function getListings(object = {"dataID": "listings"}){
    $.ajax("/tv_listings")
    
    .then(result => {
        hideAndDisplayPages(object); 
        update_listings(result)
    })
    .catch(error => 
        console.error(`There was an error: ${error}`));
}

function update_listings(data){
   
    $("#listing").html("");

    for(var i = 0; i < data.length; i++){
        var newListing = $("#listing-template").clone();
        $("#listings").append(newListing);
        // newListing.addClass("listings");
        newListing.attr("id", `listing${i}`);
        if (days.includes(data[i])) {
            $(`#listing${i}`).addClass("day");
        }
        else if (!data[i].includes(',')){
            $(`#listing${i}`).addClass("title");
        }
        else{
            $(`#listing${i}`).addClass("listing");
        }
        $(`#listing${i}`).html(data[i]);
    
    }
}

var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
]