// switch statement for links on this page and relevant variables are located in index.js in this directory

// display posts functions begin here. this is the procedure when the server is called for post (message board) data.

function getPost(object = {dataID: "posts", dataClass: "post-link", href: "get_post", "skip": 0}){
    $.ajax(`${object.href}`)
    
        .then(result => {
            if(object.dataClass != "comment"){
                if(result.length == 0){
                    $("#next-ten").addClass("hidden");
                    throw new Error("There are no more posts");
                }
                hideAndDisplayPages(object);
                tearDownPostsAndResetSkipLinks(object);
                parseTenPosts(result, object);
                addEventHanldersForNewLinks();
                setSkipLinkDisplay(result, object.skip);
                setSkipLinkAttributes(object);
            }
            if(object.dataClass == "comment"){
                if(result.length == 0){
                    throw new Error("This post has no comments");
                }
                tearDownAndSetUpCommentSecion(object);
                addHideCommentLink(object);
                parseComments(object, result)
            }
        })
        .catch(error => console.error(`An error occurred: ${error}`));
}

function hideAndDisplayPages(object){
    $(".selected").removeClass("selected");
    $(`.${object.dataID}`).addClass("selected");
}

// use the clone div from the source code to create a new element for each 10 posts requested. give unique ID to each new element based on the posts being displayed.
function tearDownPostsAndResetSkipLinks(object){
    const newTenPosts = $(".ten-posts-template").clone();
    newTenPosts.attr({"id": `ten-posts${object.skip}`, "class": "ten-posts", "style": "display:"})
    $(".ten-posts").css("display", "none");
    // insert new elements before the skip-links div. this ensures new elements are added to the end of the post section of the page as they are requested, not the top.
    const referenceDiv = $("#skip-links");
    newTenPosts.insertBefore(referenceDiv);
    $(".skip-links").removeClass("hidden");
}

// create elements for each post in a group of ten from json data received from server
function parseTenPosts(posts, object){
    for(var i = 0; i < posts.length; i++){
        renderTenPostsHTML(i, posts, object);
    }
}

// assign identifying attributes to each new post element being added to the DOM and it's corresponding sub-links (comments, reply)
function renderTenPostsHTML(i, posts, object){
    const newBorder = $(".clone-border").clone();
    newBorder.removeClass("clone-border").addClass("border");
    newBorder.css("display", "");
    const newPost = $(".top-post-clone").clone();
    newPost.attr("id", `post${posts[i].id}`);
    newPost.removeClass("top-post-clone").addClass(`top-post`);
    newPost.css("display","");
    $(`#ten-posts${object.skip}`).append(newBorder);
    $(`#ten-posts${object.skip}`).append(newPost);
    const date = new Date(posts[i].created_at).toLocaleString();
    $(`#post${posts[i].id} .title`).html(`${posts[i].title}`);
    $(`#post${posts[i].id} .date`).html(`${date}`);
    $(`#post${posts[i].id} .content`).html(`${posts[i].content}`);
    $(`#post${posts[i].id} .comment-link`).attr({'id': `comment-link${posts[i].id}`, 'data-post-number': `${posts[i].id}`, 'href': `get_single/${posts[i].id}`});
    $(`#post${posts[i].id} .reply`).attr({'id': `reply-link${posts[i].id}`, 'data-post-number':`${posts[i].id}`});
    $(`#post${posts[i].id} #toggle-link`).attr({'id': `toggle-link${posts[i].id}`, "data-post-number": `${posts[i].id}`});
    $(`#post${posts[i].id} .reply-form-div`).attr("id", `reply-form-div${posts[i].id}`);
}

//  this function will make sure our new links/click events are visible to the DOM
function addEventHanldersForNewLinks(){
    $(".comment-link").click(buildElementObject);
    $(".reply").click(buildElementObject);
    $(".toggle-link").click(buildElementObject);
}

function setSkipLinkDisplay(posts, skip){
    if(skip == 0){
        $("#previous-ten").addClass("hidden");
    }
    if(posts.length < 10 || posts[9].id == 1){
        $("#next-ten").addClass("hidden");
    }
}

function setSkipLinkAttributes(object){
    $(".skip-links").attr("data-skip", object.skip);
    $(".skip-links").attr("href", `get_post?skip=${object.skip}`);
}

// single post comment section build out starts here. This is the procedure when the comment link is clicked for an individual post.

function tearDownAndSetUpCommentSecion(object){
    $(`#comments${object.postNumber}`).remove();
    const newComments = $(".comments-template").clone();
    newComments.attr("id", `comments${object.postNumber}`);
    newComments.removeClass("comments-template").addClass(`comments`);
    newComments.css("display","");
    $(`#post${object.postNumber}`).append(newComments);
}

function addHideCommentLink(object){
    $(`#toggle-link${object.postNumber}`).css("display","");
}

function parseComments(object, comments){
    for(var i = 0; i < comments.length; i++){
        renderCommentsHTML(object, comments, i);
    }
}

function renderCommentsHTML(object, comment, i){
    const newComment = $(`.comment-template`).clone();
    newComment.removeClass("comment-template").addClass(`comment`);
    newComment.attr("id", `comment${comment[i].id}`);
    newComment.css("display","");
    $(`#comments${object.postNumber}`).append(newComment);
    const date = new Date(comment[i].created_at).toLocaleString();
    $(`#comment${comment[i].id} .comment-date`).html(date);
    $(`#comment${comment[i].id} .comment-content`).html(comment[i].content);
}

// add new post functions begins here. Procedure to follow when a new post form is submitted

$("#post-form").submit(function(e){
    e.preventDefault();
    validatePostInputs();
})

// make sure user's input meets criteria 
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

// if user's input is valid, convert to json object
function convertPostDataToJSON(title, content){
    const post = JSON.stringify({"title":title, "content": content});
    sendPost(post);
}

// send POST request to server to add user's post to database and reload page to show new post
function sendPost(post){
    $.ajax("/create_post",{
        type: 'POST',
        contentType:'application/json',
        data: post
    })
        .then(() =>{
            location = "#get_post";
            location.reload()
        })
        .catch(error => {console.error("An error occurred: ", error.statusText)});
}

// reply form and adding comments to single posts begin here

function renderReplyFormHTML(object){
    $(".reply-form-div").html("");
    newReplyForm = $(".reply-form-template").clone();
    newReplyForm.removeClass("reply-form-template").addClass("reply-form");
    newReplyForm.attr("id", `reply-form${object.postNumber}`);
    newReplyForm.css("display","");
    $(`#reply-form-div${object.postNumber}`).append(newReplyForm);
    $(`#reply-form${object.postNumber} #comment-id`).val(`${object.postNumber}`);
    $(`#reply-form${object.postNumber} #reply-button`).attr("id", `reply-button${object.postNumber}`);
    $(`#reply-form${object.postNumber} #cancel-button`).attr("id", `cancel-button${object.postNumber}`);
    
    createReplyListener(object.postNumber);
    createCommentCancelListener(object.postNumber);
}

// create event listener for new reply button
function createReplyListener(postNumber){
    $(`#reply-form${postNumber}`).submit(function(e){
        e.preventDefault();
        validateCommentInput(postNumber);
    })
}

// see above for input validation explanation
function validateCommentInput(postNumber){
    const content = $(`#reply-form${postNumber} #reply`).val().trim();
    if(content == ""){
        $(`#reply-form${postNumber} #reply`).val("");
        $(`#reply-form${postNumber} #reply`).focus();
        
        return false;
    }  
    convertCommentDataToJSON(content, postNumber);
}

function convertCommentDataToJSON(content, postNumber){
    const commentId = $(`#reply-form${postNumber} #comment-id`).val();
    const comment = JSON.stringify({"content":content, "comment_id": commentId});
    sendComment(comment, postNumber);
}

function sendComment(comment, postNumber){
    $.ajax("/create_comment",{
        type: 'POST',
        contentType: 'application/json',
        data: comment
    })
        .then(result => {
            $(`#reply-form${postNumber} #reply`).val("");
            getPost(object = {"postNumber": postNumber, "dataClass": "comment", "href": `get_single/${result}`, "skip": 0})
        })
        .catch(error => console.error("An error occurred: ", error.statusText));
}

// create event listener for cancel comment button
function createCommentCancelListener(postNumber){
    $(`#cancel-button${postNumber}`).click(function(e){
        e.preventDefault();
        $(".reply-form").remove();
    })
}