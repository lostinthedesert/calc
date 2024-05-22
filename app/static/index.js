$(document).ready(function() {

    getLoader(hashReader);    

    $("a").click(buildElementObject);

})

// page loading animation diplays over the default homepage, allows any existing URL hash to be read and correct page loaded from server. this function is only called on page refreshes
function getLoader(cbFunc){
    $("#loader").removeClass("hidden");
    setTimeout(hideLoader, 1200);
    cbFunc();
}

function hideLoader(){
    $("#loader").addClass("hidden");
    $(".main").removeClass("hidden");
}

//  this is the callback function invoked upon page refreshes, it sets/reads the URL hash and replaces the existing push state with the correct state object and also calls the appropriate endpoint on the server to reload a page from scratch (if necessary).
function hashReader(){
    if(!location.hash){
        notHash();
    }

    else{
        const hashObject = parseHash();
        if(hashObject.hash == "home"){
            const object = {
                dataID: "calculator",
                dataClass: "home-link",
                href: "home"
            }
            replaceState(object);
        }
        if(hashObject.hash == "get_post"){
            skip = 0;
            const object = {
                dataID: "posts", 
                dataClass: "post-link", 
                href: "get_post", 
                skip: 0
            }
            getPost();
            replaceState(object);
        }
        if(hashObject.hash == "getAirQuality"){
            const object = {
                dataID: "air-quality",
                href: "getAirQuality",
                dataClass: "air-quality-link"
            }
            getAirQuality();
            replaceState(object);
        }
        if(hashObject.newHash == "get_post?skip"){
            skip = parseInt(hashObject.skipHash);
            const object = {
                "href": hashObject.hash,
                "dataID": "posts",
                "dataClass": "post-link",
                "skip": skip
            }
            getPost(object);
            replaceState(object);
        }
        if(hashObject.hash == "getListings"){
            const object = {
                dataID: "listings",
                href: "getListings",
                dataClass: "listing-link"
            }
            getListings();
            replaceState(object);
        }
    }
}

// this will add a URL hash upon first visiting the homepage and replace the state object for home
function notHash(){
    const object = {
        dataID: "calculator",
        dataClass: "home-link",
        href: "home"
    } 
    replaceState(object);
}

// this function reads the existing URL hash and creates an object with the parsed data from the hash. that object is then returned to the hash reader function where properties are used to invoke server call functions and create push states.
function parseHash(){
    const hash = location.hash.slice(1);
    const newHash = hash.slice(0, 13);
    const skipHash = hash.slice(14 - hash.length)
    
    const hashObject = {
        'hash': hash,
        'newHash': newHash,
        'skipHash': skipHash
    }
    return hashObject;
}

function replaceState(object){
    const url = `#${object.href}`;
    window.history.replaceState(object, "", url);
}

// create an object using attributes from link elements. to be used in calling server, setting push states
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
}

// direct traffic of all clicks. determines the destination of a click and check how to get there depending if the page already exists in the DOM. if not, sends object data to functions to make AJAX call.
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
            // unhide element if data has already been requested from server in current session
            // use the following target to determine if the element exists in the DOM
            let postLoaded = $(`#ten-posts0`).attr("class");
            if(postLoaded){
                runDOMRoutineForPosts();
            }
            else{
                getPost(object);
            }
            // if this click event was triggered by clicking a link, add a new push state to the stack, otherwise don't (in the case of navigating to this point using the browser arrows)
            if(!object.isPop){
                updatePushState(object);
            }
            break;
        case "next-ten":
            // if the next ten link was clicked, update the running global skip value, otherwise (pop state event), do not update.
            if(!object.isPop){
                skip += 10;
                object.skip = skip;
                object.href = `get_post?skip=${skip}`;
                updatePushState(object);
            } 
            // set the global running skip value to the current push state object's skip value
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
            // see above for explanation of isPop condition
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
        case "listing-link":
            let listingLoaded = $("listing0").attr("id");
            if(listingLoaded){
                runDOMRoutineForListing();
            }
            else{
                getListings(object);
            }
            if(!object.isPop){
                updatePushState(object);
            }
    }
}

// how to handle popstate events (ie browser arrows being clicked)
window.onpopstate = (e) => {
    // if a pushstate object exists in the stack, add an isPop boolean value (true) to the object and run the switch function for click events passing the state object as an argument (state objects were created when the page was first loaded)
    if(e.state){
        e.state.isPop = true;
        runSwitchStatement(e.state);
    } 
    else{
        console.log('popstate fired but no state object');
    }
}

// push state objects created from element objects when links are clicked/pages loaded
function updatePushState(obj){
    const url = `#${obj.href}`;
    window.history.pushState(obj, "", url);
}

function resetCalculatorAndPostForms(object){
    $("#answer").html("");
    $("#calculator-form").trigger("reset");
    $("#post-form").trigger("reset");
    hideAndDisplayPages(object);
}

// process to execute when an element already exists in the DOM for a particular page, in the event of using back/forward arrows or renavigating to a page that was already loaded in this session
function runDOMRoutineForPosts(){
    $(".selected").removeClass("selected");
    $(`.posts`).addClass("selected");
    $("#previous-ten").addClass("hidden");
    $(".ten-posts").css("display", "none");
    $("#ten-posts0").css("display", "");
}

// run process for unhiding loaded pages in posts after skip = 0.
function runDOMRoutineForSkip(object){
    $(".selected").removeClass("selected");
    $(`.posts`).addClass("selected");
    $(".ten-posts").css("display", "none");
    $(`#ten-posts${object.skip}`).css("display", "");
    // check to make sure displayed posts are not the end of existing posts. if not, display the next ten link, otherwise hide it.
    if(fullTenPosts(object)){
        $("#next-ten").removeClass("hidden");
    }
    else{
        $("#next-ten").addClass("hidden");
    }
    // if the page was arrived at by clicking the previous ten link, make sure next ten link is unhidden.
    if(object.ID == "previous-ten"){
        $("#next-ten").removeClass("hidden");
    }
    // else display previous ten link (as next ten was used to arrive at this point)
    else{
        $("#previous-ten").removeClass("hidden");
    }
    // if the destination page is skip = 0, hide previous ten link
    if(object.skip == 0){
        $("#previous-ten").addClass("hidden");
    }
    // update the skip link elements with the new skip value and href value
    $(".skip-links").attr("data-skip", object.skip);
    $(".skip-links").attr("href", `get_post?skip=${object.skip}`);
    
}

// this function determines if the posts being displayed are the last posts available in the database. the return values help set the next/previous link displays
function fullTenPosts(object){
    const topPostChildren = $(`#ten-posts${object.skip}`).children(".top-post");
    const topPostLength = topPostChildren.length;
    const topPostEnd = topPostChildren.last().attr("id");
    if(topPostLength < 10 || topPostEnd == "post1"){
        return false;
    }
    else{
        return true
    }
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

function runDOMRoutineForListing(){
    $(".selected").removeClass("selected");
    $('.listing').addClass("selected");
}

// see postSomething.js and aqiPage.js in this directory for all other switch statement endpoints
