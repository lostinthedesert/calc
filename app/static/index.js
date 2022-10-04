var skip = 0;
var index=null;

var commentForm = `<form id='comment-form${index}' class='comment-form' autocomplete='off'><textarea class='textarea' type='textarea' id='reply' rows='10' cols='40' required></textarea>
<button type='submit'>Add comment</button><br>
</form>`;

function getPosts(skip){
    $.ajax("/get_post?skip="+skip,{
        type: 'GET',
        success: function(data){
            const posts=data;
            for(var i=0; i<posts.length; i++){
                $(".ten-posts").append("<div class='border'></div>");
                $(".ten-posts").append(`<div class='top-post' id='post${i}'></div>`);
                $(`#post${i}`).append(`<div class='title-date'><span class='title'>${posts[i].title}</span> | <span class='date'>${posts[i].created_at}</span></div>`);
                $(`#post${i}`).append(`<div class='content'>${posts[i].content}</div>`);
                $(`#post${i}`).append(`<div class='comment-reply-link'><span id='link${i}'><a id='comment-link${i}' class='comment-link' data-index='${i}' data-id='posts' data-class='comment' data-post-number='${posts[i].id}' href=''>Comments</a></span> | <span id='reply${i}'><a id='reply-link${i}' class='reply' data-index='${i}' data-id='posts' data-class='reply' data-post-number='${posts[i].id}' href=''>Reply</a></span></div>`);
                $(`#post${i}`).append(`<div class='reply-form hidden' id='reply-form${i}'></div>`);
            }
            $(".comment-link").click(handleClickEvent);
            $(".reply").click(handleClickEvent);
            $("#next-tenLink").html("<a href='' id='next-ten'>Next 10 posts</a>");
            $("#previous-tenLink").html("<a href='' id='previous-ten'>Previous 10 posts</a> | ")
            if(skip==0){
                $("#previous-tenLink").addClass("hidden");}
            if(posts.length<10){
                $("#next-tenLink").addClass("hidden");}
            if(posts[9].id==1){
                $("#next-tenLink").addClass("hidden");}
        }})};

function getSingle(id, index){
    $.ajax("/get_single/"+id,{
        type: 'GET',
        error: function(xhr){
            if(xhr.status==404){
                return false;
            }},
        success: function(data){
            const post=data;
            $(`#comments${index}`).remove();
            $(`#post${index}`).append(`<div class='comments' id='comments${index}'></div>`);
            for(var i=0; i<post.length; i++){
                $(`#comments${index}`).append(`<div class='comment' id='comment${index}-${i}'></div>`);
                $(`#comment${index}-${i}`).append(`<div class='comment-date'>${post[i].created_at}</div>`);
                $(`#comment${index}-${i}`).append(`<div class='comment-content'>${post[i].content}</div>`);
                }
            $(`#link${index}`).html(`<a id='toggle-link${index}' data-id='posts' data-class='toggle' data-type='comments' data-index='${index}' href=''>Comments</a>`);
            $(`#toggle-link${index}`).click(handleClickEvent);
        }})};

function handleClickEvent(e){
    e.preventDefault();
    $(".selected").removeClass("selected");
    const newClass=$(this).data("id");
    $(`.${newClass}`).addClass("selected");
    $("#form").trigger("reset");
    $("#answer").html("");
    $("#post-form").trigger("reset");
    $("#comment-form").trigger("reset");
    $('.comment-id').remove();

    if($(this).data("class")=="next-ten"){
        skip+=10;
        $(".ten-posts").html("");
        getPosts(skip);
        $("#previous-tenLink").removeClass("hidden");
    }
        
    if($(this).data("class")=="previous-ten"){
        skip-=10;
        $(".ten-posts").html("");
        getPosts(skip);
        $("#next-tenLink").removeClass("hidden");
    }

    if($(this).data("class")=="postLink"){
        $(".hidden").removeClass("hidden");
        skip=0;
        $(".ten-posts").html("");
        getPosts(skip);
    }

    if($(this).data("class") == "comment"){
        const id=$(this).data("post-number");
        const index=$(this).data("index");
        getSingle(id, index);
    }

    if($(this).data("class") == "toggle"){
        const index=$(this).data("index");
        if($(this).data("type") == "comments"){
            $(`#comments${index}`).toggle();
        }
    }

    if($(this).data("class") == "reply"){
        const index=$(this).data("index");
        const id=$(this).data("post-number");
        $(".comment-form").remove();
        $(`#reply-form${index}`).removeClass("hidden");
        $(`#reply-form${index}`).html(commentForm);
        $(`#comment-formnull`).attr("id", `comment-form${index}`);
        $(`#comment-form${index}`).append(`<input class='hidden' id='comment-id' value='${id}'>`);
        $(`#comment-form${index}`).submit(function(e){
            e.preventDefault();
            commentSubmit(index);
        })
    }    
}

function wireUpClickEvents(){
    $("#homeLink").click(handleClickEvent);
    $("#postsLink").click(handleClickEvent);
    $("#next-tenLink").click(handleClickEvent);
    $("#previous-tenLink").click(handleClickEvent);
}

$(document).ready(function() {

    wireUpClickEvents();

    // FORM SUBMISSIONS

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

// POSTS
    $("#post-form").submit(function(e){
        e.preventDefault();
        const TITLE=$("#title").val().trim();
        if(TITLE==""){
            $("#title").val("");
            $("#title").focus();
            return false;
        }
        const CONTENT=$("#content").val().trim();
        if(CONTENT==""){
            $("#content").val("");
            $("#content").focus();
            return false;
        }
        const post=JSON.stringify({"title":TITLE, "content": CONTENT});
        $.ajax("/create_post",{
            type: 'POST',
            contentType:'application/json',
            data: post,
            success: function(){
                $("#post-form").trigger("reset");
                $(".ten-posts").html("")
                getPosts(0);

                
            }});})

// COMMENTS
function commentSubmit(index){
        const content=$("#reply").val().trim();
        if(content==""){
            $("#reply").val("");
            $("#reply").focus();
            return false;
        }
        const commentId=$("#comment-id").val();
        $(".comment-id").remove();
        const post=JSON.stringify({"content":content, "comment_id": commentId});
        $.ajax("/create_comment",{
            type: 'POST',
            contentType: 'application/json',
            data: post,
            success: function(){
                $(`#comment-form${index}`).trigger("reset");
                $(`#comments${index}`).html("");
                getSingle(commentId, index);
            }
        })
    }