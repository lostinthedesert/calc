function get_air_quality(object){
    $.ajax("/air_quality")
    
    .then(result => {
        hideAndDisplayPages(object); 
        add_rows_to_aqi_table(result)
    })
    .catch(error => 
        console.error(`There was an error: ${error}`));
}

function add_rows_to_aqi_table(data){
    const tableHeader = $("#table-header").clone();
    const rowTemplate = $(".row-template").clone();
    $("#aqi-table").html("");
    $("#aqi-table").append(tableHeader);
    $("#aqi-table").append(rowTemplate);


    for(var i = 0; i < data.length; i++){
        render_aqi_tables_template(data, i)
    }
}

function render_aqi_tables_template(data, i){
    
    var newRow = $(".row-template").clone();
    newRow.removeClass("row-template").addClass(`row-template${i}`);
    newRow.css("display", "");
    $("#aqi-table").append(newRow);
    $(`.row-template${i} > .col1`).html(`${data[i].date} ${data[i].time}:00`);
    $(`.row-template${i} > .col2`).html(`${data[i].city}, ${data[i].state}`);
    $(`.row-template${i} > .col3`).html(`${data[i].aqi}`);
    $(`.row-template${i} > .col4`).html(`${data[i].category}`);
}
