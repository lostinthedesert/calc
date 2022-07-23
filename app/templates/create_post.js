$(document).ready(function(){
    $("#proceed").click(function(){
        var item=localStorage.getItem("token");
        $.ajax("/create_post",{
            type: 'get',
            headers: {"Authorization": "Bearer " + item},
        });
    });
});