// Just a note.
// Way to include external library
//${labkey.dependency(path = 'https://cdn.plot.ly/plotly-latest.min.js')};

//${labkey.dependency(path = 'https://cdn.plot.ly/plotly-latest.min.js')};

base_url = LABKEY.ActionURL.getContextPath();
console.log("base_url: " + base_url);

console.log("in test-plot.js");

$ = jQuery;


var script = document.createElement("script");
script.type = "text/javascript";
script.src = "/labkey/bcc/plotly_templates.js";
console.log(script);
document.body.appendChild(script);
var script2 = document.createElement("script");

script2.src = "/labkey/bcc/prettyprint.js";
document.body.appendChild(script2);


$(document).ready(function()
{

    console.log($('#plot-container').data);

    //********************
    // Main Routine

    $.getJSON(LABKEY.ActionURL.getContextPath() + '/bcc/ttb_plot_data_sources.json', function(response)
        {
            console.log("got json file");
            var fields = response;
            getOPTRs();
            configureOptionsDropdown(fields);
            configureSubmitButton(fields);

        })
    .fail(function(err)
        {
            console.log("jqXHR.readyState: " + jqXHR.readyState);
            console.log("jqXHR.status " + jqXHR.status);
            console.log("jqXHR.statusText " + jqXHR.statusText);
            console.log("jqXHR.responseText " + jqXHR.responseText);
            console.log("error_textStatus: " + error_textStatus);
            console.log(errorThrown + "<br/>");
        })
    .always(function()
        {
            console.log("complete");
        });

    //**********************



    // ****************************
    // Fill the select list for OPTRs

    // Query the OPTRs
    function getOPTRs()
    {

        console.log("in getOPTRs");
        var query_config = {
            "schemaName": "lists",
            "queryName": "CA199Table",
            "viewName": null,
            "dataRegionName": "query",
            "queryLabel": "PatientDemographics",
            "parameters":
            {},
            "maxRows": 5000,
            "requiredVersion": 13.2,
            "method": "POST",
            "columns": ["OPTR"],
            "sort": "OPTR"
        };

        query_config.success = function(results)
        {
            populateOPTRsFromQuery(results);
        };
        query_config.failure = onError;

        console.log("running optr query");
        LABKEY.Query.selectRows(query_config);

    }

    // Populate the select
    function populateOPTRsFromQuery(results)
    {
        console.log("beginning of populate optrs");
        //var optrs = [];
        //console.log("results");
        //console.log(results);
        //console.log(optrs);

        rows = results.getRows();
        //console.log(rows);

        // loop through OPTR results
        optrs = [];
        for (var index in rows)
        {
            //console.log("index: " + index);
            //console.log(rows[index]);
            // Make sure the row has an OPTR vaule to prevent errors
            if (rows[index].hasOwnProperty("OPTR"))
            {
                // Append OPTR to list of UNIQUE OPTRs
                var optr = rows[index]["OPTR"].value;
                //console.log("OPTR: " + optr);
                if (optrs.indexOf(optr) == -1)
                {
                    //console.log("optrs doesn't have: " + optr);
                    optrs.push(optr);
                    //console.log("appending text: " + "<option value=" + optr + ">" + optr + "</option>");
                    //console.log("appending: " + "<option value=" + optr + ">" + optr + "</option>");
                    $("<option value=" + optr + ">" + optr + "</option>").appendTo(
                        '#optr-select');
                    //$('#optr_select').append("<option value=" + optr + ">" + optr + "</option>");
                }
                else
                {
                    //console.log("optrs already has " + optr);
                }
            }

        }

        //console.log("end of success");
        //console.log(optrs);
    }

    //console.log("outside after");
    //console.log(optrs);

    //*****************************


    //*****************************
    // Populate graph options
    function populateGraphOptions(fields)
    {
        //console.log("fields");
        //console.log(fields);
        //console.log("populating graph options");
        for (var field in fields)
        {
            if (!fields.hasOwnProperty(field)){continue}

            console.log("option item: " + field);

            if (fields[field].Type == "Value")
            {
                var string =
                    "        <li>"
                    + "<input class='y-left-options' type='radio'"
                    + " id='" + field + "'"
                    + " name='y-left'"
                    + " value='" + field + "'>"
                    + fields[field].DisplayName
                    + "</li>";
                //console.log("option:");
                //console.log(string);
                $('#y-left-dropdown-list').append(string);
                var string =
                    "        <li>"
                    + "<input class='y-right-options' type='radio'"
                    + " id='" + field + "'"
                    + " name='y-right'"
                    + " value='" + field + "'>"
                    + fields[field].DisplayName
                    + "</li>";
                //console.log("option:");
                //console.log(string);
                $('#y-right-dropdown-list').append(string);
            }
            else if (fields[field].Type == "Event")
            {
                var string =
                    "        <li>"
                    + "<input class='events-checkboxes' type='checkbox'"
                    + " id='" + field + "'"
                    + " name='" + field + "'>"
                    + fields[field].DisplayName
                    + "</li>";
                //console.log("option:");
                //console.log(string);
                $('#event-dropdown-list').append(string);
            }

            //console.log($('#dropdown-list').html());
        }
    }
    //*****************************


    //******************************
    // Graph options dropdown control
    function configureOptionsDropdown(fields)
    {
        populateGraphOptions(fields);

        console.log("setting dropdown button event");
        $('.dropdown-button').on('click', function()
        {
            //console.log("id: " + $(this).attr('id'));
            var dropdown_list_target = $('#' + $(this).data('for'));
            var arrow = $(this).find('.arrow');
            if (dropdown_list_target.css('display') != 'none')
            {
                dropdown_list_target.css('display', 'none');
                arrow.html("&#x25bc;");
            }
            else
            {
                dropdown_list_target.css('display', 'block');
                arrow.html("&#x25b2;");
            }

        });

    }

    //*******************************
    // Program the submit button
    function configureSubmitButton(fields)
    {

        console.log("setting submit button event");
        $('#submit-options').on('click', function(event){
            //console.log("submit button clicked");

            //var selected_OPTR = $('#optr-select').val();
            var selected_OPTR = 4086;
            console.log("selected OPTR: " + selected_OPTR);

            //console.log("clearing current plot");
            Plotly.newPlot("plot_container",[{}],{title: "Patient: " + selected_OPTR});

            var plot_data =
            {
                y_left: {},
                y_right: {},
                events: []
            };

            //event.stopPropagation();
            //e.preventDefault();
            console.log("selected OPTR: " + $('#optr-select').val());
            console.log("selected data");

            var y_left = $('.y-left-options:checked').val();
            console.log("y-left: " + y_left);
            var y_right = $('.y-right-options:checked').val();
            console.log("y-right: " + y_right);
            //var events = $('events-checkboxes:checked');
            //console.log("events");
            //console.log(events);

            plot_data.y_left.field = y_left;
            plot_data.y_left.data = fields[y_left];
            plot_data.y_right.field = y_right;
            plot_data.y_right.data = fields[y_right];
            plot_data.selected_OPTR = selected_OPTR;


            var selected_events = [];
            $('.events-checkboxes:checked').each(function(index, checkbox)
            {
                field_name = checkbox.name;
                console.log("event field name: " + field_name);
                console.log("fields[" + field_name + "]");
                console.log(fields[field_name]);
                plot_data.events.push({field: field_name, field_data: fields[field_name]});
                console.log("event " + index + ": " + field_name + " " + checkbox.checked);
            });

            console.log("plot_data.events");
            console.log(plot_data.events);

            // Hide options dropdown in case it was down
            $('.dropdown-menu').each(function(index, item){
                $(this).css('display', 'none');
            });
            $('.dropdown-button').each(function(index, item){
                $(this).children('.arrow').html('&#x25bc;');
            });

            //return false;
            console.log("selected events");
            console.log(selected_events);

            console.log("plot_data");
            console.log(plot_data);

            console.log("calling plotSelected");
            plotSelected(plot_data);
        });

    }


    //**********************
    // Collect graph data

    function processError(error)
    {
        console.log("query error");
        Object.keys(error).forEach(item, index)
        {
            console.log(error[key]);
        }

    }


    function plotSelected(plot_data)
    {

        console.log("in plotSelected");
        console.log("y_left: " + plot_data.y_left.field + " y_right: " + plot_data.y_right.field);
        console.log("events:");
        console.log(plot_data.events);
        console.log("selected OPTR: " +  plot_data.selected_OPTR);

        var num_events = plot_data.events.length;

        // get y_left
        if (plot_data.y_left.field != "none")
        {

            var left_table_name = plot_data.y_left.data.TableName;
            var left_field_name = plot_data.y_left.field;
            var selected_OPTR = plot_data.selected_OPTR;

            console.log("plotting left " + left_table_name + "." + left_field_name);

            var filter_array = [{"name": "OPTR", "value": [selected_OPTR], "type": "eq"}];

            var left_timeline = new timeline_template();
            left_timeline.name = left_field_name;

            var left_x_axis = new x_axis_template();
            delete left_x_axis.tickvals;
            delete left_x_axis.ticktext;
            left_x_axis.nticks = 10;
            left_x_axis.tickmode = "auto";
            left_x_axis.type = "date";
            //x_axis.name = left_field_name;


            var left_y_axis = new y_axis_template();
            left_y_axis.title = left_field_name;
            left_y_axis.domain = [0, 1-0.1*num_events];
            //left_y_axis.side = "left";
            left_y_axis.position = 0;

            var left_layout = new layout_template();
            left_layout.yaxis1 = left_y_axis;
            left_layout.xaxis = left_x_axis;


            console.log("left_y_axis");
            //$.each(left_y_axis, function(key, val){console.log(key + ": " + val);});

            console.log("querying table " + left_table_name + " for field " + left_field_name + " for optr " + selected_OPTR);
            queryTable
            (
                left_table_name,
                left_field_name, // fields = ["field1", "field2", ...]
                selected_OPTR,
                filter_array, // filter_array = [ {"name": field_name, "value": [val1, val2, ...], "type": "eq"}, ...]
                function(results)
                    {
                        addToGraph(results, left_field_name, left_table_name, selected_OPTR, left_layout, left_timeline);
                    }, // success callback
                function(error)
                    {
                        console.log("query error for " + field_name);
                        Object.keys(error).forEach(item, index)
                        {
                            console.log(error[key]);
                        }
                        console.log(error);
                    } // error callback
            );

        }

        // get y_right
        if (plot_data.y_right.field != "none")
        {

            var right_table_name = plot_data.y_right.data.TableName;
            var right_field_name = plot_data.y_right.field;
            var selected_OPTR = plot_data.selected_OPTR;

            console.log("plotting right " + right_table_name + "." + right_field_name);

            var filter_array = [{"name": "OPTR", "value": [selected_OPTR], "type": "eq"}];

            var right_timeline = new timeline_template();
            right_timeline.name = right_field_name;

            var right_x_axis = new x_axis_template();
            right_x_axis.name = right_field_name;
            right_x_axis.nticks = 10;

            var right_y_axis = new y_axis_template();
            right_y_axis.title = right_field_name;
            right_y_axis.domain = [0, 1-0.1*num_events];
            //right_y_axis.side = "right";
            right_y_axis.position = 1;

            var right_layout = new layout_template();
            right_layout.yaxis2 = right_y_axis;
            right_layout.overlaying = "y";
            right_layout.xaxis = right_x_axis;


            console.log("right_y_axis");
            //$.each(right_y_axis, function(key, val){console.log(key + ": " + val);});

            console.log("querying table " + right_table_name + " for field " + right_field_name + " for optr " + selected_OPTR);
            queryTable
            (
                right_table_name,
                right_field_name, // fields = ["field1", "field2", ...]
                selected_OPTR,
                filter_array, // filter_array = [ {"name": field_name, "value": [val1, val2, ...], "type": "eq"}, ...]
                function(results)
                    {
                        addToGraph(results, right_field_name, right_table_name, selected_OPTR, right_layout, right_timeline);
                    }, // success callback
                function(error)
                    {
                        console.log("query error for " + field_name);
                        Object.keys(error).forEach(item, index)
                        {
                            console.log(error[key]);
                        }
                        console.log(error);
                    } // error callback
            );

        }

        //get events
        $.each(plot_data.events, function(index, item){

            var table_name = item.field_data.TableName;
            var field_name = item.field;
            var selected_OPTR = plot_data.selected_OPTR;

            console.log("plotting event " + table_name + "." + field_name);
            console.log(item);

            var filter_array = [{"name": "OPTR", "value": [selected_OPTR], "type": "eq"}];

            var timeline = new timeline_template();
            timeline.name = field_name;

            var x_axis = new x_axis_template();
            x_axis.nticks = 10;
            //x_axis.name = field_name;

            var y_axis = new y_axis_template();
            y_axis.title = field_name;
            low = 1.0 - 0.1*(index + 1);
            high = 1.0 - 0.1*index;
            y_axis.domain = [low, high];
            y_axis.position = 0;
            y_axis.range = [0,0];
            y_axis.showticklabels = false;
            //right_y_axis.side = "right";
            //right_y_axis.position = 1;

            y_axis_number = 2 + index + 1;
            var layout = new layout_template();
            layout["yaxis" + y_axis_number] = y_axis;
            timeline.yaxis = "y" + y_axis_number;
            //layout.overlaying = "y";
            layout.xaxis = x_axis;


            console.log("events y_axis " + y_axis_number);
            //$.each(right_y_axis, function(key, val){console.log(key + ": " + val);});

            console.log("querying table " + table_name + " for field " + field_name + " for optr " + selected_OPTR);
            queryTable
            (
                table_name,
                field_name, // fields = ["field1", "field2", ...]
                selected_OPTR,
                filter_array, // filter_array = [ {"name": field_name, "value": [val1, val2, ...], "type": "eq"}, ...]
                function(results)
                    {
                        addToGraph(results, field_name, table_name, selected_OPTR, layout, timeline);
                    }, // success callback
                function(error)
                    {
                        console.log("query error for " + field_name);
                        Object.keys(error).forEach(item, index)
                        {
                            console.log(error[key]);
                        }
                        console.log(error);
                    } // error callback
            );

        });


    }

    // Graphing routine??

    //var selected_OPTR = "4086";

    //var selected_OPTR = OPTR;

    function queryTable // parameters
    (
        table_name, // name of the table
        field, // fields = ["field1", "field2", ...]
        selected_OPTR, //
        filter_array, // filter_array = [ {"name": field_name, "value": [val1, val2, ...], "type": "eq"}, ...]
        processSucccess, // success callback
        processError // error callback
    )
    {
        console.log("in queryTable");
        console.log("table_name " + table_name + " field " + field);

        var query_config =
        {
            "schemaName": "lists",
            "queryName": table_name,
            "viewName": null,
            "dataRegionName": "query",
            "queryLabel": "None",
            "parameters":
            {},
            "maxRows": 5000,
            "requiredVersion": 13.2,
            "method": "POST",
            "columns": ['Date', field],
            "filterArray": filter_array,
            "success": processSucccess,
            "failure": processError
        };

        if (query_config.filterArray && query_config.filterArray.length > 0)
        {
            var filters = [];

            for (var i = 0; i < query_config.filterArray.length; i++)
            {
                var filter = query_config.filterArray[i];
                filters.push(LABKEY.Filter.create(filter.name, filter.value,
                    LABKEY.Filter.getFilterTypeForURLSuffix(
                        filter.type)));
            }

            query_config.filterArray = filters;
        }

        console.log("filters");
        console.log(filters);

        LABKEY.Query.selectRows(query_config);

        //return data;
    }

    function onError(errorInfo)
    {
        alert(errorInfo.exception);
    }

    function addToGraph(results, field_name, table_name, selected_OPTR, layout, timeline)
    {

        addToGraph.q = 0;

        console.log("in addToGraph. table_name: " + table_name + " field: " + field_name);


        // this is the query callback.

        var rows = results.rows;

        console.log("rows");
        console.log(rows);

        if (rows.length == 0)
        {
            console.log("no rows returned for table " + table_name + " field " + field_name);
            return;
        }

        if (!rows[0].hasOwnProperty('Date'))
        {
            console.log("table " + table_name + " has no Date field");
            return;
        }

        rows.sort(function(v1, v2)
        {
            return new Date(v1['Date'].value) - new Date(v2['Date'].value);
        });

        var length = rows.length;
        console.log("num rows returned " + length);

        var x = [], y = [];
        for (var idxRow = 0; idxRow < length; idxRow++)
        {
            var row = rows[idxRow];
            //console.log("row " + idxRow);
            //console.log(row);
            for (var key in row)
            {
                //console.log(key + ": " + row[key]);
                if (row.hasOwnProperty('Date'))
                {
                    //console.log(row['Date']);
                }
                else
                {
                    console.log("appears to not have a date");
                }
            }

            if (row.hasOwnProperty("Date"))
            {
                var temp_date = row['Date'].value;
                var real_date = new Date(temp_date);
                //console.log(real_date);
                //console.log("real_date " + real_date);
                var date = (new Date(temp_date)).toLocaleDateString();
                console.log("field " + field_name + " date " + date);
                //console.log("Date: " + date + " " + field + ": " + row[field].value);

                x.push(new Date(date));
                if (row.hasOwnProperty(field_name))
                {
                    console.log("has a field " + field_name);
                    y.push(row[field_name].value);
                }
                else
                {
                    console.log("does not have a field");
                    y.push(0);
                }

            }

        }

        console.log(x);
        console.log(y);

        //var x_dates = x.map(toDate);
        var x_dates = x;

        //console.log("x_dates");
        //console.log(x_dates);

        timeline.x = x;
        timeline.y = y;


        //addToPlot('plot-container', timeline, layout);

        console.log("x values");
        console.log(timeline.x);
        console.log("y values");
        console.log(timeline.y);

        h1 = document.createElement("h1");
        console.log("plotting " + timeline.name);
        console.log("adding trace for " + timeline.name);
        //console.log(pp(timeline));
        console.log(timeline);
        h1.innerHTML = "<h1>TIMELINE FOR " + timeline.name + "</h1>";
        document.body.appendChild(h1);
        document.body.appendChild(prettyPrint(timeline));
        Plotly.addTraces(plot_container, [timeline]);

        console.log("adding layout for " + timeline.name);
        //console.log(pp(layout));
        console.log(layout);
        console.log("tyring toString");
        console.log(layout.toString());
        console.log("trying JSON.stringify");
        console.log(JSON.stringify(layout.toString()));
        h1 = document.createElement("h1");
        h1.innerHTML = "<h1>LAYOUT FOR " + timeline.name + "</h1>";
        document.body.appendChild(h1);
        document.body.appendChild(prettyPrint(layout));
        Plotly.relayout(plot_container, layout);

        console.log(plot_container.layout);

        plot_container.on('plotly_click',function(data){
            //alert("plotly click");
            var point = data.points[0];

            var newAnnotation = {
                x: point.xaxis.d2l(point.x),
                y: point.yaxis.d2l(point.y),
                arrowhead: 8,
                ax: 0,
                ay: -80,
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                arrowcolor: point.fullData.marker.color,
                font:
                {
                    size: 12
                },
                bordercolor: point.fullData.marker.color,
                borderwidth: 3,
                borderpad: 4,
                text: '<b>Patient: </b>' + selected_OPTR + '<br>' +
                    '<b>Date: </b>' + x[point.pointNumber].toLocaleDateString() + '<br>' +
                    '<b>' + field_name + ': </b>' + point.y + '<br>'
            };

            var divid = document.getElementById('plot_container');
            var newIndex = (divid.layout.annotations || []).length;

            console.log(point.pointNumber);
            // delete instead if clicked twice
            if (newIndex)
            {
                var foundCopy = false;
                divid.layout.annotations.forEach(function(ann, sameIndex){
                    if (ann.text === newAnnotation.text)
                    {
                        Plotly.relayout(
                            'plot_container',
                            'annotations[' + sameIndex + ']',
                            'remove',[addToGraph.q]
                        );

                        foundCopy = true;

                    }
                });

                if (foundCopy)
                {
                    return;
                }

            }

            Plotly.relayout(
                'plot_container',
                'annotations[' + newIndex + ']',
                newAnnotation, [addToGraph.q]
            );
        })
        .on('plotly_clickannotation', function(event, data)
        {
            Plotly.relayout(
                'myDiv',
                'annotations[' + newIndex + ']',
                newAnnotation, [addToGraph.q]
            );
        });


        addToGraph.q += 1;


    }


    function toDate(d)
    {
        var parts = d.split('/');

        return new Date(parts[2], parts[0], parts[1]).getTime();
    }



    function pp(object, depth, embedded) {
      typeof(depth) == "number" || (depth = 0)
      typeof(embedded) == "boolean" || (embedded = false)
      var newline = false
      var spacer = function(depth) { var spaces = ""; for (var i=0;i<depth;i++) { spaces += "  "}; return spaces }
      var pretty = ""
      if (      typeof(object) == "undefined" ) { pretty += "undefined" }
      else if ( typeof(object) == "boolean" ||
                typeof(object) == "number" ) {    pretty += object.toString() }
      else if ( typeof(object) == "string" ) {    pretty += "\"" + object + "\"" }
      else if (        object  == null) {         pretty += "null" }
      else if ( object instanceof(Array) ) {
        if ( object.length > 0 ) {
          if (embedded) { newline = true }
          var content = ""
          for (var item in object) { content += pp(item, depth+1) + ",\n" + spacer(depth+1) }
          content = content.replace(/,\n\s*$/, "").replace(/^\s*/,"")
          pretty += "[ " + content + "\n" + spacer(depth) + "]"
        } else { pretty += "[]" }
      }
      else if (typeof(object) == "object") {
        if ( Object.keys(object).length > 0 ){
          if (embedded) { newline = true }
          var content = ""
          for (var key in object) {
            content += spacer(depth + 1) + key.toString() + ": " + pp(object[key], depth+2, true) + ",\n"
          }
          content = content.replace(/,\n\s*$/, "").replace(/^\s*/,"")
          pretty += "{ " + content + "\n" + spacer(depth) + "}"
        } else { pretty += "{}"}
      }
      else { pretty += object.toString() }
      return ((newline ? "\n" + spacer(depth) : "") + pretty)
    }

    function printObject(object)
    {
        $.each(object, function(key, val){
            if ((typeof val) == "Object")
            console.log(key + ": val");
        });
    }

    function addToPlot(div, trace, layout)
    {
    	Plotly.addTraces(div, [trace]);
        Plotly.relayout(div, layout);
    }

});


/*
1) tables object --> layout
2) tables object --> query
3) query --> process query
                   |
            _______V________
            |        ,     |
            V              V
        get layout     make graph

Problem: process query is passed data only from query.
How to get layout in scope of query callback?




        sql = ""
            + "select "
            + plot_data.y_left.data.TableName + "." + plot_data.y_left.field + " as left_data, "
            + plot_data.y_left.data.TableName + ".Date as left_date, "
            + plot_data.y_right.data.TableName + "." + plot_data.y_right.field + " as right_data, "
            + plot_data.y_right.data.TableName + ".Date as right_date "
            + "from " + plot_data.y_left.data.TableName + " full join " + plot_data.y_left.data.TableName + " "
            + "where "
            + plot_data.y_left.data.TableName + ".OPTR"
            + " = "
            + plot_data.y_right.data.TableName + ".OPTR"
            + ";";

        console.log("sql: " + sql);

        LABKEY.Query.executeSql(
        {
            schemaName: 'lists',
            sql: sql,
            success: function(results)
                {
                    alert("got results");
                    console.log(results.rows);
                    throw "exit";
                },
            failure: function(error)
                {
                    console.log("error");
                    console.log(error);
                    throw "exit";
                }
         });

*/


var timeline_template = function()
{
    this.textfont= {};
    this.error_x= {};
    this.error_y= {};
    this.yaxis= "";
    this.name= "";
    this.marker=
        {
            line:
            {
                //width: 2
            },
            //symbol: "square",
            size: 9
        };
    this.mode= "lines+markers";
    this.y= [];
    this.x= [];
    this.line=
        {
            //color:rgb(255, 127, 14),
            //width: 3
        };
    this.type= "scatter";
    this.uid= "";
    this.overlaying= "y";
};

var y_axis_template = function()
{
    this.title= "";
    this.domain= [0,1];
    this.showticklabels= true;
    //this.showexponent= "all";
    //this.gridcolor= "#eee";
    //this.linecolor= "#444";
    //this.mirror= false;
    this.linewidth= 1;
    this.autorange= true;
    this.nticks= 8;
    //this.zerolinecolor= "#444";
    //this.ticks= "";
    this.showgrid= true;
    //this.overlaying= "y";
    this.zeroline= true;
    this.type= "linear";
    //this.zerolinewidth= 1;
    this.ticklen= 5;
    this.titlefont=
        {
            //color: "",
            //family: "",
            //size: 0
        };
    //this.tickcolor= "#444";
    //this.showline= false;
    this.tickfont=
        {
            //color= "",
            //family: "",
            //size: 0
        };
    this.tickwidth= 1;
    //this.tick0= 0;
    this.tickangle= "auto";
    //this.gridwidth= 1;
    //this.dtick= 5;
    //this.side= "";
    this.rangemode= "normal";
    //this.range= [0.1, 27.289473684210527];
    //this.position= 0;
    this.anchor= "free";
    //this.exponentformat= "B";
    this.tickmode= "auto";
};

var x_axis_template = function()
{
    this.title= "x-axis";
    this.type = "date";
    this.titlefont=
        {
            color: "",
            family: "",
            size: 0
        };
    this.type= "linear";
    //domain= [0.08, 0.8];
    this.ticks= "outside";
    this.tickvals= [];
    this.ticktext= [];
    this.tickcolor= "#444";
    this.tickfont=
        {
            color: "rgb(107, 107, 107)",
            family: "",
            size: 11
        };
    this.tickwidth= 1;
    //this.tick0= 0;
    this.ticklen= 5;
    this.tickangle= 40;
    this.tickmode= "auto";
    this.showticklabels= true;
    //this.showexponent= "all";
    //this.showline= false;
    this.showgrid= true;
    //this.gridcolor= #eee;
    //this.linecolor= #444;
    //this.mirror= false;
    this.linewidth= 1;
    this.autorange= true;
    this.nticks= 8;
    //this.zerolinecolor= #444;
    //this.zerolinewidth= 1;
    //this.overlaying= false;
    //this.zeroline= false;
    //this.gridwidth= 1;
    //this.dtick= 2;
    //this.rangemode= "normal";
    //this.range= [0, 6.409927053599747];
    //this.position= 0;
    //this.anchor= "y";
    //this.exponentformat= "B";
};

var layout_template= function()
{
    //this.boxmode="overlay";
    //this.paper_bgcolor=#fff;
    //this.height=450;
    this.titlefont=
        {
            //color:"",
            //family:"",
            //size:0
        };
    //this.hovermode="x";
    this.font=
        {
            //color:#444,
            //family:"Open sans", verdana, arial, sans-serif",
            //size:12
        };
    //this.autosize=false;
    this.title="";
    //this.plot_bgcolor=#fff;
    //this.dragmode="zoom";
    //this.smith=false;
    //this.width=600;
    //this.bargap=0.2;
    //this.bargroupgap= 0;
    //this.hidesources= true;
    this.showlegend= true;
    this.separators= ".,";
    //this.barmode= "group";
    //this.boxgap= 0.3;
    this.legend=
    {
        //bordercolor: #444,
        //yanchor: "top",
        //traceorder: "normal",
        //xanchor: "left",
        //bgcolor: "rgba(255, 255, 255, 0)",
        //borderwidth: 0,
        //y: 0.9666666666666667,
        //x: 1.0476190476190477,
        font:
        {
            //color: "",
            //family: "",
            //size: 0
        }
    },
    this.position= 0;
};
