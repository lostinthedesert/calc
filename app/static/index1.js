function handleClickEvent(e){
    e.preventDefault();
    $(".selected").removeClass("selected");
    const newClass=$(this).data("id");
    $(`.${newClass}`).addClass("selected");
}

function wireUpClickEvents(){
    $("#signupLink").click(handleClickEvent)
    $("#loginLink").click(handleClickEvent)
    $("#homeLink").click(handleClickEvent)
}

$(document).ready(function() {

    wireUpClickEvents();
//HEADER BEHAVIOR
    // try{
    //     $.ajax("/create_post",{
    //         type: 'GET',
    //         headers: {"Authorization": "Bearer "+ localStorage.getItem("token")},
    //         error: function(){
    //             $(".extra_nav").remove()
    //         }});
    //     $(".extra_nav").html(`| <a id="new_post" href="">New Post</a> | <a id="newsfeed" href="">Feed</a> | User: <b>${localStorage.getItem("user_name")}</b> logged in (<a id="logout" href="">logout</a>)`);
    // }
    // catch(err){
    // };
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
    });
// NAV BAR

    $("#refresh").click(function(e){
        e.preventDefault();
        $.ajax("/",{
            type: 'GET',
            success: function(data){
                $("body").html(data)
},})});
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
            })});
            
// SUBMIT FORMS
    // NEW USER SIGNUP
    $("#user_form").submit(function(e){
        e.preventDefault();
        const username = $("#signup-username").val().trim();
        const password = $("#signup-password").val().trim();
        const email = $("#signup-email").val().trim();
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
                        $(".server-response").css("display","block")
                        $(".server-response").html("That username already exists")}
                    },
                success: function (data){
                    $(".signup-page").css("display","none")
                    $(".server-response").css("display","block")
                    $(".server-response").html("Congratulations! New user " +data+" has been created.");
                }
            });}
        catch(err){
            $(".server-response").html(err);
            };
    });
    // LOGIN FORM SUBMISSION
    $("#login-form").submit(function(e){
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
                    $(".server-response").css("display","block")
                    $(".server-response").html("Invalid login credentials")};
                },
            success: function (data){
                localStorage.setItem("token", data.access_token);
                var item=localStorage.getItem("token");
                localStorage.setItem("user_name", data.name);
                console.log(item);
                $(".login-page").css("display","none")
                $(".server-response").css("display","block")
                $(".server-response").html(`User ${username} logged in`);
            }});});
});
