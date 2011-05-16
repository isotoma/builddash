var timeout = 10000;
var column_height = 10;
var max_build_category = 5;

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
    var item_html = "<td class='build-item'>";
    
    item_html += "<h2><a href=" + buildbot_url + "/waterfall?category=" + item.category + ">" + item.category + "</a></h2>";
    
    item_html += "<ul>";
    $.each(item.builders, function (j, builder) {
        var category = builder['category'];
        var category_link = "<a href=" + buildbot_url + "/waterfall?category=" + category + ">" + category + "</a>";
        var build_time = builder['time'];
        var icon_html = "<img src='static/img/"+ builder['status'] + ".png' />";
        var icon_html = "<img src='static/img/"+ builder['status'] + ".png' />";
        
        item_html += "<li ><div>"+icon_html+"<a href=" + buildbot_url + "/builders/" + builder.builder +">" + builder.builder + "</a></div><span class='state '>" + builder['status'] + "</span><span class='time'>" + builder['time'] + "</span><span class='category'>" + category_link + "</span></li>";
    });
    item_html += "</ul>";
    
    item_html += "</td>";
    div_to_insert.append($(item_html));
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

function columnify_data(data,title) {
    var category = [];
    var full_title = title;
    var max_i = Math.ceil(data.length/column_height);
    for (var i = 0; i < max_i; i++){
        var j = i + 1;
        if (max_i > 1) full_title = title +  ' ' + j + '/' + max_i;
        category.push({'category' : full_title,
                       'builders' : data.slice(i*column_height,j*column_height)});
    }
    return category;
}
function do_layout(json) {
    if (json) {
        var building = columnify_data(json.building,'Building');
        var offline = columnify_data(json.offline,'Offline (Building or Pending)');
        var exception = columnify_data(json.exception,'Exception');
        var failed = columnify_data(json.failed,'Failed');
        var build = columnify_data(json.build.slice(0,max_build_category),'Last ' + max_build_category + ' successful builds (total = ' + json.build.length + ')');
                        
        $('body').removeClass('loading');
        
        div_to_insert = $('#building');
        div_to_insert.children().remove();
        $.each(building, insert_to_page);

        div_to_insert = $('#offline');
        div_to_insert.children().remove()
        $.each(offline, insert_to_page);
        
        div_to_insert = $('#exception');
        div_to_insert.children().remove()
        $.each(exception, insert_to_page);

        div_to_insert = $('#failed');
        div_to_insert.children().remove()
        $.each(failed, insert_to_page );

        div_to_insert = $('#build');
        div_to_insert.children().remove()
        $.each(build, insert_to_page );
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