$(document).ready(function() {
    $("#phone").keyup(function() {
        $(this).val($(this).val().replace(/^(\d{3})(\d{3})(\d+)$/, "($1)$2-$3"));
    });
        $("#customer_form").submit(function(e){
            e.preventDefault();
            const first_name = $("#first_name").val().trim();
            const last_name = $("#last_name").val().trim();
            const phone = $("#phone").val().trim();
            console.log(phone);
            const email = $("#email").val().trim();
            const customer= JSON.stringify({"first_name":first_name, "last_name": last_name, "phone": phone, "email": email});
            $.ajax("/customers",{
                type:'POST',
                contentType:'application/json',
                data: customer,
                dataType: 'json',
                error: function (xhr, textStatus, errorMessage){
                    $("#server_response").html(xhr.status);
                },
                success: function(data){
                    $("#customer_form").remove();
                    $("#server_response").html(`Customer ${data.customer_first} ${data.customer_last} has been added to the database.`)
                }})});


        $("#find_customer").click(function(e){
            e.preventDefault();
            $.ajax("/customers/find_customer",{
                type: 'GET',
                success: function(){
                    $("#server_response").remove();
                    $("#add_customer_div").css("display", "none");
                    $("#find_customer_div").css("display", "block");
                }});});
        $("#refresh").click(function(e){
            e.preventDefault();
            $.ajax("/customers",{
                type: 'GET',
                success: function(data){
                    $("body").html(data)}})})});
        $("#home").click(function(e){
            e.preventDefault();
            $.ajax("/", {
                type: 'GET',
                success: function(data){
                    window.location.href='/';
                    $("body").html(data);
            }})});
    