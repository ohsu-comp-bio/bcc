var debug_annotationMakers = false;
/*jslint browser: true, white: true, nomen: true, sloppy: true, vars: true, indent: 4, maxerr: 999*/

function getGenericAnnotationText(table_name, plot_data, point_number)
{
    if (debug_annotationMakers) console.log("getGenericAnnotationText");
    if (debug_annotationMakers) console.log("table_name " + table_name);
    //if (debug_annotationMakers) console.log("plot_data");
    //if (debug_annotationMakers) console.log(plot_data);
    //if (debug_annotationMakers) console.log("OPTR " + OPTR);
    //if (debug_annotationMakers) console.log("point_number " + point_number);
    if (debug_annotationMakers) console.log("table_schema");
    if (debug_annotationMakers) console.log(table_schema);
    var fields = table_schema[table_name].Fields;

    if (debug_annotationMakers) console.log("fields");
    if (debug_annotationMakers) console.log(fields);

    //var annotation_text = '<b>Patient: </b>' + OPTR + '<br />';
    var annotation_text = "";

    var date = plot_data.date[point_number];
    annotation_text += '<b>Date: </b>' + date + '<br />';

    $.each(fields, function(index, field_data){

        //if (debug_annotationMakers) console.log("field_data");
        //if (debug_annotationMakers) console.log(field_data);
        var display_name = field_data.DisplayName;
        var field_name = field_data.FieldName;
        var units = ("Units" in field_data) ? " " + field_data.Units : "";

        // This is a confusing mess, but the "units" field_name is used by the Weight
        // table to know when to convert lbs to kg, we do NOT want to display these units.
        // The units to display are assumed to be kg (therefore the need to convert lbs to kg).
        if (field_name != 'date' && field_name != 'units')
        {
            var data = plot_data[field_name][point_number];
            if (debug_annotationMakers) console.log("data for field " + field_name + ": " + data);

            // Time to get sophisticated about checking whether to display

            if (getShouldDisplayData(data))
            {
                if (debug_annotationMakers) console.log("Adding annotation text for field " + field_name + " " + data);
                // PT-129 "Limit number of decimal points for CA19-9 plot".
                if (table_schema[table_name].hasOwnProperty("yValueCol") &&
                    field_name == table_schema[table_name].yValueCol)
                {
                    // Assuming that value is parsable as a float?
                    annotation_text += '' +
                        '<b>' + display_name + '</b>: ' +
                        parseFloat(plot_data[field_name][point_number]).toFixed(0) +
                        units + '<br />';
                } else
                {
                    annotation_text += '' +
                        '<b>' + display_name + '</b>: ' +
                        plot_data[field_name][point_number] +
                        units + '<br />';
                }
                if (debug_annotationMakers) console.log("annotation text: " + annotation_text);
            }
        }


    });

    return annotation_text;
}

function getShouldDisplayData(data)
{
    var isnull = (data === null);
    var isnan = isNaN(data);
    var type = typeof data;
    var isnumber = (type == "Number");
    var isstring = (type == "string");

    var report = ""
        + "isnull: " + isnull + "\n"
        + "isnan: " + isnan + "\n"
        + "type: " + type + "\n"
        + "isnumber: " + isnumber + "\n"
        + "isstring: " + isstring;

    if (debug_annotationMakers) console.log(report);


    if (isnan && !isstring)
    {
        if (debug_annotationMakers) console.log(data + " is NaN value");
        return false;
    }

    if (isnull)
    {
        if (debug_annotationMakers) console.log("value is null -- probably missing or empty");
        return false;
    }

    if (data == "")
    {
        if (debug_annotationMakers) console.log("data is an empty string");
        return false;
    }

    if (data == "NA" || data == "Na" || data == "na")
    {
        if (debug_annotationMakers) console.log("got some sort of NA: " + data);
        return false;
    }

    if (debug_annotationMakers) console.log("data checks out for display");
    return true;
}