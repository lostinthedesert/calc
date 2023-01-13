$(document).ready(function() {

    if(!location.hash){
        const object = {
            dataID: "calculator",
            dataClass: "home-link",
            href: "home"
        }
        updatePushState(object);
    }

    const hash = location.hash.slice(1);
    const newHash = hash.slice(0, 13);
    const skipHash = hash.slice(-2);
    if(hash == "home"){
        const object = {
            dataID: "calculator",
            dataClass: "home-link",
            href: "home"
        }
        updatePushState(object);
    }
    if(hash == "get_post"){
        skip = 0;
        const object = {
            dataID: "posts", 
            dataClass: "post-link", 
            href: "get_post", 
            skip: 0
        }
        getPost();
        updatePushState(object);
    }
    if(hash == "getAirQuality"){
        const object = {
            dataID: "air-quality",
            href: "getAirQuality",
            dataClass: "air-quality-link"
        }
        getAirQuality();
        updatePushState(object);
    }
    if(newHash == "get_post?skip"){
        skip = parseInt(skipHash);
        const object = {
            "href": hash,
            "dataID": "posts",
            "dataClass": "post-link",
            "skip": skip
        }
        getPost(object);
        updatePushState(object);
    }

    $("a").click(buildElementObject);

    window.onpopstate = (e) => {
        if(e.state){
            e.state.isPop = true;
            console.log(e.state);
            runSwitchStatement(e.state);
        }
        else{
            console.log('popstate fired but no state object');
        }
    }
})

function updatePushState(obj){
    const url = `#${obj.href}`;
    window.history.pushState(obj, "", url);
}


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
            if(postLoaded && !object.newPost){
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
            if(!object.isPop){
                skip += 10;
                object.skip = skip;
                object.href = `get_post?skip=${skip}`;
                updatePushState(object);
            } 
            else{
                skip = object.skip;
            }
            let nextLoaded = $(`#ten-posts${object.skip}`).attr("class");
            if(nextLoaded){
                runDOMRoutineForSkip(object);
            }
            else{
                getPost(object);
            }
            break;
        case "previous-ten":
            if(!object.isPop){
                skip -= 10;
                object.skip = skip;
                object.href = `get_post?skip=${skip}`;
                updatePushState(object);
            }
            else{
                skip = object.skip;
            }
            let previousLoaded = $(`#ten-posts${object.skip}`).attr("class");
            if(previousLoaded){
                runDOMRoutineForSkip(object);
            }
            else{
                getPost(object);
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

function runDOMRoutineForSkip(object){
    $(".selected").removeClass("selected");
    $(`.posts`).addClass("selected");
    $(".ten-posts").css("display", "none");
    $(`#ten-posts${object.skip}`).css("display", "");
    if(object.ID == "previous-ten"){
        $("#next-ten").removeClass("hidden");
    }
    else{
        $("#previous-ten").removeClass("hidden");
    }
    // $("#previous-ten").removeClass("hidden");
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



// see postSomething.js and aqiPage.js in this directory for all other switch statement endpoints
