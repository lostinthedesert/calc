$(document).ready(function(){
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
                // $("#login_form").remove()
                // $("#response").html("Login succesful!");
                localStorage.setItem("token", data.access_token);
                var item=localStorage.getItem("token");
                console.log(item);
                $.ajax("/create_post",{
                    type: 'GET',
                    headers: {"Authorization": "Bearer " + item},
                    success: function(data){
                        $("body").html(data)
                    }
                    
                });
            }
        });
    });
    $("#sign_up").click(function(e){
        e.preventDefault();
        $.ajax("/new_user", {
            type: 'GET',
            success: function(data){
                $("body").html(data);
            }
        })
    });
    $("#home").click(function(e){
        e.preventDefault();
        $.ajax("/", {
            type: 'GET',
            success: function(data){
                $("body").html(data);
            }
        })
    });
    $("#new_post").click(function(e){
        e.preventDefault();
        var item=localStorage.getItem("token");
        $.ajax("/create_post", {
            type: 'GET',
            headers: {"Authorization": "Bearer " + item},
            success: function(data){
                $("body").html(data);
            }
        })
    })
});