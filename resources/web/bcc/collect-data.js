

// tables to plot
// collect schema

// collect data --> plot
//  data object
//  on failure
//  onsuccess (add to data)
//  filter template
// `assemble whens
//  run --> plot

data_sources = {};

function onFailure(errorInfo, options, responseObj)
{
    if (errorInfo && errorInfo.exception)
    {
        alert("Failure: " + errorInfo.exception);
    }
    else
    {
        alert("Failure: " + responseObj.statusText);
    }
}

function onSuccess(data)
{
    console.log("Success! " + data.rowCount + " rows returned.");
    console.log(data);
    var table_name = data.queryName;
    var data_rows = [data.queryName] = data.rows;
    data_sources[table_name] = {};
    data_sources[tables_name]["objects"] = data_rows;
}


function createMultiQuery(tables_to_plot, optr)
{

    multi_request = new LABKEY.MultiRequest();

    $.each(tables_to_plot, function(table_data, table_key)
    {
        table_name = table_data.TableName;

        filter_array =
        [
            LABKEY.Filter.create
            (
                "optr",
                optr,
                LABKEY.Filter.getFilterTypeForURLSuffix("eq")
            )
        ];

        var fields = [];
        $.each(table_schema[table_name].Fields, function(index, item){
            //console.log("index: " + index + "item");
            //console.log(item);
            fields.push(item.FieldName);
        });

        config =
        {
            schemaName:"lists",
            queryName:table_name,
            columns: fields,
            filterArray: filter_array,
            success:onSuccess,
            failure:onFailure
        };

        multi_request.add(LABKEY.Query.selectRows, config);

    });

    return multi_request;

}


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

