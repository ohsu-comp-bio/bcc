/*jslint browser: true, white: true, nomen: true, sloppy: true, vars: true, indent: 4, maxerr: 999*/

function getAnnotationMaker(table_name, plot_data, OPTR)
{
    //console.log("getAnnotationMaker");
    //console.log("table_name " + table_name);
    //console.log("plot_data");
    //console.log(plot_data);
    
    function getGenericAnnotationText(point_number)
    {
        //console.log("getGenericAnnotationText");
        //console.log("table_name " + table_name);
        //console.log("plot_data");
        //console.log(plot_data);
        //console.log("OPTR " + OPTR);
        //console.log("point_number " + point_number);
        //console.log("table_schema");
        //console.log(table_schema);
        var fields = table_schema[table_name].Fields;
        
        //console.log("fields");
        //console.log(fields);
        
        var annotation_text = '<b>Patient: </b>' + OPTR + '<br />';

        var date = plot_data.date[point_number];
        annotation_text += '<b>Date: </b>' + date + '<br />';
        
        $.each(fields, function(index, field_data){
            
            //console.log("field_data");
            //console.log(field_data);
            var display_name = field_data.DisplayName;
            var field_name = field_data.FieldName;
            var units = ("Units" in field_data) ? " " + field_data.Units : "";

            if (field_name != 'dummy' && field_name != 'date')
            {
                var data = plot_data[field_name][point_number];
                if (data != "" && data != "NaN")
                {
                    annotation_text += '' +
                            '<b>' + display_name + '</b>: ' +
                            plot_data[field_name][point_number] +
                            units + '<br />';
                    //console.log("annotation text: " + annotation_text);
                }
            }
            
            
        });

        return annotation_text;
    }
    
    return getGenericAnnotationText;
}

//annotation_makers['Diagnosis'] = getDiagnosisAnnotationText;


