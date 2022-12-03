// switch statement for links on this page and relevant variables are located in index.js in this directory

var index = null;

var commentForm = 
    `<form id='comment-form${index}' class='comment-form' autocomplete='off'>
    <textarea class='textarea' type='textarea' id='reply' rows='10' cols='50' required></textarea>
    <button type='submit'>Add comment</button> <button type='button' id='cancel-comment${index}'>Cancel</button><br>
    </form>`;

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
    $(".comment-link").click(buildElementObject);
    $(".reply").click(buildElementObject);
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
    $(`#toggle-link${index}`).click(buildElementObject);
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
    $(`#cancel-commentnull`).attr("id", `cancel-comment${index}`);
    $(`#comment-form${index}`).append(`<input class='hidden' id='comment-id' value='${id}'>`);
    createReplyListener(index);
    createCommentCancelListener(index);
}

function createReplyListener(index){
    $(`#comment-form${index}`).submit(function(e){
        e.preventDefault();
        commentSubmit(index);
    })
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

function createCommentCancelListener(index){
    $(`#cancel-comment${index}`).click(function(e){
        e.preventDefault();
        $(".comment-form").remove();
    })
}