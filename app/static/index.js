var skip = 0;
var index = null;

var commentForm = 
    `<form id='comment-form${index}' class='comment-form' autocomplete='off'>
    <textarea class='textarea' type='textarea' id='reply' rows='10' cols='50' required></textarea>
    <button type='submit'>Add comment</button><br>
    </form>`;

function getTenPosts(skip){
    $.ajax("/get_post?skip="+skip,{
        type: 'GET',
        success: function(data){
            tearDownPostsAndResetSkipLinks();
            parseTenPosts(data);
            addEventHanldersForNewLinks();
            createSkipPageLinksAndRules(data);
        }})};

function tearDownPostsAndResetSkipLinks(){
    $(".ten-posts").html("");
    $(".hidden").removeClass("hidden");
}

function parseTenPosts(data){
    const posts = data;
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

function createSkipPageLinksAndRules(data){
    const posts = data;
    $("#next-tenLink").html("<a href='' id='next-ten'>Next 10 posts</a>");
    $("#previous-tenLink").html("<a href='' id='previous-ten'>Previous 10 posts</a> | ")
    if(skip == 0){
        $("#previous-tenLink").addClass("hidden");
    }
    if(posts.length < 10){
        $("#next-tenLink").addClass("hidden");
    }
    try{
        if(posts[9].id == 1){
        $("#next-tenLink").addClass("hidden");
        }
    }
    catch(err){};
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

function parseComments(data, index){
    const comments=data;
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

function handleClickEvent(e){
    e.preventDefault();
    
    $(".selected").removeClass("selected");
    const newClass=$(this).data("id");
    $(`.${newClass}`).addClass("selected");
    
    $("#answer").html("");
    $("#form").trigger("reset");
    $("#post-form").trigger("reset");
    $("#comment-form").trigger("reset");
    $('.comment-id').remove();
    
    const linkIdentifier = $(this).data("class");

    switch(linkIdentifier){
        case "postLink":
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
    }
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
    const TITLE=$("#title").val().trim();
    if(TITLE == ""){
        $("#title").val("");
        $("#title").focus();
        return false;
    }
    const CONTENT=$("#content").val().trim();
    if(CONTENT == ""){
        $("#content").val("");
        $("#content").focus();
        return false;
    }
    const post = JSON.stringify({"title":TITLE, "content": CONTENT});
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
            // $(`#comments${index}`).html("");
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

function wireUpClickEvents(){
    $("#homeLink").click(handleClickEvent);
    $("#postsLink").click(handleClickEvent);
    $("#next-tenLink").click(handleClickEvent);
    $("#previous-tenLink").click(handleClickEvent);
}

$(document).ready(function() {
    
    wireUpClickEvents();

// CALCULATOR FORM  
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
    });})