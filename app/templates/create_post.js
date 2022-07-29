$(document).ready(function(){
// HEADER BEHAVIOR
    $(".extra_nav").html(`| <a id="new_post" href="">New Post</a> | <a id="newsfeed" href="">Feed</a> | User: <b>${localStorage.getItem("user_name")}</b> logged in (<a id="logout" href="">logout</a>)`);
    $("#logout").click(function(e){
        e.preventDefault();
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
        var item=localStorage.getItem("token");
        $.ajax("/get_post", {
            type: 'GET',
            headers: {"Authorization": "Bearer " + item},
            error: function (xhr, textStatus, errorMessage) {
                if(xhr.status==401){
                    $("#response").html("User not authenticated. Please login ");
                    $("#div2").remove()}
                },
            success: function(data){
                $("body").html(data);}})});
    $("#refresh").click(function(e){
        e.preventDefault();
        var item=localStorage.getItem("token");
        $.ajax("/create_post", {
            type: 'GET',
            headers: {"Authorization": "Bearer " + item},
            error: function (xhr, textStatus, errorMessage) {
                if(xhr.status==401){
                    $("#response").html("User not authenticated. Please login");
                }},
            success: function(data){
                $("body").html(data);
            }})});
// FORM SUBMISSION BEHAVIOR
    $("#post_form").submit(function(e){
        e.preventDefault();
        const TITLE=$("#title").val();
        const CONTENT=$("#content").val();
        post=JSON.stringify({"title":TITLE, "content": CONTENT});
        $.ajax("/create_post",{
            type: 'POST',
            contentType:'application/json',
            headers: {"Authorization": "Bearer " + localStorage.getItem("token")},
            data: post,
            error: function(xhr){
                if(xhr.status==401){
                    $("#post_form").remove();
                    $("#keep_header").html("Please login to create new post");
                }},
            success: function(data){
                $("#post_form").remove();
                $("#keep_header").html(data);
            }});});});