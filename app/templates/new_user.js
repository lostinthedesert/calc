$(document).ready(function() {
//HEADER BEHAVIOR
    try{
        $.ajax("/create_post",{
            type: 'GET',
            headers: {"Authorization": "Bearer "+ localStorage.getItem("token")},
            error: function(){
                $(".extra_nav").remove()
            }});
        $(".extra_nav").html(`| <a id="new_post" href="">New Post</a> | <a id="newsfeed" href="">Feed</a> | User: <b>${localStorage.getItem("user_name")}</b> logged in (<a id="logout" href="">logout</a>)`);
    }
    catch(err){
    };
    // history.pushState(null, null, '/new_user');
    $("#user_form").submit(function(e){
        e.preventDefault();
        const username = $("#username").val().trim();
        const password = $("#password").val().trim();
        const email = $("#email").val().trim();
        function lengthOk(string){
            if(string.length>2 && string.length<21){
                return true
            }
            throw "username must be 3-20 characters long";
        };
        try{
            lengthOk(username);
            const user = JSON.stringify({name:username, pword:password, mail:email});
            $.ajax("/new_user", {
                type: 'post',
                contentType: 'application/json',
                data: user,
                dataType: 'text',
                error: function (xhr, textStatus, errorMessage) {
                    if(xhr.status==406){
                        $("#response").html("That username already exists")}
                    },
                success: function (data){
                    $("#user_form").remove()
                    $("#response").html("Congratulations! New user " +data+" has been created.");
                }
            });}
        catch(err){
            $("#response").html(err);
            };
    });
// HEADER BEHAVIOR
    $("#login").click(function(e){
        e.preventDefault();
        $.ajax("/login",{
            type: 'GET',
            success: function(data){
                $("body").html(data);
            }});});
    $("#sign_up").click(function(e){
        e.preventDefault();
        $.ajax("/new_user",{
            type: 'GET',
            success: function(data){
                $("body").html(data);
            }})});
    $("#refresh").click(function(e){
        e.preventDefault();
        $.ajax("/new_user",{
            type: 'GET',
            success: function(data){
                $("body").html(data)
            }})});
    $("#new_post").click(function(e){
        e.preventDefault();
        var item=localStorage.getItem("token");
        $.ajax("/create_post", {
            type: 'GET',
            headers: {"Authorization": "Bearer " + item},
            error: function (xhr, textStatus, errorMessage) {
                if(xhr.status==401){
                    $("#no_user").html("<h3>User not authenticated. Please login</h3>");
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
                $("body").html(data)},
            })});});