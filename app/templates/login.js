$(document).ready(function(){
// HEADER BEHAVIOR BEFORE FORM SUBMISSION 
    try{
        $.ajax("/create_post",{
            type: 'GET',
            headers: {"Authorization": "Bearer "+ localStorage.getItem("token")},
            error: function(){
                $(".extra_nav").remove()},
            success: function(){
                $("#div2").html(`<br>User: <b>${localStorage.getItem("user_name")}</b> logged in. Log out to change user.`)
            }});
        $(".extra_nav").html(`| <a id="new_post" href="">New Post</a> | <a id="newsfeed" href="">Feed</a> | User: <b>${localStorage.getItem("user_name")}</b> logged in (<a id="logout" href="">logout</a>)`);
    }
    catch(err){};
// LOGIN FORM SUBMISSION
    $("#login_form").submit(function(e){
        e.preventDefault();
        const username=$("#username").val();
        const password=$("#password").val();
        const user={"username":username, "password":password};
        $.ajax("/login", {
            type: 'POST',
            data: user,
            dataType: 'json',
            error: function (xhr, textStatus, errorMessage) {
                if(xhr.status==404){
                    $("#response").html("Invalid login credentials")};
                },
            success: function (data){
                localStorage.setItem("token", data.access_token);
                var item=localStorage.getItem("token");
                localStorage.setItem("user_name", data.name);
                console.log(item);
                $.ajax("/get_post",{
                    type: 'GET',
                    headers: {"Authorization": "Bearer " + item},
                    success: function(data){
                        $("#login").remove();
                        $("#response").html(data)
                    }})}});});
// HEADER BEHAVIOR AFTER FORM SUBMISSION
    $("#sign_up").click(function(e){
        e.preventDefault();
        $.ajax("/new_user", {
            type: 'GET',
            success: function(data){
                $("body").html(data);
            }})});
    $("#home").click(function(e){
        e.preventDefault();
        $.ajax("/", {
            type: 'GET',
            success: function(data){
                $("body").html(data);
            }})});
    $("#new_post").click(function(e){
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
    $("#logout").click(function(e){
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("user_name");
        $.ajax("/login",{
            type: 'GET',
            success: function(data){
                $("body").html(data)
            }})});
    $("#refresh").click(function(e){
        e.preventDefault();
        $.ajax("/login",{
            type: 'GET',
            success: function(data){
                $("body").html(data)
            }})});
});