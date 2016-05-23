function getDataFromJS(table_name, fields, filter)
{
    console.log("in getDataFromJS");
    console.log("table_name " + table_name + " fields");
    console.log(fields);
    console.log("filter");
    console.log(filter);

    var selected_items = [];
    
    var plot_data = {};
    $.each(fields, function(index, field)
    {
        plot_data[field] = [];
    });
    
    data_list = data_sources[table_name].objects;
    //console.log("data_list");
    //console.log(data_list);

    $.each(data_list, function(index, item)
    {
        //console.log("tablename " + table_name + " index :" + index + " item: ");
        //console.log(item);
        //console.log("filter.key " + filter.key + " filter.value " + filter.value);
        //console.log(item[filter.key] == filter.value);
        //console.log(fields.x + " item[fields.x] " + item[fields.x] + " " + fields.y + " item[fields.y] " + item[fields.y]);
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

    //console.log("has date: " + has_date);
    
    // Convert string dates to date objects.
    $.each(data_list, function(index, object)
    {
        data_list[index][date_field] = formatDate(data_list[index][date_field]);
    });
        
    // Sort data by date
    if (has_date)
    {
        //console.log("going to sort--date_field: " + date_field);
        selected_items.sort(function(d1, d2)
        {
            return new Date(d1[date_field]) - new Date(d2[date_field]);
        });
    }

    //console.log("selected_items");
    //console.log(selected_items);

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

    //console.log("plot_data");
    //console.log(plot_data);

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

