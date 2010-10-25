var timeout = 10000;
$.ajaxSetup({
    url: 'view/',
    success: do_layout,
    dataType: 'json',
    timeout: timeout,
    error: next,
});
$(update);


function update()
{
    $('body').addClass('loading');
    $.get();
    get_messages();
}

var div_to_insert;

function insert_to_page(i, item) {

        for (x in item)
        {
            var item_html = "<td class='build-item'>";
            
            item_html += "<h2><a href=" + buildbot_url + "/waterfall?category=" + x + ">" + x + "</a></h2>";
            
            item_html += "<ul>";
            $.each(item[x].builders, function (j, builder) {
                item_html += "<li ><div><img src='static/img/"+ builder['status'] + ".png' /><a href=" + buildbot_url + "/builders/" + j +">" + j + "</a></div><span class='state '>" + builder['status'] + "</span><span class='time'>" + builder['time'] + "</span></li>";            
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
            
            item_html += "<h3><a href=" + buildbot_url + "/waterfall?category=" + x + ">" + x + "</a></h3>";
            
            item_html += "</td>";
            div_to_insert.append($(item_html));
            break;
        }

}


function next() {
    window.setTimeout(update, timeout);
}

function do_layout(json) {
    if (json) {
        $('body').removeClass('loading');
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
    }
    
    next();
}


/*                          */
/* Message retrieval */
/* ******************** */

function append_messages(i, item) {

    $('#messages').append($('<span>' + item + '</span>'));

}
function get_messages() {
    $.getJSON('messages/', function (data) {
            $('#messages').children().remove();
            $.each(data, append_messages);
        }
    );
}