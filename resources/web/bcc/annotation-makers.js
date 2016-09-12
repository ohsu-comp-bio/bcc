/*jslint browser: true, white: true, nomen: true, sloppy: true, vars: true, indent: 4, maxerr: 999*/

function getAnnotationMaker(table_name, plot_data, OPTR, graph_div_id)
{
    //console.log("getAnnotationMaker");
    //console.log("table_name " + table_name);
    //console.log("plot_data");
    //console.log(plot_data);

    function getGenericAnnotationText(point_number)
    {
        console.log("getGenericAnnotationText");
        console.log("table_name " + table_name);
        //console.log("plot_data");
        //console.log(plot_data);
        //console.log("OPTR " + OPTR);
        //console.log("point_number " + point_number);
        console.log("table_schema");
        console.log(table_schema);
        var fields = table_schema[table_name].Fields;

        console.log("fields");
        console.log(fields);

        //var annotation_text = '<b>Patient: </b>' + OPTR + '<br />';
        var annotation_text = "";

        var date = plot_data.date[point_number];
        annotation_text += '<b>Date: </b>' + date + '<br />';

        $.each(fields, function(index, field_data){

            //console.log("field_data");
            //console.log(field_data);
            var display_name = field_data.DisplayName;
            var field_name = field_data.FieldName;
            var units = ("Units" in field_data) ? " " + field_data.Units : "";

            // This is a confusing mess, but the "units" field_name is used by the Weight
            // table to know when to convert lbs to kg, we do NOT want to display these units.
            // The units to display are assumed to be kg (therefore the need to convert lbs to kg).
            if (field_name != 'date' && field_name != 'units')
            {
                var data = plot_data[field_name][point_number];
                console.log("data for field " + field_name + ": " + data);

                // Time to get sophisticated about checking whether to display

                if (getShouldDisplayData(data))
                {
                    console.log("Adding annotation text for field " + field_name + " " + data);
                    annotation_text += '' +
                        '<b>' + display_name + '</b>: ' +
                        plot_data[field_name][point_number] +
                        units + '<br />';
                    console.log("annotation text: " + annotation_text);
                }
            }


        });

        return annotation_text;
    }

    return getGenericAnnotationText;
}

//annotation_makers['Diagnosis'] = getDiagnosisAnnotationText;


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

    console.log(report);


    if (isnan && !isstring)
    {
        console.log(data + " is NaN value");
        return false;
    }

    if (isnull)
    {
        console.log("value is null -- probably missing or empty");
        return false;
    }

    if (data == "")
    {
        console.log("data is an empty string");
        return false;
    }

    if (data == "NA" || data == "Na" || data == "na")
    {
        console.log("got some sort of NA: " + data);
        return false;
    }

    console.log("data checks out for display");
    return true;
}