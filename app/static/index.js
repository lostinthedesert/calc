var skip = 0;
var index = null;

var commentForm = 
    `<form id='comment-form${index}' class='comment-form' autocomplete='off'>
    <textarea class='textarea' type='textarea' id='reply' rows='10' cols='50' required></textarea>
    <button type='submit'>Add comment</button><br>
    </form>`;

$(document).ready(function() {
    
    wireUpClickEvents();
})

function wireUpClickEvents(){
    $("#home-link").click(handleClickEvent);
    $("#posts-link").click(handleClickEvent);
    $("#next-ten-link").click(handleClickEvent);
    $("#previous-ten-link").click(handleClickEvent);
    $("#air-quality").click(handleClickEvent);
}

$("#form").submit(function(e){
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

function handleClickEvent(e){
    e.preventDefault();


    // debugger

    //e.currentTarget.attributes[0]
    
    const newClass = $(this).data("id");
    hideAndDisplayPages(newClass);
    
    const linkIdentifier = $(this).data("class");

    switch(linkIdentifier){
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
            var id = $(this).data("post-number");
            var index = $(this).data("index");
            getSinglePostComments(id, index);
            break;
        case "reply":
            var index = $(this).data("index");
            var id = $(this).data("post-number");
            renderReplyFormHTML(index, id);
            $(`#comment-form${index}`).submit(function(e){
                e.preventDefault();
                commentSubmit(index);
            })
            break;
        case "toggle":
            var index = $(this).data("index");
            $(`#comments${index}`).toggle();
            break;
        case "air-quality-link":
            get_air_quality();
    }
}

function hideAndDisplayPages(newClass){
    $(".selected").removeClass("selected");
    $(`.${newClass}`).addClass("selected");
}

function resetCalculatorAndPostForms(){
    $("#answer").html("");
    $("#form").trigger("reset");
    $("#post-form").trigger("reset");
}

function getTenPosts(skip){
    $.ajax("/get_post?skip="+skip,{
        type: 'GET',
        success: function(data){
            tearDownPostsAndResetSkipLinks();
            parseTenPosts(data);
            addEventHanldersForNewLinks();
            createSkipPageLinks();
            setPreviousLinkDisplay();
            setNextLinkDisplay(data);
        }})};

function tearDownPostsAndResetSkipLinks(){
    $(".ten-posts").html("");
    $(".hidden").removeClass("hidden");
}

function parseTenPosts(posts){
    for(var i = 0; i < posts.length; i++){
        renderTenPostsHTML(i, posts);
    }
}

function renderTenPostsHTML(i, posts){
    $(".ten-posts").append("<div class='border'></div>");
    $(".ten-posts").append(`<div class='top-post' id='post${i}'></div>`);
    const date = new Date(posts[i].created_at);
    const created_at = date.toLocaleString();
    $(`#post${i}`).append(
        `<div class='title-date'><span class='title'>${posts[i].title}</span> | <span class='date'>${created_at}</span></div>`);
    $(`#post${i}`).append(`<div class='content'>${posts[i].content}</div>`);
    $(`#post${i}`).append(`<div class='comment-reply-link' id='comment-reply-link${i}'></div>`);
    $(`#comment-reply-link${i}`).append(`<span id='link${i}'></span>`);
    $(`#link${i}`).append(`<a id='comment-link${i}' class='comment-link' data-index='${i}' data-id='posts' data-class='comment' data-post-number='${posts[i].id}' href=''>Comments</a>`);
    $(`#comment-reply-link${i}`).append(` | <a id='reply-link${i}' class='reply' data-index='${i}' data-id='posts' data-class='reply' data-post-number='${posts[i].id}' href=''>Reply</a>`);
    $(`#post${i}`).append(`<div class='reply-form hidden' id='reply-form${i}'></div>`);
}

function addEventHanldersForNewLinks(){
    $(".comment-link").click(handleClickEvent);
    $(".reply").click(handleClickEvent);
}

function createSkipPageLinks(){
    $("#next-ten-link").html("<a href='' id='next-ten'>Next 10 posts</a>");
    $("#previous-ten-link").html("<a href='' id='previous-ten'>Previous 10 posts</a> | ");
}

function setPreviousLinkDisplay(){
    if(skip == 0){
        $("#previous-ten-link").addClass("hidden");
    }
}

function setNextLinkDisplay(posts){
    if(posts.length < 10){
        $("#next-ten-link").addClass("hidden");
    }
    try{
        if(posts[9].id == 1){
        $("#next-ten-link").addClass("hidden");
        }
    }
    catch(err){
        console.log("error in set next link display")
    };
}

function getSinglePostComments(id, index){
    $.ajax("/get_single/"+id,{
        type: 'GET',
        error: function(xhr){
            if(xhr.status==404){
                return false;
            }},
        success: function(data){
            tearDownAndSetUpCommentSecion(index);
            parseComments(data, index); 
            addToggleToCommentLink(index);           
        }})};

function tearDownAndSetUpCommentSecion(index){
    $(`#comments${index}`).remove();
    $(`#post${index}`).append(`<div class='comments' id='comments${index}'></div>`);
}

function parseComments(comments, index){
        for(var i = 0; i < comments.length; i++){
            renderCommentsHTML(comments, index, i);
        }
}

function renderCommentsHTML(comments, index, i){
    $(`#comments${index}`).append(`<div class='comment' id='comment${index}-${i}'></div>`);
    const date = new Date(comments[i].created_at);
    const created_at = date.toLocaleString();
    $(`#comment${index}-${i}`).append(`<div class='comment-date'>${created_at}</div>`);
    $(`#comment${index}-${i}`).append(`<div class='comment-content'>${comments[i].content}</div>`);
}

function addToggleToCommentLink(index){
    $(`#link${index}`).html(`<a id='toggle-link${index}' data-id='posts' data-class='toggle' data-index='${index}' href=''>Comments</a>`);
    $(`#toggle-link${index}`).click(handleClickEvent);
}

$("#post-form").submit(function(e){
    e.preventDefault();
    const post = validatePostInputs();
    $.ajax("/create_post",{
        type: 'POST',
        contentType:'application/json',
        data: post,
        success: function(){
            $("#post-form").trigger("reset");
            // $(".ten-posts").html("");
            getTenPosts(0);  
        }});})

function validatePostInputs(){
    const title = $("#title").val().trim();
    if(title == ""){
        $("#title").val("");
        $("#title").focus();
        return false;
    }
    const content = $("#content").val().trim();
    if(content == ""){
        $("#content").val("");
        $("#content").focus();
        return false;
    }
    return convertPostDataToJSON(title, content);
}

function convertPostDataToJSON(title, content){
    const post = JSON.stringify({"title":title, "content": content});
    return post;
}

function commentSubmit(index){
    const comment = validateCommentInput();
    $.ajax("/create_comment",{
        type: 'POST',
        contentType: 'application/json',
        data: comment,
        success: function(data){
            $(`#comment-form${index}`).trigger("reset");
            getSinglePostComments(data, index);
        }
    })
}

function validateCommentInput(){
    const content = $("#reply").val().trim();
    if(content == ""){
        $("#reply").val("");
        $("#reply").focus();
        return false;
    }
    return convertCommentDataToJSON(content);
}

function convertCommentDataToJSON(content){
    const commentId = $("#comment-id").val();
    $(".comment-id").remove();
    const comment = JSON.stringify({"content":content, "comment_id": commentId});
    return comment;
}

function renderReplyFormHTML(index, id){
    $(".comment-form").remove();
    $(`#reply-form${index}`).removeClass("hidden");
    $(`#reply-form${index}`).html(commentForm);
    $(`#comment-formnull`).attr("id", `comment-form${index}`);
    $(`#comment-form${index}`).append(`<input class='hidden' id='comment-id' value='${id}'>`);
}

function get_air_quality(){
    $.ajax("/air_quality",{
        type: 'GET',
        success: function(data){
            console.log(data);
            add_rows_to_aqi_table(data);
        }
    })
}

const tableHeader = `
    <tr>
        <th>Date + time (in hours)</th>
        <th>City, State</th>
        <th>AQI</th>
        <th>Category</th>
    </tr>`;

function add_rows_to_aqi_table(data){
    $("#aqi-table").html("");
    $("#aqi-table").append(tableHeader);

    for(var i = 0; i < data.length; i++){
        render_aqi_tables(data, i)
    }
}

function render_aqi_tables(data, i){
    $("#aqi-table").append(
    `<tr>
    <td>${data[i].date} ${data[i].time}:00</td>
    <td>${data[i].city}, ${data[i].state}</td>
    <td>${data[i].aqi}</td>
    <td>${data[i].category}</td>
    </tr>`);
}