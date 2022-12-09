// switch statement for links on this page and relevant variables are located in index.js in this directory

var index = null;

var commentForm = 
    `<form id='comment-form${index}' class='comment-form' autocomplete='off'>
    <textarea class='textarea' type='textarea' id='reply' rows='10' cols='50' required></textarea>
    <button type='submit'>Add comment</button> <button type='button' id='cancel-comment${index}'>Cancel</button><br>
    </form>`;

// display posts functions begin here

function getTenPosts(skip){
    $.ajax("/get_post?skip="+skip,{
        type: 'GET',
        error: function(xhr){ 
            console.log("Error code: "+ xhr.status);
        },
        success: function(data){
            tearDownPostsAndResetSkipLinks(data);
        }
    })
}

function tearDownPostsAndResetSkipLinks(data){
    $(".ten-posts").html("");
    $("#post-error").remove();
    $(".hidden").removeClass("hidden");
    
    parseTenPosts(data);
}

function parseTenPosts(posts){
    for(var i = 0; i < posts.length; i++){
        renderTenPostsHTML(i, posts);
    }
    
    addEventHanldersForNewLinks(posts);
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

function addEventHanldersForNewLinks(data){
    $(".comment-link").click(buildElementObject);
    $(".reply").click(buildElementObject);
    
    createSkipPageLinks(data);
}

function createSkipPageLinks(data){
    $("#next-ten-link").html("<a href='' id='next-ten' data-id='posts' data-class='next-ten'>Next 10 posts</a>");
    $("#previous-ten-link").html("<a href='' id='previous-ten' data-id='posts' data-class='previous-ten'>Previous 10 posts</a> | ");
    
    createSkipPageListeners(data);
}

function createSkipPageListeners(data){
    $("#next-ten").click(buildElementObject);
    $("#previous-ten").click(buildElementObject);
    
    setPreviousLinkDisplay();
    
    setNextLinkDisplay(data);
}

function setPreviousLinkDisplay(){
    if(skip == 0){
        $("#previous-ten-link").addClass("hidden");
    }
}

function setNextLinkDisplay(posts){
    if(posts.length < 10 || posts[9].id == 1){
        $("#next-ten-link").addClass("hidden");
    }
}

// single post comment section build out starts here

function getSinglePostComments(id, index){
    $.ajax("/get_single/"+id,{
        type: 'GET',
        error: function(xhr){ 
            console.log("error code: "+ xhr.status);
        },
        success: function(data){
            tearDownAndSetUpCommentSecion(index, data);            
        }
    })
}

function tearDownAndSetUpCommentSecion(index, data){
    $(`#comments${index}`).remove();
    $(`#error-div${index}`).remove();
    $(`#post${index}`).append(`<div class='comments' id='comments${index}'></div>`);
    
    parseComments(index, data);
}

function parseComments(index, comments){
    for(var i = 0; i < comments.length; i++){
        renderCommentsHTML(comments, index, i);
    }
        
    addToggleToCommentLink(index);
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

// add new post functions begins here

$("#post-form").submit(function(e){
    e.preventDefault();
    
    validatePostInputs();
})

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
    
    convertPostDataToJSON(title, content);
}

function convertPostDataToJSON(title, content){
    const post = JSON.stringify({"title":title, "content": content});
    
    sendPost(post);
}

function sendPost(post){
    $.ajax("/create_post",{
        type: 'POST',
        contentType:'application/json',
        data: post,
        error: function(xhr){
            handleSendPostError(xhr);
        },
        success: function(){
            $("#post-form").trigger("reset");
            
            getTenPosts(0);  
        }
    })
}

function handleSendPostError(xhr){
    $("#create-post").append("<div id='post-error'></div>");
    if (xhr.status == 500){
        $("#post-error").html("Failed to post. Comment may be too long");
        console.log("Error code: " + xhr.status);
    }
    else{
        $("#post-error").html("Failed to post. Possible 404 not found");
        console.log("Error code: " + xhr.status);
    }
}

// reply form and adding comments to single posts begin here

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
        
        validateCommentInput(index);
    })
}

function validateCommentInput(index){
    const content = $("#reply").val().trim();
    if(content == ""){
        $("#reply").val("");
        $("#reply").focus();
        
        return false;
    }
    
    convertCommentDataToJSON(content, index);
}

function convertCommentDataToJSON(content, index){
    const commentId = $("#comment-id").val();
    $(".comment-id").remove();
    const comment = JSON.stringify({"content":content, "comment_id": commentId});
    
    sendComment(comment, index);
}

function sendComment(comment, index){
    $.ajax("/create_comment",{
        type: 'POST',
        contentType: 'application/json',
        data: comment,
        error: function(xhr){
            handleSendCommentError(index, xhr);
        },
        success: function(data){
            $(`#comment-form${index}`).trigger("reset");
            
            getSinglePostComments(data, index);
        }
    })
}

function handleSendCommentError(index, xhr){
    $(`#reply-form${index}`).append(`<div id='error-div${index}'></div>`);
    
    if (xhr.status == 500){
        $(`#error-div${index}`).html("Failed to post. Comment may be too long");
        console.log("Error code: " + xhr.status);
    }
    else{
        $(`#error-div${index}`).html("Failed to post. Possible 404 not found");
        console.log("Error code: " + xhr.status);
    }
}

function createCommentCancelListener(index){
    $(`#cancel-comment${index}`).click(function(e){
        e.preventDefault();
        
        $(".comment-form").remove();
    })
}