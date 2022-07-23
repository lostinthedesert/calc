$(document).ready(function() {
    $("#form").submit(function(e){
        e.preventDefault();
        var everclear = $("#everclear").val();
        var intEverclear = parseFloat(everclear);
        var final = $("#final").val();
        var intFinal = parseFloat(final);
        var volume = $("#volume").val();
        var intVolume = parseFloat(volume);
        var answer = (intVolume * intFinal) / intEverclear;
        $("#answer").html(answer);
    });
    $("#login").click(function(e){
        e.preventDefault();
        $.ajax("/login",{
            type: 'GET',
            success: function(data){
                $("body").html(data);
            }
        });
    });
    $("#sign_up").click(function(e){
        e.preventDefault();
        $.ajax("/new_user",{
            type: 'GET',
            success: function(data){
                $("body").html(data);
            }
        })
    })
});
