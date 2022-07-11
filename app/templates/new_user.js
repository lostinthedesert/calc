$(document).ready(function() {
    $("#submit").click(function(){
        const username = $("#username").val();
        const password = $("#password").val();
        const email = $("#email").val();
        const user = JSON.stringify({name:username, pword:password, mail:email});
        $.ajax("/new_user", {
            type: 'post',
            contentType: 'application/json',
            data: user,
            dataType: 'text',
            error: function (jqXhr, textStatus, errorMessage) {
                $("#response").append("Error: " + errorMessage)},
            success: function (data){
                $("#response").append("Congratulations! New user " +data+" has been created.");
            }
        });
    });
});