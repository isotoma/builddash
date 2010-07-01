
$( update );


function update()
{
    $.getJSON('view/', do_layout);
}

var div_to_insert;

function insert_to_page(i, item) {

        for (x in item)
        {
            var item_html = "<td class='build-item'>";
            
            item_html += "<h2>" + x + "</h2>";
            
            item_html += "<ul>";
            $.each(item[x].builders, function (j, builder) {
                item_html += "<li ><div><img src='static/img/"+ builder['status'] + ".png' />" + j + "</div><span class='state '>" + builder['status'] + "</span><span class='time'>" + builder['time'] + "</span></li>";            
            });
            item_html += "</ul>";
            
            item_html += "</td>";
            div_to_insert.append($(item_html));
            break;
        }
    
}

function insert_build_to_page(i, item) {

    for (x in item)
        {
            var item_html = "<td class='build-item'>";
            
            item_html += "<h3>" + x + "</h3>";
            
            item_html += "</td>";
            div_to_insert.append($(item_html));
            break;
        }

}


function do_layout(json) {

    div_to_insert = $('#building');
    div_to_insert.children().remove();
    $.each(json.building, insert_to_page);

    div_to_insert = $('#exception');
    div_to_insert.children().remove()
    $.each(json.exception, insert_to_page);
    
    div_to_insert = $('#failed');
    div_to_insert.children().remove()
    $.each(json.failed, insert_to_page );
    
    div_to_insert = $('#build');
    div_to_insert.children().remove()
    $.each(json.build, insert_build_to_page );
    
    window.setTimeout(update, 10000);

}