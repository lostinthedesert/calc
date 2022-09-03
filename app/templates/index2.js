$(document).ready(function() {
    $("#phone").keyup(function() {
        $(this).val($(this).val().replace(/^(\d{3})(\d{3})(\d+)$/, "($1)$2-$3"));
    });
        $("#customer_form").submit(function(e){
            e.preventDefault();
            const first_name = $("#first_name").val().trim();
            const last_name = $("#last_name").val().trim();
            const phone = $("#phone").val().trim();
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
            
        $("#customer_search_form").submit(function(e){
            e.preventDefault();
            const last_name = $("#search_last_name").val().trim();
            customer=JSON.stringify({"last_name":last_name})
            $.ajax("/customers/find_customer",{
                type:'POST',
                contentType: 'application/json',
                data: customer,
                dataType: 'json',
                error: function (xhr, textStatus, errorMessage){
                    if(xhr.status==404){
                        $("#server_response").html("No results for that customer")}
                },
                success: function(data){
                    $("#customer_search_form").remove();
                    $("#server_response").html(`Results for "${customer}": ${data.first_name} ${data.last_name}, ${data.phone}, ${data.email}`)
                }})});
            
// NAV BAR
        $("#find_customer").click(function(e){
            e.preventDefault();
                    $("#server_response").remove();
                    $("#add_customer_div").css("display", "none");
                    $("#find_customer_div").css("display", "block");
                });
        $("#add_customer").click(function(e){
            e.preventDefault();
            $.ajax("/customers",{
                type: 'GET',
                success: function(data){
                    $("body").html(data);
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
                    $("body").html(data);
            }})});
    