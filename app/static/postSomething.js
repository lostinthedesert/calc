// switch statement for links on this page and relevant variables are located in index.js in this directory

var index = null;

var commentForm = 
    `<form id='comment-form${index}' class='comment-form' autocomplete='off'>
    <textarea class='textarea' type='textarea' id='reply' rows='10' cols='50' required></textarea>
    <button type='submit'>Add comment</button> <button type='button' id='cancel-comment${index}'>Cancel</button><br>
    </form>`;

// display posts functions begin here

function getTenPosts(skip, object = { dataID: "posts", dataClass: "post-link" }){
    $.ajax("/get_post?skip="+skip)

        .then(result => {
            if(object.dataClass != "next-ten" || "previous-ten"){
                hideAndDisplayPages(object);
            }
            return result
        })
        .then(result => {
            tearDownPostsAndResetSkipLinks();
            return result
        })
        .then(result => 
            parseTenPosts(result)
        )
        .then(result => {
            addEventHanldersForNewLinks();
            return result
        })
        .then(result => {
            createSkipPageLinks();
            return result
        })
        .then(result => {
            createSkipPageListeners();
            return result
        })
        .then(result => {
            setPreviousLinkDisplay();
            return result
        })
        .then(result => {
            setNextLinkDisplay(result)
        })
        .catch(error => console.error("An error occurred: ", error.statusText));
}

function hideAndDisplayPages(object){
    $(".selected").removeClass("selected");
    $(`.${object.dataID}`).addClass("selected");
}

function tearDownPostsAndResetSkipLinks(){
    $(".ten-posts").html("");
    $(".hidden").removeClass("hidden");
}

function parseTenPosts(posts){
    for(var i = 0; i < posts.length; i++){
        renderTenPostsHTML(i, posts);
    }
    return posts;
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
    $("#next-ten-link").html("<a href='' id='next-ten' data-id='posts' data-class='next-ten'>Next 10 posts</a>");
    $("#previous-ten-link").html("<a href='' id='previous-ten' data-id='posts' data-class='previous-ten'>Previous 10 posts</a> | ");
    
}

function createSkipPageListeners(){
    $("#next-ten").click(buildElementObject);
    $("#previous-ten").click(buildElementObject);
    
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
    $.ajax("/get_single/"+id)

        .then(result => {
            if(result.length == 0){
                throw new Error("This post has no comments");
            }
            return result
        })
        .then(result => 
            tearDownAndSetUpCommentSecion(index, result)
        )
        .then(result => 
            parseComments(index, result)
        )
        .then(() => {
            addToggleToCommentLink(index);
        })
        .catch(error => console.error(`An error occurred: ${error}`));
}

function tearDownAndSetUpCommentSecion(index, data){
    $(`#comments${index}`).remove();
    $(`#error-div${index}`).remove();
    $(`#post${index}`).append(`<div class='comments' id='comments${index}'></div>`);
    
    return data;
}

function parseComments(index, comments){
    for(var i = 0; i < comments.length; i++){
        renderCommentsHTML(comments, index, i);
    }
    return comments
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
        data: post
    })
        .then(() =>
            $("#post-form").trigger("reset")
        )
        .then(() =>
            getTenPosts(0)
        )
        .catch(error => {console.error("An error occurred: ", error.statusText)});
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
        data: comment
    })
        .then(result => {
            $(`#comment-form${index}`).trigger("reset");
            return result
        })
        .then(result =>
            getSinglePostComments(result, index)
        )
        .catch(error => console.error("An error occurred: ", error.statusText));
}

function createCommentCancelListener(index){
    $(`#cancel-comment${index}`).click(function(e){
        e.preventDefault();
        
        $(".comment-form").remove();
    })
}