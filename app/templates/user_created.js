$.ajax("/user_created", {
    type: 'get',
    dataType: 'text',
    success: function (data){
        $("#response").append("Congratulations! New user " +data+" has been created.");}})