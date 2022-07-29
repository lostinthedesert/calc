$(document).ready(function() {
    try{
        $.ajax("/create_post",{
            type: 'GET',
            headers: {"Authorization": "Bearer "+ localStorage.getItem("token")},
            error: function(){
                $("#user_name").remove()
            }});
        $("#user_name").html(` | User: <b>${localStorage.getItem("user_name")}</b> logged in (<a id="logout" href="">logout</a>)`)
    }
    catch(err){
    };
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
            }})})
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
            }})})
    $("#logout").click(function(e){
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("user_name");
        $.ajax("/login",{
            type: 'GET',
            success: function(data){
                $("body").html(data)},
            })});});
