$(document).ready(function() {
    $("a").click(buildElementObject);

    // window.onpopstate = () =>{
    //     location.hash = () =>{
    //         const runThis = location.hash;
    //         runThis(0);
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
        "index": $(this).data("index")
    }
    console.log(elementObject);
    runSwitchStatement(elementObject);
    
}

// function updatePushState(obj){
//     window.history.pushState(obj, "", obj.href);
//     console.log(history.state);
//     console.log(location.hash);
// }

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
            getTenPosts(skip, object.index, object);
            break;
        case "previous-ten":
            skip -= 10;
            getTenPosts(skip, object);
            break;
        case "comment":
            getTenPosts(null, object);
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
