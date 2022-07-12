$(document).ready(function() {
    $("#submit").click(function(){
        $("#response").html("");
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
                $("#response").append(errorMessage + " Make sure valid email address entered.")},
            success: function (data){
                $("#response").append("Congratulations! New user " +data+" has been created.");
            }
        });
    });
});