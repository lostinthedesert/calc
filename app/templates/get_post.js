$(document).ready(function(){
    // HEADER BEHAVIOR
    $(".extra_nav").html(`| <a id="new_post" href="">New Post</a> | <a id="newsfeed" href="">Feed</a> | User: <b>${localStorage.getItem("user_name")}</b> logged in (<a id="logout" href="">logout</a>)`);
    $("#logout").click(function(e){
        e.preventDefault();
        localStorage.removeItem("query_limit");
        localStorage.removeItem("token");
        localStorage.removeItem("user_name");
        $.ajax("/login",{
            type: 'GET',
            success: function(data){
                $("body").html(data)},})});
    $("#sign_up").click(function(e){
        e.preventDefault();
        localStorage.removeItem("query_limit");
        $.ajax("/new_user", {
            type: 'GET',
            success: function(data){
                $("body").html(data);}})});
    $("#new_post").click(function(e){
        e.preventDefault();
        localStorage.removeItem("query_limit");
        var item=localStorage.getItem("token");
        $.ajax("/create_post", {
            type: 'GET',
            headers: {"Authorization": "Bearer " + item},
            error: function (xhr, textStatus, errorMessage) {
                if(xhr.status==401){
                    $("#response").html("User not authenticated. Please login ");
                    $("#div2").remove()}
                },
            success: function(data){
                $("body").html(data);}})});
    $("#newsfeed").click(function(e){
        e.preventDefault();
        localStorage.removeItem("query_limit");
        var item=localStorage.getItem("token");
        $.ajax("/get_post", {
            type: 'GET',
            headers: {"Authorization": "Bearer " + item},
            error: function (xhr, textStatus, errorMessage) {
                if(xhr.status==401){
                    $("#response").html("User not authenticated. Please login ");
                    $("#keep_header").remove()}
                },
            success: function(data){
                $("body").html(data);}})});
    $("#refresh").click(function(e){
        e.preventDefault();
        localStorage.removeItem("query_limit");
        var item=localStorage.getItem("token");
        $.ajax("/get_post", {
            type: 'GET',
            headers: {"Authorization": "Bearer " + item},
            error: function (xhr, textStatus, errorMessage) {
                if(xhr.status==401){
                    $("#response").html("User not authenticated. Please login");
                }},
            success: function(data){
                $("body").html(data);
            }})});
    if (localStorage.getItem("query_limit")==null){
        var result=20;}
    else {
        var result=localStorage.getItem("query_limit");
        result=parseInt(result)
    };
    $("#next_ten").click(function(e){
        e.preventDefault();
        $.ajax("/get_post?limit="+ result,{
            type: 'GET',
            headers: {"Authorization": "Bearer " + localStorage.getItem("token")},
            success: function(data){
                $("body").html(data);
                result += 10;
                localStorage.setItem("query_limit", result)
            }
        })
    })   
})