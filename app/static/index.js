$(document).ready(function() {

    $("a").click(buildElementObject);

})

// var skip = 0;

function buildElementObject(e){
    e.preventDefault();

    var elementObject = {
        "dataID": $(this).data("id"),
        "dataClass": $(this).data("class")
    }

    if($(this).data("post-number")){
        elementObject.postNumber = $(this).data("post-number");
    }
            
    if($(this).data("index") >= 0){
        elementObject.index = $(this).data("index");
    }

    hideAndDisplayPages(elementObject);
}

function hideAndDisplayPages(object){
    $(".selected").removeClass("selected");
    $(`.${object.dataID}`).addClass("selected");
    
    runSwitchStatement(object);
}

function runSwitchStatement(object){
    switch(object.dataClass){
        case "home-link":
            resetCalculatorAndPostForms();
            break;
        case "post-link":
            skip = 0;
            getTenPosts(skip);
            break;
        case "next-ten":
            skip += 10;
            getTenPosts(skip);
            break;
        case "previous-ten":
            skip -= 10;
            getTenPosts(skip);
            break;
        case "comment":
            getSinglePostComments(object.postNumber, object.index);
            break;
        case "reply":
            renderReplyFormHTML(object.index, object.postNumber);
            break;
        case "toggle":
            $(`#comments${object.index}`).toggle();
            break;
        case "air-quality-link":
            get_air_quality();
    }
}

function resetCalculatorAndPostForms(){
    $("#answer").html("");
    $("#calculator-form").trigger("reset");
    $("#post-form").trigger("reset");
}

$("#calculator-form").submit(function(e){
    e.preventDefault();
    var everclear = $("#everclear").val();
    var intEverclear = parseFloat(everclear);
    var final = $("#final").val();
    var intFinal = parseFloat(final);
    var volume = $("#volume").val();
    var intVolume = parseFloat(volume);
    var answer = (intVolume * intFinal) / intEverclear;
    $("#results").addClass("selected");
    $("#answer").html(answer);
})


// see postSomething.js and aqiPage.js in this directory for all other switch statement endpoints
