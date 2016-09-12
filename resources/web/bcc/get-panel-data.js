//console.log("get-panel-data.js loaded");
//console.log("table_schema:");
//console.log(table_schema);

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

function onSuccessWithData(data_sources)
{
    //console.log("data_sources");
    //console.log(data_sources);

    function onSuccess(data)
    {
        console.log("Success! " + data.rowCount + " rows returned.");
        //console.log(data);
        var table_name = data.queryName;
        var data_rows = [data.queryName] = data.rows;
        //console.log("just data rows as JSON");
        //console.log(JSON.stringify(data_rows));
        if (data_rows.length)
        {
            data_sources[table_name] = {};
            data_sources[table_name]["objects"] = data_rows;
        }

        console.log("data_sources so far:");
        console.log(data_sources);

        //console.log(JSON.stringify(data_sources));
    }

    return onSuccess;
}

//function onSuccess(data)
//{
//    console.log("Success! " + data.rowCount + " rows returned.");
//    //console.log(data);
//    var table_name = data.queryName;
//    var data_rows = [data.queryName] = data.rows;
//    //console.log("just data rows as JSON");
//    //console.log(JSON.stringify(data_rows));
//    if (data_rows.length)
//    {
//        data.data_sources[table_name] = {};
//        data.data_sources[table_name]["objects"] = data_rows;
//    }
//
//    console.log("data.data_sources so far:");
//    console.log(data.data_sources);
//
//    //console.log(JSON.stringify(data_sources));
//}

function createMultiQuery(tables_to_plot, data_sources, optr)
{
    console.log("data_sources at start:");
    console.log(data_sources);
    for (var prop in data_sources)
    {
        if (data_sources.hasOwnProperty(prop))
        {
            delete data_sources[prop];
        }
    }
    console.log("data_sources after delete:");
    console.log(data_sources);

    var onSuccess = onSuccessWithData(data_sources);

    var multi_request = new LABKEY.MultiRequest();

    $.each(tables_to_plot, function(index, table_name)
    {
        console.log("in multi request loop. table_name = " + table_name + " optr = " + optr);

        if (!table_name)
        {
            console.log("table name undefined");
            return;
        }

        var filter_array =
        [
            LABKEY.Filter.create
            (
                "optr",
                optr,
                LABKEY.Filter.getFilterTypeForURLSuffix("eq")
            )
        ];

        var fields = [];
        //console.log("Getting fields for table " + table_name);
        //console.log("table schema:");
        //console.log(table_schema[table_name]);
        $.each(table_schema[table_name].Fields, function(index, item){
            //console.log("index: " + index + "item");
            //console.log(item);
            fields.push(item.FieldName);
        });

        //console.log("the fields are:");
        //console.log(fields);

        var config =
        {
            schemaName:"study",
            queryName:table_name,
            columns: fields,
            filterArray: filter_array,
            success:onSuccess,
            failure:onFailure
        };

        console.log("config:");
        console.log(config);

        multi_request.add(LABKEY.Query.selectRows, config);

    });

    return multi_request;

}


function getTraceData(table_name, fields, data_sources)
{
    console.log("in getTraceData");
    console.log("table_name " + table_name + " fields");
    //console.log(fields);
    //console.log("table_schema:");
    //console.log(table_schema);

    var selected_items = [];

    var plot_data = {};
    $.each(fields, function(index, field)
    {
        plot_data[field] = [];
    });

    data_list = data_sources[table_name]["objects"];
    if (data_list.length === 0)
    {
        console.log("no data in data_sources");
        return [];
    }
    //console.log("data_list");
    //console.log(data_list);
    selected_items = data_list;

    /*
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
    */

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
    $.each(selected_items, function(index, object)
    {
        //console.log("data_list[index][date_field] " + selected_items[index][date_field]);
        selected_items[index][date_field] = formatDate(selected_items[index][date_field]);
        //selected_items[index][date_field] = new Date(selected_items[index][date_field]);
    });

    // Sort data by date
    if (has_date)
    {
        console.log("date field: " + date_field);
        //console.log("going to sort--date_field: " + date_field);
        selected_items.sort(function(d1, d2)
        {
            return new Date(d1[date_field]) - new Date(d2[date_field]);
        });

        if (date_field == "date")
        {
            console.log("has lower case date field: " + date_field);
            /*
            console.log(selected_items);
            console.log("changing to Date");
            selected_items.forEach(function(item)
            {
                console.log("selected item");
                console.log(item);
                Object.defineProperty(item, "Date",
                    Object.getOwnPropertyDescriptor(item, "date"));
                delete item["date"];
            });
            */
        }
    }

    console.log("selected_items");
    console.log(selected_items);
    console.log("fields");
    console.log(fields);

    $.each(selected_items, function(index, item)
    {
        $.each(fields, function(index, field)
        {
            //console.log("field: " + field);

            if (item.hasOwnProperty(field))
            {
                plot_data[field].push(item[field]);
            } else
            {
                plot_data[field].push(NaN);
            }
        });

    });

    console.log("plot_data right now");
    console.log(plot_data);

    if (plot_data[date_field].length == 0)
    {
        plot_data = [];
    }

    //console.log("plot_data from getTraceData for table " + table_name);
    //console.log(plot_data);

    return plot_data;

}

/*
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
*/

function formatDate(UTCDateString)
{
    var convertdLocalTime = new Date(UTCDateString);
    var hourOffset = convertdLocalTime.getTimezoneOffset() / 60;
    convertdLocalTime.setHours( convertdLocalTime.getHours() + hourOffset );

    var date_string = convertdLocalTime.getFullYear() + "-"
            + (convertdLocalTime.getMonth() + 1) + "-"
            + convertdLocalTime.getDate();

    return date_string;
}

//http://stackoverflow.com/a/24027513/188963