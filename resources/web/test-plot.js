// Just a note.
// Way to include external library
//${labkey.dependency(path = 'https://cdn.plot.ly/plotly-latest.min.js')};

//${labkey.dependency(path = 'https://cdn.plot.ly/plotly-latest.min.js')};


console.log("in test-plot.js");

$ = jQuery;

$(document).ready(function()
{
    console.log
    console.log($('#plot-container').data);

//********************
// Main Routine

    $.getJSON('/labkey/ttb_plot_data_sources.json', function(response)
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




    //console.log("loading fields");
    //console.log(fields);

    // *** Not sure if this is needed. Was in old code.
    // Ensure that page dependencies are loaded
    //LABKEY.requiresExt3ClientAPI(true, function()
    //{
        //Ext.onReady(init_TTBplotA);
    //});

    //alert("changed13");

    // using global variable until I figure out how to
    // do it properly
    //all_graph_data = {};

    //console.log("before getting OPTRs");

    //console.log("calling getOPTRs");
    //var optrs = [];
    //getOPTRs();

    //console.log("after calling optrs");
    //console.log(optrs);



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
        console.log("fields");
        console.log(fields);
        console.log("populating graph options");
        for (var field in fields)
        {
            if (!fields.hasOwnProperty(field)){continue}

            console.log("option item: " + field);
            var string =
                "        <li>" + "<input class='OptionsCheckbox' type='checkbox' " +
                "id='" + field + "' name='" + field + "' checked>" + fields[field].DisplayName +
                "</li>";
            console.log(string);

            $('#dropdown-list').append(string);
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
        $('#dropdown-button').on('click', function()
        {

            if ($('#dropdown-list').css('display') != 'none')
            {
                $('#dropdown-list').css('display', 'none');
                $('#dropdown-button').html("Select Graph Data &#x25bc;");
            }
            else
            {
                $('#dropdown-list').css('display', 'block');
                $('#dropdown-button').html("Select Graph Data &#x25b2;");
            }

        });

    }

    //*******************************
    // Program the submit button
    function configureSubmitButton(fields)
    {

        console.log("setting submit button event");
        $('#submit-options').on('click', function(event){
            console.log("submit button clicked");

            console.log("clearing current plot");
            Plotly.newPlot("plot-container",[{}],{});

            var selected_fields = [];

            //event.stopPropagation();
            //e.preventDefault();
            console.log("selected OPTR: " + $('#optr-select').val());
            console.log("selected data");

            $('.OptionsCheckbox').each(function(index, checkbox)
            {
                field_name = checkbox.name;
                if (checkbox.checked)
                {
                    selected_fields[field_name] = fields[field_name];
                }
                console.log(index + ": " + field_name + " " + checkbox.checked);
            });

            // Hide options dropdown in case it was down
            $('#dropdown-list').prop('display', 'block');
            $('dropdown-button').html("Select Graph Data &#x25bc;");

            //return false;
            console.log(selected_fields);

            var selected_OPTR = $('#optr-select').val();
            selected_OPTR = 4086;
            console.log("selected OPTR: " + selected_OPTR);

            plotSelected(selected_fields, selected_OPTR);
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


    function plotSelected(selected_fields, selected_OPTR)
    {
        if (!$('#plot-container').hasClass('js-plotly-plot'))
        {
            console.log('No existing plot, so creating an empty plot');
            Plotly.newPlot("plot-container",[{}],{});
        }
        console.log("in plotSelected");
        console.log(selected_fields);
        var graph_data = [];
        // Populate all_graph_data
        for (field_name in selected_fields)
        {
            // safety thing that everyone says you need to do
            if (!selected_fields.hasOwnProperty(field_name)){continue;}

            console.log("field: " + field_name);
            console.log("field data: ");
            console.log(selected_fields[field_name]);

            table_name = selected_fields[field_name].TableName;
            //columns = table.Fields.forEach(function(index, item){return item.FieldName});
            //console.log("columns");
            //console.log(columns);

            filter_array = [{"name": "OPTR", "value": [selected_OPTR], "type": "eq"}];

            queryTable
                (
                    table_name,
                    field_name, // fields = ["field1", "field2", ...]
                    filter_array, // filter_array = [ {"name": field_name, "value": [val1, val2, ...], "type": "eq"}, ...]
                    function(results){addToGraph(results, table_name, field_name, selected_OPTR);}, // success callback
                    function(error)
                    {
                        console.log("query error");
                        console.log(error);
                    } // error callback
                );
        }
    }

    // Graphing routine??

    //var selected_OPTR = "4086";

    //var selected_OPTR = OPTR;

    function queryTable // parameters
    (
        table_name, // name of the table
        field, // fields = ["field1", "field2", ...]
        filter_array, // filter_array = [ {"name": field_name, "value": [val1, val2, ...], "type": "eq"}, ...]
        processSucccess, // success callback
        processError // error callback
    )
    {
        console.log("in queryTable");
        console.log(field);

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

        LABKEY.Query.selectRows(query_config);

        //return data;
    }


    function addToGraph(results, table_name, field, selected_OPTR)
    {
        console.log("in addToGraph. table_name: " + table_name + " field: " + field)

        // this is the query callback.

        var rows = results.rows;

        if (rows.length == 0)
        {
            console.log("no rows returned for table " + table_name + " field " + field);
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

            if (row.hasOwnProperty("Date") && row.hasOwnProperty(field))
            {
                var temp_date = row['Date'].value;
                var real_date = new Date(temp_date);
                //console.log(real_date);
                //console.log("real_date " + real_date);
                var date = (new Date(temp_date)).toLocaleDateString();
                //console.log("Date: " + date + " " + field + ": " + row[field].value);

                x.push(date);
                y.push(row[field].value);
            }

        }

        console.log(x);
        console.log(y);

        var timeline =
        {
            x: x.map(toDate),
            y: y,
            mode: 'lines+markers',
            type: 'scatter',
            marker:
            {
                size: 9
            },
            name: field
        };
        //graph_data.push(timeline);


        var layout =
        {
            title: selected_OPTR,
            displayModeBar: true,
            xaxis:
            {
                type: 'date',
                tickfont:
                {
                    color: "rgb(107, 107, 107)",
                    size: 11
                },
                ticks: "outside",
                tickwidth: 1,
                tickangle: 40,
                ticklen: 5,
                showticklabels: true,
                showline: false,
                showgrid: true,
                autorange: true,
            },
            yaxis1:
            {
                title: field,
                showgrid: true,
            }
        };

    /*
        Plotly.plot( "plot-container", [{
            x: [1, 2, 3, 4, 5],
            y: [1, 2, 4, 8, 16] }], {
            margin: { t: 0 } } );
        */

        console.log("plotting " + timeline.name);
        Plotly.plot
        (
            'plot-container',
            [timeline],
            layout
        );
    }


    dates = [];
    ca199 = [];
    console.log("calling doQuery");
    obj = new GraphData(["CA199"]);
    console.log("obj keys " + Object.keys(obj));
    //doQuery();
    console.log("called doQuery");

    console.log("get data: " + obj.getData());

    console.log("dates");
    console.log(dates);
    console.log("ca199");
    console.log(ca199);

    function doQuery()
    {
        // When all the dependencies are loaded we then load the data via selectRows.
        // The queryConfig object stores all the information needed to make a selectRows request.
        var query_config = {
            "schemaName": "lists",
            "queryName": "CA199Table",
            "viewName": null,
            "dataRegionName": "query",
            "queryLabel": "CA199Table",
            "parameters":
            {},
            "maxRows": 5000,
            "requiredVersion": 13.2,
            "method": "POST",
            "columns": ["Date", "CA199"],
            "filterArray": [
            {
                "name": "OPTR",
                "value": [selected_OPTR],
                "type": "eq"
            }]
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

        query_config.success = onSuccess;
        query_config.failure = onError;
        LABKEY.Query.selectRows(query_config);
    }


    function onError(errorInfo)
    {
        alert(errorInfo.exception);
    }


    //console.log(doQuery());


    function onSuccess(results)
    {
        console.log(testvar);
        //console.log(results);

        var rows = results.getRows();

        rows.sort(function(v1, v2)
        {
            return new Date(v1['Date'].value) - new Date(v2['Date'].value);
        });

        var data = '';
        var length = rows.length;
        console.log(length);

        for (var idxRow = 0; idxRow < length; idxRow++)
        {
            var row = rows[idxRow];

            var date = new Date(row['Date'].value).toLocaleDateString("en-US");
            //console.log("Date: " + date + " CA19-9: " + row['CA199'].value);

            dates.push(date);
            ca199.push(row['CA199'].value);

        }

        console.log(dates);
        console.log(ca199);

        console.log("listing");
        for (var i = 0; i < dates.length; i++)
        {
            console.log("[" + i + "] date: " + dates[i] + " ca199: " + ca199[i]);
        }

        console.log("making plot");
        makeScatterPlot(dates, ca199);

    }

    function toDate(d)
    {
        var parts = d.split('/');

        return new Date(parts[2], parts[0], parts[1]).getTime();
    }


    function makeScatterPlot(x, y)
    {
        console.log("in plot");
        console.log(x);
        console.log(y);

        var timeline = {
            x: x.map(toDate),
            y: y,
            mode: 'lines+markers',
            type: 'scatter',
            marker:
            {
                size: 9
            }
        };

        var data = [timeline];

        var layout = {
            title: "Title",
            displayModeBar: true,
            xaxis:
            {
                type: 'date',
                tickvals: x.map(toDate),
                ticktext: x,
                tickfont:
                {
                    color: "rgb(107, 107, 107)",
                    size: 11
                },
                ticks: "outside",
                tickwidth: 1,
                tickangle: 40,
                ticklen: 5,
                showticklabels: true,
                showline: false,
                showgrid: true,
                autorange: true,
            },
            yaxis:
            {
                showgrid: true,
            }
        };


        Plotly.plot(
            "myDiv",
            data,
            layout
        );

        myPlot = document.getElementById('myDiv');


        myPlot.on('plotly_click',
                function(data)
                {
                    alert("plotly click");
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
                            '<b>Date: </b>' + x[point.pointNumber] + '<br>' +
                            '<b>CA199: </b>' + point.y + '<br>'
                    };

                    var divid = document.getElementById('myDiv');
                    var newIndex = (divid.layout.annotations || []).length;

                    console.log(point.pointNumber);
                    // delete instead if clicked twice
                    if (newIndex)
                    {
                        var foundCopy = false;
                        divid.layout.annotations.forEach(
                            function(ann, sameIndex)
                            {
                                if (ann.text === newAnnotation.text)
                                {
                                    Plotly.relayout(
                                        'myDiv',
                                        'annotations[' + sameIndex + ']',
                                        'remove'
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
                        'myDiv',
                        'annotations[' + newIndex + ']',
                        newAnnotation
                    );
                })
            .on('plotly_clickannotation', function(event, data)
            {
                Plotly.relayout(
                    'myDiv',
                    'annotations[' + newIndex + ']',
                    newAnnotation
                );
            });

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



*/