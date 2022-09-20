var skip = 0;

function getPosts(skip){
    $.ajax("/get_post?skip="+skip,{
        type: 'GET',
        success: function(data){
            const posts=data;
            for(var i=0; i<posts.length; i++){
                $(".ten-posts").append(`<div class='border' id='border${i}'></div>`);
                $(`#border${i}`).append(`<div class='title'>${posts[i].title}</div><br>`);
                $(`#border${i}`).append(`<div class='content'>${posts[i].content}</div><br>`);
                $(`#border${i}`).append(`<div class='date'>${posts[i].created_at}</div><br>`);
                $(`#border${i}`).append(`<div class='single-postLink' data-id='single-post' data-class=${posts[i].id}><a href=''>Comment</a></div>`)};
            $(".single-postLink").click(handleClickEvent);
            $("#next-tenLink").html("<a href='' id='next-ten'>Next 10 posts</a>");
            $("#previous-tenLink").html("<a href='' id='previous-ten'>Previous 10 posts</a> | ")
            if(skip==0){
                $("#previous-tenLink").addClass("hidden");}
            if(posts.length<10){
                $("#next-tenLink").addClass("hidden");}
            if(posts[9].id==1){
                $("#next-tenLink").addClass("hidden");}
        }})};

function getSingle(id){
    $.ajax("/get_single/"+id,{
        type: 'GET',
        success: function(data){
            const post=data;
            for(var i=0; i<post.length; i++){
                if(post[i].comment_id==null){
                    $(".top-post").html(`<div class='title'>${post[i].title}</div>`);
                    $(".top-post").append(`<div class='content'>${post[i].content}</div>`);
                    $(".top-post").append(`<div class='date'>${post[i].created_at}</div>`);
                    $("#comment-form").append(`<input class='hidden comment-id' id='comment-id' value='${id}'>`);}
                if(post[i].comment_id !== null && i<post.length-1){
                    $(".comments").append(`<div class='border' id='comment-border${i}'></div>`);
                    $(`#comment-border${i}`).append(`<div class='content'>${post[i].content}</div>`);
                    $(`#comment-border${i}`).append(`<div class='date'>${post[i].created_at}</div`);}
            }
        }})};
                
function handleClickEvent(e){
    e.preventDefault();
    $(".selected").removeClass("selected");
    const newClass=$(this).data("id");
    $(`.${newClass}`).addClass("selected");
    
    $("#form").trigger("reset");
    $("#answer").html("");
    $('.comment-id').remove();

    if($(this).data("class")=="next-ten"){
        skip+=10;
        $("#previous-tenLink").removeClass("hidden");
    }
    
    if($(this).data("class")=="previous-ten"){
        skip-=10;
        $("#next-tenLink").removeClass("hidden");
    }

    if($(this).data("class")=="postLink"){
        $(".hidden").removeClass("hidden");
        skip=0;
    }

    if(newClass=="posts"){
        $(".ten-posts").html("");
        getPosts(skip);
    }

    if(newClass=="single-post"){
        $(".top-post").html("");
        $(".comments").html("");
        const id=$(this).data("class");
        getSingle(id);
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
    $("#comment-form").submit(function(e){
        e.preventDefault();
        const content=$("#reply").val().trim();
        if(content==""){
            $("#reply").val("");
            $("#reply").focus();
            return false;
        }
        const commentId=$("#comment-id").val();
        $(".comment-id").remove();
        console.log(commentId);
        const post=JSON.stringify({"content":content, "comment_id": commentId});
        $.ajax("/create_comment",{
            type: 'POST',
            contentType: 'application/json',
            data: post,
            success: function(){
                $("#comment-form").trigger("reset");
                $(".comments").html("");
                getSingle(commentId);
            }
        })

    })