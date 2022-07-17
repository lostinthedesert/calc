$(document).ready(function(){
    $("#login_form").submit(function(e){
        e.preventDefault();
        const username=$("#username").val();
        const password=$("#password").val();
        const user={"username":username, "password":password};
        $.ajax("/login", {
            type: 'post',
            data: user,
            dataType: 'text',
            error: function (xhr, textStatus, errorMessage) {
                if(xhr.status==404){
                    $("#response").html("Username does not exist")};
                if(xhr.status==400){
                    $("#response").html("Invalid password")};
                },
            success: function (data){
                $("#login_form").remove()
                $("#response").html(data);
        }
    })
})});