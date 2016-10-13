var debug_getDataFromJS = false;

function getDataFromJS(table_name, fields, filter)
{
    if (debug_getDataFromJS) console.log("in getDataFromJS");
    if (debug_getDataFromJS) console.log("table_name " + table_name + " fields");
    if (debug_getDataFromJS) console.log(fields);
    if (debug_getDataFromJS) console.log("filter");
    if (debug_getDataFromJS) console.log(filter);

    var selected_items = [];

    var plot_data = {};
    $.each(fields, function(index, field)
    {
        plot_data[field] = [];
    });
    
    data_list = data_sources[table_name].objects;
    //if (debug_getDataFromJS) console.log("data_list");
    //if (debug_getDataFromJS) console.log(data_list);

    $.each(data_list, function(index, item)
    {
        //if (debug_getDataFromJS) console.log("tablename " + table_name + " index :" + index + " item: ");
        //if (debug_getDataFromJS) console.log(item);
        //if (debug_getDataFromJS) console.log("filter.key " + filter.key + " filter.value " + filter.value);
        //if (debug_getDataFromJS) console.log(item[filter.key] == filter.value);
        //if (debug_getDataFromJS) console.log(fields.x + " item[fields.x] " + item[fields.x] + " " + fields.y + " item[fields.y] " + item[fields.y]);
        if (item[filter.key] == filter.value)
        {
            selected_items.push(item);
        }
    });

    // Some data seems to have "Date" while other data hs "date".
    // Normalize date attribute name.
    var date_field = "";
    var has_date = false;
    
    if (fields.indexOf("date") !== -1 )
    {
        date_field = "date";
        has_date = true;
    }
    if (fields.indexOf("Date") != -1)
    {
        date_field = "Date";
        has_date = true;
    }

    //if (debug_getDataFromJS) console.log("has date: " + has_date);
    
    // Convert string dates to date objects.
    $.each(data_list, function(index, object)
    {
        data_list[index][date_field] = formatDate(data_list[index][date_field]);
    });
        
    // Sort data by date
    if (has_date)
    {
        //if (debug_getDataFromJS) console.log("going to sort--date_field: " + date_field);
        selected_items.sort(function(d1, d2)
        {
            return new Date(d1[date_field]) - new Date(d2[date_field]);
        });
    }

    //if (debug_getDataFromJS) console.log("selected_items");
    //if (debug_getDataFromJS) console.log(selected_items);

    $.each(selected_items, function(index, item)
    {
        $.each(fields, function(index, field)
        {
            //console.log("field: " + field);
            
            if (item.hasOwnProperty(field))
            {
                plot_data[field].push(item[field]);
            }
            else if (field == "dummy")
            {
                plot_data['dummy'].push(0);
            }
            else
            {
                plot_data[field].push(NaN);
            }
        });

    });

    //if (debug_getDataFromJS) console.log("plot_data");
    //if (debug_getDataFromJS) console.log(plot_data);

    return plot_data;
    
}

function formatDate(date)
{
    var month_names =
    [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
    var temp = new Date(date);
    var date_string = temp.getFullYear() + "-" 
        + (temp.getMonth() + 1) + "-" 
        + temp.getDate();
    return date_string;
}

