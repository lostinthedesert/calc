$(document).ready(function() {
    $("#user_form").submit(function(e){
        e.preventDefault();
        const username = $("#username").val();
        const password = $("#password").val();
        const email = $("#email").val();
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
        });
    });      
});