$(document).ready(function() {
    $("#submit").click(function(){
        const username = $("#username").val();
        const password = $("#password").val();
        const email = $("#email").val();
        const user = JSON.stringify({name:username, pword:password, mail:email});
        console.log(user);
        $.ajax("/new_user", {
            type: 'post',
            contentType: 'application/json',
            data: user,
            dataType: 'json'
        });
    });
});