function getListings(object = {"dataID": "tv-listings"}){
    $.ajax("/tv_listings")
    
    .then(result => {
        hideAndDisplayPages(object); 
        update_listings(result)
    })
    .catch(error => 
        console.error(`There was an error: ${error}`));
}

function update_listings(data){
    for(var i = 0; i < data.length; i++){
        var newListing = $(".listing-template").clone();
        newListing.removeClass("listing-template").addClass("listing");
        newListing.attr("id", `listing${i}`);
        $(`#listing${i}`).append(data[i]);
        
    }
}