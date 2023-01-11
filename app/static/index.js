$(document).ready(function() {

    skip = 0;

    const hash = location.hash.slice(1);
    console.log(hash)
    if(hash == "get_post"){
        // $(".selected").removeClass("selected");
        // $(`.posts`).addClass("selected");
        getPost();
    }
    if(hash == "getAirQuality"){
        // $(".selected").removeClass("selected");
        // $(`.posts`).addClass("selected");
        getAirQuality();
    }

    $("a").click(buildElementObject);

    window.onpopstate = (e) => {
        if(e.state){
            e.state.isPop = true;
            console.log(e.state);
            runSwitchStatement(e.state);
    //         if(e.state.dataClass == "home-link"){
    //             $(".selected").removeClass("selected");
    //             $(`.calculator`).addClass("selected");
    //         }
    //         if(e.state.dataClass == "post-link"){
    //             $(".selected").removeClass("selected");
    //             $(`.posts`).addClass("selected");
    //             $(`.ten-posts`).css("display", "none");
    //             $(`#ten-posts0`).css("display", "");
    //             $("#previous-ten").addClass("hidden");
    //         }    
    //         if(e.state.dataClass == "air-quality-link"){
    //             $(".selected").removeClass("selected");
    //             $(`.air-quality`).addClass("selected");
    //         }
    //         if(e.state.dataClass == "next-ten"){
    //             $(".selected").removeClass("selected");
    //             $(`.posts`).addClass("selected");
    //             $(`.ten-posts`).css("display", "none");
    //             $(`#ten-posts${e.state.skip}`).css("display", "");

    //         }
    //         if(e.state.dataClass == "previous-ten"){
    //             $(".selected").removeClass("selected");
    //             $(`.posts`).addClass("selected");
    //             $(`.ten-posts`).css("display", "none");
    //             $(`#ten-posts${e.state.skip}`).css("display", "");
    //             $("#previous-ten").removeClass("hidden");
    //         }  
        }
    }
})

// $(window).on("unload", function(){
//     const hash = window.location.prop('hash');
//     console.log(hash);
//     console.log("unload event triggered");
// })

function buildElementObject(e){
    e.preventDefault();
    
    var elementObject = {
        "ID": $(this).attr("id"),
        "dataID": $(this).data("id"),
        "dataClass": $(this).data("class"),
        "href": $(this).attr("href"),
        "postNumber": $(this).data("post-number"),
        "skip": $(this).data("skip"),
        "isPop": false
    }
    runSwitchStatement(elementObject);
    
    // window.location.hash = "";
    // const url = window.location + `${elementObject.href}`;
    // window.history.pushState(elementObject, "", url);
    // window.location.hash = `${elementObject.href}`;
    
}

function runSwitchStatement(object){
    switch(object.dataClass){
        case "home-link":
            if(!object.isPop){
                updatePushState(object);
            }
            resetCalculatorAndPostForms(object);
            break;
        case "post-link":
            skip = 0;
            object.skip = skip;
            let postLoaded = $(`#ten-posts0`).attr("class");
            if(postLoaded){
                runDOMRoutineForPosts();
            }
            else{
                getPost(object);
            }
            if(!object.isPop){
                updatePushState(object);
            }
            break;
        case "next-ten":
            skip += 10;
            object.skip = skip;
            let nextLoaded = $(`#ten-posts${object.skip}`).attr("class");
            if(nextLoaded){
                runDOMRoutineForNext(object);
            }
            else{
                getPost(object);
            }
            if(!object.isPop){
                updatePushState(object);
            }
            break;
        case "previous-ten":
            skip -= 10;
            object.skip = skip;
            console.log(object);
            if(!object.isPop){
                updatePushState(object);
            }
            setRulesOnPreviousLinkClick(object);          
            break;
        case "comment":
            object.skip = 0;
            let commentsLoaded = $(`#comments${object.postNumber}`).attr("class");
            if(commentsLoaded){
                runDOMRoutineForComments(object);
            }
            else{
                getPost(object);
            }
            break;
        case "reply":
            renderReplyFormHTML(object);
            break;
        case "toggle":
            $(`#comments${object.postNumber}`).css("display","none");
            $(`#toggle-link${object.postNumber}`).css("display","none");
            break;
        case "air-quality-link":
            let aqiLoaded = $(`#row0`).attr("class");
            if(aqiLoaded){
                runDOMRoutineForAQI();
            }
            else{
                getAirQuality(object);
            }
            if(!object.isPop){
                updatePushState(object);
            }
    }
}

function resetCalculatorAndPostForms(object){
    $("#answer").html("");
    $("#calculator-form").trigger("reset");
    $("#post-form").trigger("reset");
    hideAndDisplayPages(object);
}

function runDOMRoutineForPosts(){
    $(".selected").removeClass("selected");
    $(`.posts`).addClass("selected");
    $("#previous-ten").addClass("hidden");
    $(".ten-posts").css("display", "none");
    $("#ten-posts0").css("display", "");
}

function runDOMRoutineForNext(object){
    $(".ten-posts").css("display", "none");
    $(`#ten-posts${object.skip}`).css("display", "");
    $("#previous-ten").removeClass("hidden");
    $(".skip-links").attr("data-skip", object.skip);
}

function runDOMRoutineForComments(object){
    $(`#comments${object.postNumber}`).css("display","");
    $(`#toggle-link${object.postNumber}`).css("display","");
}

function runDOMRoutineForAQI(){
    $(".selected").removeClass("selected");
    $(`.air-quality`).addClass("selected");
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
    const url = `#${obj.href}`;
    window.history.pushState(obj, "", url);
}


// see postSomething.js and aqiPage.js in this directory for all other switch statement endpoints
