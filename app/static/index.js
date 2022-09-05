var skip = 0;

function getPosts(skip){
    $.ajax("/get_post?skip="+skip,{
        type: 'GET',
        success: function(data){
            const posts=data.posts;
            for(var i=0; i<posts.length; i++){
                $(".one-post").append("<div id='border'></div><br>");
                for(var j=0; j<posts[i].length; j++){
                    $(".one-post").append(`<div class='line'>${posts[i][j]}</div><br>`);
                    if(j!=0){
                        $(".line").removeClass("bold");
                    }
                    if(j===0){
                        $(".line").addClass("bold");
                    }
                }};
            $("#next-tenLink").html("<a href='' id='next-ten'>Next 10 posts</a>");
            $("#previous-tenLink").html("<a href='' id='previous-ten'>Previous 10 posts</a> | ")
            if(skip==0){
                $("#previous-tenLink").addClass("hidden");}
            if(posts.length<10){
                $("#next-tenLink").addClass("hidden");}}})};
            
function handleClickEvent(e){
    e.preventDefault();
    $(".selected").removeClass("selected");
    const newClass=$(this).data("id");
    $(`.${newClass}`).addClass("selected");

    if($(this).data("class")=="next-ten"){
        skip+=10;
        $("#previous-tenLink").removeClass("hidden");
    }
    
    if($(this).data("class")=="previous-ten"){
        skip-=10;
        $("#next-tenLink").removeClass("hidden");
    }

    if($(this).data("class")=="postLink"){
        $("#form").trigger("reset");
        $("#answer").html("");
        skip=0;
    }

    if(newClass=="posts"){
        $(".one-post").html("")
        getPosts(skip);
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
        $("#answer").html(answer);
    });})

// POSTS
    $("#post-form").submit(function(e){
        e.preventDefault();
        const TITLE=$("#title").val();
        const CONTENT=$("#content").val();
        post=JSON.stringify({"title":TITLE, "content": CONTENT});
        $.ajax("/create_post",{
            type: 'POST',
            contentType:'application/json',
            data: post,
            success: function(){
                $("#post-form").trigger("reset");
                $(".one-post").html("")
                getPosts(0);

                
            }});})