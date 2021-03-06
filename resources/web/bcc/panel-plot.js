var panelPlotDebug  =false;


function plotOPTR(tables_to_plot, selected_OPTR, graph_div_id="graph")
{
    var data_sources = {};

    multi_query = createMultiQuery(tables_to_plot, data_sources, selected_OPTR);
    multi_query.send(function()
    {
        plot(tables_to_plot, selected_OPTR, data_sources, graph_div_id);
    });
}

function plot(tables_to_plot, selected_OPTR, data_sources, graph_div_id="graph")
{
    if (panelPlotDebug) console.log("in plot");
    //if (panelPlotDebug) console.log("data_sources");
    //if (panelPlotDebug) console.log(data_sources);

    var fields = [];
    var plot_data = {};
    var trace = {};
    var traces = [];
    var yaxis = {};
    var schema = {};
    var annotation = {};
    var event_yaxis_domain = [0.75, 1.00];
    var series_yaxis_domain = [0.00, 0.75];
    var max_domain = 1.0;
    var add_yaxis = false;
    var schema_defines_line = false;
    var yaxis_name = "";
    var yaxis_name_suffix = "";
    var yaxis_idx = 0;
    var series_yaxis_idx = 0;
    var first_event_yaxis_idx = 0;
    var first_series_yaxis_idx = 0;
    var num_events = 0;
    var event_idx = 0;
    var trace_mode;
    var series_axis_position_increment = 0.075;

    $.each(tables_to_plot, function(index, table_name)
    {
        if (data_sources.hasOwnProperty(table_name))
        {
            //if (panelPlotDebug) console.log(schema);
            if (table_schema[table_name].Type == "Event")
            {
                num_events += 1;
            }
        }
    });

    var num_markers = tables_to_plot.length;
    var marker_colors = makeMarkerColors(10, 350, 50, 50, num_markers);

    var layout =
    {
        //It is the responsibility of the caller to show the appropriate title.
    	height: 600,
    	hovermode: 'closest',
        margin : {
            t:30            //To Account for the title being removed
        },
    	xaxis:
    	{
    		position: 0,
    		domain: [0.1, 1],
    		type: "date",
            //range : to be set later after spinning through data

    		tickmode: "auto",
    		showline: true,
    		nticks: 12,
    		linewidth: 2,
    		tickfont:
    		{
    			size: 10
    		},
    		titlefont:
    		{
    			size: 10
    		}
    	}
    };

    var dateRange = {
        minDate : null,
        maxDate : null
    };

    if (data_sources.hasOwnProperty("Demographics"))
    {
        fields = getFields("Demographics");

        plot_data = getTraceData("Demographics", fields, data_sources, dateRange);

        var DOB = 'Invalid Date';
        var DOD = 'Invalid Date';
        if (plot_data.hasOwnProperty("Date Of Birth"))
        {
          DOB = new Date(plot_data["Date Of Birth"]);
        }
        if (plot_data.hasOwnProperty("Date Of Death"))
        {
          DOD = new Date(plot_data["Date Of Death"]);
        }

        if (DOD != 'Invalid Date')
        {
            // Add DOD into date range.
            if(!dateRange.minDate || dateRange.minDate > DOD){
                dateRange.minDate = DOD;
            }
            if(!dateRange.maxDate || dateRange.maxDate < DOD){
                dateRange.maxDate = DOD;
            }

            /*if (DOB != 'Invalid Date')
            {
                //var targetDate = new Date();
                var age = calculateAge(DOB, DOD);
                //if (panelPlotDebug) console.log("Age at death = " + age);
                if (plot_data.hasOwnProperty("Gender") && plot_data["Gender"] == "M")
                {
                    layout.title = "<b>Male deceased at age " + age + " (OPTR: " + selected_OPTR + ")</b>";
                } else if (plot_data.hasOwnProperty("Gender") && plot_data["Gender"] == "F")
                {
                    layout.title = "<b>Female deceased at age " + age + " (OPTR: " + selected_OPTR + ")</b>";
                } else
                {
                    layout.title = "<b>Patient deceased at age " + age + " (OPTR: " + selected_OPTR + ")</b>";
                }
            }*/

            shape =
            {
                type: 'line',
                // x-reference is assigned to the x-values
                xref: 'x',
                // y-reference is assigned to the plot paper [0,1]
                //yref: 'paper',
                yref: 'paper',
                x0: formatDate(DOD),
                y0: 0,
                x1: formatDate(DOD),
                y1: 1,
                //fillcolor: '#d3d3d3',
                opacity: 0.5,
                layer: "below",
                line:
                {
                    color: "red",
                    width: 1,
                    dash: 'dot'
                }
            };
            if (!layout.hasOwnProperty("shapes"))
            {
                layout.shapes = [];
            }
            layout.shapes.push(shape);

            annotation =
            {
                xref: 'x',
                yref: 'paper',
                x: formatDate(DOD),
                y: 0.5,
                textposition: 'top left',
                textangle: -90,
                showarrow: false,
                font: {
                    family: 'sans serif',
                    size: 24,
                    color: 'red'
                },
                text: "Deceased"
            };

            if (!layout.hasOwnProperty("annotations"))
            {
                layout.annotations = [];
            }
            layout.annotations.push(annotation);
        }
        // else  {
        //     if (DOB != 'Invalid Date')
        //     {
        //         //var targetDate = new Date();
        //         var age = calculateAge(DOB, new Date());
        //         //if (panelPlotDebug) console.log("Current age = " + age);
        //         if (plot_data.hasOwnProperty("Gender") && plot_data["Gender"] == "M")
        //         {
        //             layout.title = "<b>Male age " + age + " (OPTR: " + selected_OPTR + ")</b>";
        //         } else if (plot_data.hasOwnProperty("Gender") && plot_data["Gender"] == "F")
        //         {
        //             layout.title = "<b>Female age " + age + " (OPTR: " + selected_OPTR + ")</b>";
        //         } else
        //         {
        //             layout.title = "<b>Patient age " + age + " (OPTR: " + selected_OPTR + ")</b>";
        //         }
        //     }
        // }
    }

    var table_name;
    var plot_number = 0;
    var num_tables = tables_to_plot.length;

    if (panelPlotDebug) console.log("num_tables = " + num_tables);

    for (var i = 0 ; i < num_tables ; i ++)
    {
    	table_name = tables_to_plot[i];
        if (data_sources.hasOwnProperty(table_name))
        {
            schema = table_schema[table_name];
            if (schema.Type == "Event" || schema.Type == "Series")
            {
                plot_number++;

                var units = "";
                if (schema.hasOwnProperty("Units"))
                {
                    units = " (" + schema.Units + ")";
                }
                var name = schema.DisplayName + units;

                var Marker = {};
                var Line = {};

                if (schema.hasOwnProperty("Marker") )
                {
                    Marker = schema.Marker;
                } else
                {
                    Marker =
                    {
                       symbol: plot_number,
                       color: marker_colors[plot_number - 1],
                       size: 12
                     };
                }

                if (schema.hasOwnProperty("Line") )
                {
                    Line = schema.Line;
                    schema_defines_line = true;
                } else
                {
                    Line =
                    {
                        color: marker_colors[plot_number - 1],
                        width: 3
                    };
                    schema_defines_line = false;
                }

                fields = getFields(table_name);

                plot_data = getTraceData(table_name, fields, data_sources, dateRange);
                plot_data.y_value = [];

                add_yaxis = false;

                yaxis =
                {
                    titlefont:
                    {
                        size: 14,
                        color: Line.color
                    },
                    ticklength: 10,
                    tickfont:
                    {
                        size: 14,
                        color: Line.color
                    },
                    side: "left",
                    color: Line.color,
                    linecolor: Line.color,
                    showline: true,
                    zeroline: false,
                    overlaying: false
                };

                if (schema.Type == "Event")
                {
                    event_idx++;
                    if (event_idx == 1)
                    {
                        yaxis_idx++;
                        first_event_yaxis_idx = yaxis_idx;
                        yaxis.overlaying = false;
                        yaxis.autorange = "true";
                        yaxis.domain = event_yaxis_domain;
                        yaxis.nticks = 0;
                        yaxis.showgrid = false;
                        yaxis.showline = false;
                        yaxis.showticklabels = false;
                        yaxis.range = [0.5, num_events + 0.5];
                        add_yaxis = true;
                    }
                    if (schema_defines_line) trace_mode = "lines+markers"; else trace_mode = "markers";
                    for (var j = 0; j < plot_data.date.length; j++)
                    {
                        plot_data.y_value[j] = num_events - event_idx + 1;
                    }
                    yaxis_name_suffix = first_event_yaxis_idx > 1 ? first_event_yaxis_idx:""
                    yaxis_name = "yaxis" + yaxis_name_suffix;

                } else if (schema.Type == "Series")
                {
                    yaxis_idx++;
                    series_yaxis_idx++;
                    if (first_series_yaxis_idx == 0)
                    {
                      first_series_yaxis_idx = yaxis_idx;
                    } else
                    {
                      // Note that all 'series' data is displayed in the same region (x and y domain) on the
                      // graph.  Therefore, each series yaxis has to 'overlap' the first one.  However, there
                      // can be a new yaxis scale displayed for each series.
                      yaxis.overlaying = "y" + (first_series_yaxis_idx > 1 ? first_series_yaxis_idx:"");
                    }

                    yaxis_name_suffix = yaxis_idx > 1 ? yaxis_idx:"";
                    yaxis_name = "yaxis" + yaxis_name_suffix;
                    if (schema_defines_line) trace_mode = "lines+markers"; else trace_mode = "markers";

                    if (schema.hasOwnProperty("yValueCol") &&
                        plot_data.hasOwnProperty(schema.yValueCol))
                    {
                      plot_data.y_value = plot_data[schema.yValueCol];
                    }

                    // Might be better to handle this in a view with a calculated column.
                    if (table_name == "TumorSize")
                    {
                        for (var j = 0 ; j < plot_data["sizeAxis1"].length ; j++)
                        {
                            plot_data.y_value[j] = plot_data["sizeAxis1"][j];
                            if (plot_data["sizeAxis2"][j] && (plot_data["sizeAxis2"][j] > plot_data.y_value[j]))
                            {
                                plot_data.y_value[j] = plot_data["sizeAxis2"][j];
                            }
                            if (plot_data["sizeAxis3"][j] && (plot_data["sizeAxis3"][j] > plot_data.y_value[j]))
                            {
                                plot_data.y_value[j] = plot_data["sizeAxis3"][j];
                            }
                        }
                    } else if (table_name == "CA199")
                    {
                        y1 = plot_data.y_value.map(parseFloat);
                        //y2 = y1.map(toFixed(2));
                        for (var j = 0 ; j < y1.length ; j++)
                        {
                            y2 = y1[j].toFixed(2);
                        }
                    }

                    var y = plot_data.y_value.map(parseFloat);
                    yaxis.position = 0;
                    yaxis.range = getRange(y, 0.02);
                    yaxis.domain = series_yaxis_domain;
                    yaxis.title = "<b>" + schema.DisplayName + units + "</b>";
                    yaxis.nticks = 7;
                    yaxis.showgrid = false;
                    yaxis.showline = true;
                    yaxis.showticklabels = true;
                    yaxis.position = (series_yaxis_idx - 1) * series_axis_position_increment;
                    yaxis.gridcolor = Line.color;
                    add_yaxis = true;
                    layout.xaxis.domain = [(series_yaxis_idx - 1) * series_axis_position_increment + 0.025, 1];
                }

                if (panelPlotDebug) console.log("add_yaxis " + add_yaxis);
                if (panelPlotDebug) console.log("yaxis_idx " + yaxis_idx);
                if (panelPlotDebug) console.log("yaxis_name " + yaxis_name);

                if (add_yaxis == true)
                {
                    layout[yaxis_name] = yaxis;
                    layout["showlegend"] = true;
                }

                var uniqueIds = [];
                var doMultipleLegends = false;

                // The "MultiLegendIdCol" property of the table_schema tells us to group the data from a table
                // based on the specified column and create legend for each group.  Also, when graphing series
                // data this attribute tells us to make a separate line for each group.
                if (schema.hasOwnProperty("MultiLegendIdCol") &&
                    plot_data.hasOwnProperty(schema.MultiLegendIdCol))
                {
                    // We want a separate symbol and legend (and trace if a series) for each unique ID in the specified column.
                    doMultipleLegends = true;
                    uniqueIds = uniq(plot_data[schema.MultiLegendIdCol]);
                } else
                {
                    uniqueIds[0] = name;
                }

                var MultiLegendCycleIdx = 0;

                $.each(uniqueIds, function(index1, legendText)
                {
                    var x = [];
                    var y = [];
                    var hoverText = [];
                    var LegendMarker = JSON.parse(JSON.stringify(Marker));
                    var LegendLine = JSON.parse(JSON.stringify(Line));
                    if (doMultipleLegends)
                    {
                        // Get just the points matching each legend.
                        $.each(plot_data[schema.MultiLegendIdCol], function(index2, item2)
                        {
                            if (item2 == legendText)
                            {
                                x.push(plot_data.date[index2]);
                                y.push(plot_data.y_value[index2]);
                                hoverText.push(getGenericAnnotationText(table_name, plot_data, index2));
                            }
                        });
                        legendText = legendText + units;

                        // Now see if a specific Marker was defined for this legend.
                        var bMarkerFound = false;
                        if (schema.hasOwnProperty("MultiLegendMarkers"))
                        {
                            // Specific Markers are defined so see if one matches
                            $.each(schema.MultiLegendMarkers, function(markerIdx, legendEntry)
                            {
                                if (legendEntry.ID == legendText)
                                {
                                    LegendMarker = legendEntry.Marker;
                                    LegendLine.color = LegendMarker.color;
                                    bMarkerFound = true;
                                    if (add_yaxis == true)
                                    {
                                        layout[yaxis_name].titlefont.color =  LegendMarker.color;
                                        layout[yaxis_name].tickfont.color =  LegendMarker.color;
                                        layout[yaxis_name].color =  LegendMarker.color;
                                        layout[yaxis_name].linecolor =  LegendMarker.color;
                                        add_yaxis = false;
                                    }
                                }
                            });
                        }

                        // If marker not found above, check for color or symbol cycle.
                        if (!bMarkerFound)
                        {
                            if (schema.hasOwnProperty("MultiLegendColorCycle"))
                            {
                                //if (panelPlotDebug) console.log("MultiLegendColorCycle " + schema.MultiLegendColorCycle[MultiLegendCycleIdx]);
                                LegendMarker.color = schema.MultiLegendColorCycle[MultiLegendCycleIdx];
                                LegendLine.color = LegendMarker.color;
                                if (add_yaxis == true)
                                {
                                    layout[yaxis_name].titlefont.color =  LegendMarker.color;
                                    layout[yaxis_name].tickfont.color =  LegendMarker.color;
                                    layout[yaxis_name].color =  LegendMarker.color;
                                    layout[yaxis_name].linecolor =  LegendMarker.color;
                                    add_yaxis = false;
                                }
                                MultiLegendCycleIdx += 1;
                                if (MultiLegendCycleIdx >= schema.MultiLegendColorCycle.length)
                                {
                                    MultiLegendCycleIdx = 0;
                                }
                            } else if (schema.hasOwnProperty("MultiLegendSymbolCycle"))
                            {
                                //if (panelPlotDebug) console.log("MultiLegendSymbolCycle " + schema.MultiLegendSymbolCycle[MultiLegendCycleIdx]);
                                LegendMarker.symbol = schema.MultiLegendSymbolCycle[MultiLegendCycleIdx];
                                MultiLegendCycleIdx += 1;
                                if (MultiLegendCycleIdx >= schema.MultiLegendSymbolCycle.length)
                                {
                                    MultiLegendCycleIdx = 0;
                                }
                            }
                        }
                    } else
                    {
                        x = plot_data.date;
                        y = plot_data.y_value;
                        for (var j = 0; j < plot_data.date.length; j++)
                        {
                            hoverText.push(getGenericAnnotationText(table_name, plot_data, j));
                        }
                    }

                    //if (panelPlotDebug) console.log(plot_data.date);

                    trace =
                    {
                        x: x,
                        y: y,
                        autotick: false,
                        ticks: y,
                        name: legendText,
                        text: hoverText,
                        hoverinfo: 'text',
                        visible: legendText == 'Diagnosis' ? 'true' : 'legendonly',
                        type: 'scatter',
                        mode: trace_mode,
                        marker: LegendMarker,
                        line: LegendLine,
                        yaxis: "y" + yaxis_name_suffix
                    };

                    traces.push(trace);
                });
            } else
            {
                if (panelPlotDebug) console.log("Not Event or Series");
                if (panelPlotDebug) console.log(data_sources[table_name]);
            }
        }
    }

    //This fixes the date range.  Without this, the date range differs based on
    //what has been selected in the legend. This does not work well for event data.
    // Make sure date range is valid.
    if (dateRange.minDate && dateRange.maxDate) {
        // The date arithmetic below is not always working (see comment above about not working well with event data).
        // This must have something to do with the type of date objects that get defined under different circumstances.
        // Just adding and subtracting milliseconds from GMT time works better.
        //dateRange.minDate.setDate(dateRange.minDate.getDate() - 20);
        //dateRange.maxDate.setDate(dateRange.maxDate.getDate() + 20);
        //layout.xaxis.range = [ dateRange.minDate.getTime(), dateRange.maxDate.getTime() ];
        // 20 days in milliseconds: 1728000000
        layout.xaxis.range = [ dateRange.minDate.getTime() - 1728000000, dateRange.maxDate.getTime() + 1728000000 ];
    }

    num_tables_plotted = Object.keys(data_sources).length;

    // Change title if there is nothing to plot.  If OPTR exists there will be at least
    // one table plotted due to the Demographics table.  So there should be 2 or more tables plotted.
    if (num_tables_plotted == 0) // OPTR not found.
    {
        layout.title = "<b>OPTR: " + selected_OPTR + " not found.</b>";
    } else if (num_tables_plotted == 1) // OPTR found, but nothing to plot.
    {
        layout.title = "<b>No data to plot for OPTR: " + selected_OPTR + ".</b>";
    }

    Plotly.newPlot(graph_div_id, traces, layout);

    g = document.getElementById(graph_div_id);


    a = 10;

    replot = function(plot=g)
    {
        Plotly.redraw(plot);
    }

    myPlot = document.getElementById(graph_div_id);

    myPlot
	    .on('plotly_click', function(data) {
	        makeAnnotations(data, graph_div_id);
	    })
	    .on('plotly_clickannotation', function(event, data)
	    {
	        Plotly.relayout
	        (
	            graph_div_id,
	            'annotations[' + newIndex + ']',
	            newAnnotation
	        );
	    });

}

function getFields(table_name)
{
    //if (panelPlotDebug) console.log("getting fields for table " + table_name);

    var fields = [];

    $.each(table_schema[table_name].Fields, function(index, item){

        //if (panelPlotDebug) console.log("index: " + index + "item");
        //if (panelPlotDebug) console.log(item);
        fields.push(item.FieldName);
    });

    return fields;
}

function makeMarkerColors(hue_start, hue_end, saturation, value, steps)
{
    var hue = 0;
    var i = 0;
    var color_text = "";

    var color_texts = [];

    for (i = 0 ; i < steps ; i++)
    {
        hue = hue_start + i*(hue_end - hue_start)/steps;

        color_text = "hsl(" +
          hue + ", " +
          saturation + "%, " +
          value + "%)";

        color_texts.push(color_text);

        var el = $('<div></div>');
        el.attr('class', 'color-spot').attr('id', color_text);
        el.css({"background-color": color_text, "height": "20px", "width": "20px"});

        el.appendTo('#color-spots');
    }

    return color_texts;
}

function getRange(x, fudge)
{
	var min = x[0];
	var max = x[0];
	for (y of x)
	{
		if (y<min)
		{
			min = y;
		}
		if (y>max)
		{
			max = y;
		}
	}

	return [min - (fudge * (max - min)), max + (fudge * (max - min))];
}

function uniq(a)
{
    var seen = {};
    return a.filter(function(item)
    {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

function calculateAge(DOBstring, targetDate) {

    if(!DOBstring){
        return null;
    }

    var dateOfBirth = new Date(DOBstring);

    if (targetDate) {
        targetDate = new Date(targetDate)
    } else {
        targetDate = new Date();
    }

    if (panelPlotDebug) console.log(targetDate);
    if (panelPlotDebug) console.log(dateOfBirth);


    var targetYear = targetDate.getFullYear();
    var targetMonth = targetDate.getMonth();
    var targetDay = targetDate.getDate();

    var birthYear = dateOfBirth.getFullYear();
    var birthMonth = dateOfBirth.getMonth();
    var birthDay = dateOfBirth.getDate();

    var age = targetYear - birthYear;
    var ageMonth = targetMonth - birthMonth;
    var ageDay = targetDay - birthDay;

    if (ageMonth < 0 || (ageMonth == 0 && ageDay < 0)) {
        age = parseInt(age) - 1;
    }
    return age;
}

