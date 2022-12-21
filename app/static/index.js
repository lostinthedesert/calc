$(document).ready(function() {

    $("a").click(buildElementObject);

})

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

    runSwitchStatement(elementObject);
    
}

function runSwitchStatement(object){
    switch(object.dataClass){
        case "home-link":
            resetCalculatorAndPostForms(object);
            break;
        case "post-link":
            skip = 0;
            getTenPosts(skip, object);
            break;
        case "next-ten":
            skip += 10;
            getTenPosts(skip, object);
            break;
        case "previous-ten":
            skip -= 10;
            getTenPosts(skip, object);
            break;
        case "comment":
            getSinglePostComments(object.postNumber, object.index);
            break;
        case "reply":
            renderReplyFormHTML(object.index, object.postNumber);
            break;
        case "toggle":
            $(`#comments${object.index}`).css("display","none");
            $(`#toggle-link${object.index}`).css("display","none");
            break;
        case "air-quality-link":
            get_air_quality(object);
    }
}

function resetCalculatorAndPostForms(object){
    $("#answer").html("");
    $("#calculator-form").trigger("reset");
    $("#post-form").trigger("reset");
    hideAndDisplayPages(object);
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
