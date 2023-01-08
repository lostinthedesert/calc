$(document).ready(function() {
    $("a").click(buildElementObject);

    // window.onpopstate = (e) => {
    //     if(e.state){
    //         // const object = e.state;
    //         console.log(e.state);
    //         if(e.state.dataClass == "next-ten"){
    //             $(".selected").removeClass("selected");
    //             $(`.${e.state.dataID}`).addClass("selected");
    //             $(`#ten-posts${e.state.skip}`).css("display", "");
    //             $(`#ten-posts${e.state.skip+10}`).css("display", "none");
    //         }
    //         if(e.state.dataClass == "previous-ten"){
    //             $(".selected").removeClass("selected");
    //             $(`.${e.state.dataID}`).addClass("selected");
    //             getPost(e.state);
    //         }
    //         if(e.state.dataClass == "post-link"){
    //             $(".selected").removeClass("selected");
    //             $(`.${e.state.dataID}`).addClass("selected");
    //             $(`#ten-posts${e.state.skip}`).css("display", "");
    //             $(`#ten-posts${e.state.skip+10}`).css("display", "none");
    //             $("#previous-ten").addClass("hidden");
    //         }
    //         if(e.state.dataClass == "air-quality-link"){
    //             $(".selected").removeClass("selected");
    //             $(`.${e.state.dataID}`).addClass("selected");
    //         }
    //         if(e.state.dataClass == "home-link"){
    //             $(".selected").removeClass("selected");
    //             $(`.${e.state.dataID}`).addClass("selected");
    //         }
    //     }
    // }
})

function buildElementObject(e){
    e.preventDefault();
    
    var elementObject = {
        "ID": $(this).attr("id"),
        "dataID": $(this).data("id"),
        "dataClass": $(this).data("class"),
        "href": $(this).attr("href"),
        "postNumber": $(this).data("post-number"),
        "skip": $(this).data("skip")
    }
    console.log(elementObject);
    runSwitchStatement(elementObject);
    
    // window.location.hash = "";
    // const url = window.location + `${elementObject.href}`;
    // window.history.pushState(elementObject, "", url);
    // window.location.hash = `${elementObject.href}`;
    
}

function runSwitchStatement(object){
    switch(object.dataClass){
        case "home-link":
            updatePushState(object);
            resetCalculatorAndPostForms(object);
            break;
        case "post-link":
            skip = 0;
            object.skip = skip;
            let postLoaded = $(`#ten-posts0`).attr("class");
            if(postLoaded){
                $(".selected").removeClass("selected");
                $(`.posts`).addClass("selected");
                $("#previous-ten").addClass("hidden");
                $(".ten-posts").css("display", "none");
                $("#ten-posts0").css("display", "");
            }
            else{
                getPost(object);
            }
            updatePushState(object);
            break;
        case "next-ten":
            skip += 10;
            object.skip = skip;
            let nextLoaded = $(`#ten-posts${object.skip}`).attr("class");
            if(nextLoaded){
                $(".ten-posts").css("display", "none");
                $(`#ten-posts${object.skip}`).css("display", "");
                $(".hidden").removeClass("hidden");
            }
            else{
                getPost(object);
            }
            updatePushState(object);
            break;
        case "previous-ten":
            skip -= 10;
            object.skip = skip;
            updatePushState(object);
            setRulesOnPreviousLinkClick(object);          
            break;
        case "comment":
            object.skip = 0;
            let commentsLoaded = $(`#comments${object.postNumber}`).attr("class");
            if(commentsLoaded){
                $(`#comments${object.postNumber}`).css("display","");
                $(`#toggle-link${object.postNumber}`).css("display","");
            }
            else{
                getPost(object);
            }
            updatePushState(object);
            break;
        case "reply":
            updatePushState(object);
            renderReplyFormHTML(object);
            break;
        case "toggle":
            $(`#comments${object.postNumber}`).css("display","none");
            $(`#toggle-link${object.postNumber}`).css("display","none");
            break;
        case "air-quality-link":
            let aqiLoaded = $(`#row0`).attr("class");
            if(aqiLoaded){
                $(".selected").removeClass("selected");
                $(`.air-quality`).addClass("selected");
            }
            else{
                get_air_quality(object);
            }
            updatePushState(object);
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

function updatePushState(obj){
    window.history.pushState(obj, "", "");
}


// see postSomething.js and aqiPage.js in this directory for all other switch statement endpoints
