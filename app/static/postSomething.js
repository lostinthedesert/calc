// switch statement for links on this page and relevant variables are located in index.js in this directory

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
            parseTenPosts(result);
            addEventHanldersForNewLinks();
            setPreviousLinkDisplay(skip);
            setNextLinkDisplay(result)
        })
        .catch(error => console.error("An error occurred: ", error.statusText));
}

function hideAndDisplayPages(object){
    $(".selected").removeClass("selected");
    $(`.${object.dataID}`).addClass("selected");
}

function tearDownPostsAndResetSkipLinks(){
    const cloneDiv = $("#clone-div").clone();
    $(".ten-posts").html("");
    $(".hidden").removeClass("hidden");
    $(".ten-posts").html(cloneDiv);
}

function parseTenPosts(posts){
    for(var i = 0; i < posts.length; i++){
        renderTenPostsHTML(i, posts);
    }
}

function renderTenPostsHTML(i, posts){
    const newBorder = $(".clone-border").clone();
    newBorder.removeClass("clone-border").addClass("border");
    newBorder.css("display", "");
    const newPost = $(".top-post-clone").clone();
    newPost.attr("id", `post${i}`);
    newPost.removeClass("top-post-clone").addClass(`top-post`);
    newPost.css("display","");
    $(".ten-posts").append(newBorder);
    $(".ten-posts").append(newPost);
    const date = new Date(posts[i].created_at).toLocaleString();
    $(`#post${i} .title`).html(`${posts[i].title}`);
    $(`#post${i} .date`).html(`${date}`);
    $(`#post${i} .content`).html(`${posts[i].content}`);
    $(`#post${i} .comment-link`).attr({'id': `comment-link${i}`, 'data-index': `${i}`, 'data-post-number': `${posts[i].id}`});
    $(`#post${i} .reply`).attr({'id': `reply-link${i}`, 'data-index': `${i}`, 'data-post-number':`${posts[i].id}`});
    $(`#post${i} #toggle-link`).attr({'id': `toggle-link${i}`, "data-index": `${i}`});
    $(`#post${i} .reply-form-div`).attr("id", `reply-form-div${i}`);
}

function addEventHanldersForNewLinks(){
    $(".comment-link").click(buildElementObject);
    $(".reply").click(buildElementObject);
    $(".toggle-link").click(buildElementObject);
}

function setPreviousLinkDisplay(skip){
    if(skip == 0){
        $("#previous-ten").addClass("hidden");
    }
}

function setNextLinkDisplay(posts){
    if(posts.length < 10 || posts[9].id == 1){
        $("#next-ten").addClass("hidden");
    }
}

// single post comment section build out starts here

function getSinglePostComments(id, index){
    $.ajax("/get_single/"+id)

        .then(result => {
            if(result.length == 0){
                throw new Error("This post has no comments");
            }
            addHideCommentLink(index, result);
            tearDownAndSetUpCommentSecion(index);
            parseComments(index, result)
        })
        .catch(error => console.error(`An error occurred: ${error}`));
}

function tearDownAndSetUpCommentSecion(index){

    $(`#comments${index}`).remove();
    const newComments = $(".comments-template").clone();
    newComments.attr("id", `comments${index}`);
    newComments.removeClass("comments-template").addClass(`comments`);
    newComments.css("display","");
    $(`#post${index}`).append(newComments);
}

function addHideCommentLink(index, result){
    $(`#toggle-link${index}`).css("display","");

}

function parseComments(index, comments){
    for(var i = 0; i < comments.length; i++){
        renderCommentsHTML(comments, index, i);
    }
}

function renderCommentsHTML(comments, index, i){
    const newComment = $(`#comments${index} .comment-template`).clone();
    newComment.removeClass("comment-template").addClass(`comment`);
    newComment.attr("id", `comment${index}-${i}`);
    newComment.css("display","");
    $(`#comments${index}`).append(newComment);
    const date = new Date(comments[i].created_at).toLocaleString();
    $(`#comment${index}-${i} .comment-date`).html(date);
    $(`#comment${index}-${i} .comment-content`).html(comments[i].content);
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
        .then(() =>{
            $("#post-form").trigger("reset");
            getTenPosts(0)
        })
        .catch(error => {console.error("An error occurred: ", error.statusText)});
}

// reply form and adding comments to single posts begin here

function renderReplyFormHTML(index, id){
    $(".reply-form-div").html("");
    newReplyForm = $(".reply-form-template").clone();
    newReplyForm.removeClass("reply-form-template").addClass("reply-form");
    newReplyForm.attr("id", `reply-form${index}`);
    newReplyForm.css("display","");
    $(`#reply-form-div${index}`).append(newReplyForm);
    $(`#reply-form${index} #comment-id`).val(`${id}`);
    $(`#reply-form${index} #reply-button`).attr("id", `reply-button${index}`);
    $(`#reply-form${index} #cancel-button`).attr("id", `cancel-button${index}`);
    
    createReplyListener(index);
    createCommentCancelListener(index);
}

function createReplyListener(index){
    $(`#reply-form${index}`).submit(function(e){
        e.preventDefault();
        validateCommentInput(index);
    })
}

function validateCommentInput(index){
    const content = $(`#reply-form${index} #reply`).val().trim();
    if(content == ""){
        $(`#reply-form${index} #reply`).val("");
        $(`#reply-form${index} #reply`).focus();
        
        return false;
    }  
    convertCommentDataToJSON(content, index);
}

function convertCommentDataToJSON(content, index){
    const commentId = $(`#reply-form${index} #comment-id`).val();
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
            $(`#reply-form${index} #reply`).val("");
            getSinglePostComments(result, index)
        })
        .catch(error => console.error("An error occurred: ", error.statusText));
}

function createCommentCancelListener(index){
    $(`#cancel-button${index}`).click(function(e){
        e.preventDefault();
        $(".reply-form").remove();
    })
}