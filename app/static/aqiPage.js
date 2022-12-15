function get_air_quality(object){
    $.ajax("/air_quality")
    
    .then(result => {
        hideAndDisplayPages(object);
        return result
    })
    .then(result => 
        add_rows_to_aqi_table(result))
    .catch(error => 
        console.error(`There was an error: ${error}`));
}

const tableHeader = `
    <tr>
        <th>Date + time (in hours)</th>
        <th>City, State</th>
        <th>AQI</th>
        <th>Category</th>
    </tr>`;

function add_rows_to_aqi_table(data){
    $("#aqi-table").html("");
    $("#aqi-table").append(tableHeader);

    for(var i = 0; i < data.length; i++){
        render_aqi_tables(data, i)
    }
}

function render_aqi_tables(data, i){
    $("#aqi-table").append(
    `<tr>
    <td>${data[i].date} ${data[i].time}:00</td>
    <td>${data[i].city}, ${data[i].state}</td>
    <td>${data[i].aqi}</td>
    <td>${data[i].category}</td>
    </tr>`);
}