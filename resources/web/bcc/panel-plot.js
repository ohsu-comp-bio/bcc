
var data_sources = {};

function plotOPTR(tables_to_plot, selected_OPTR)
{
    multi_query = createMultiQuery(tables_to_plot, selected_OPTR);
    multi_query.send(function()
    {
        plot(tables_to_plot, selected_OPTR);
    });
}

function plot(tables_to_plot, selected_OPTR)
{
    console.log("in plot");
    //console.log("data_sources");
    //console.log(data_sources);

    var annotation_makers = {};
    var fields = [];
    var plot_data = {};
    var trace = {};
    var traces = [];
    var yaxis = {};
    var schema = {};
    var annotation = {};
    var annotation_maker;
    var event_yaxis_domain = [0.75, 1];
    var series_yaxis_domain = [0, 0.75];
    var max_domain = 1.0;
    var add_yaxis = false;
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
            //console.log(schema);
            if (table_schema[table_name].Type == "Event")
            {
                num_events += 1;
            }
        }
    });

    var num_markers = tables_to_plot.length;
    var marker_colors = makeMarkerColors(10, 350, 50, 50, num_markers);

    var base_layout =
    {
    	title: "<b>OPTR: " + selected_OPTR + "</b>",
    	titlefont:
    	{
    		size: 36
    	},
    	height: 600,
    	width: 1200,
    	hovermode: 'closest',
    	xaxis:
    	{
    		title: "<b>Date</b>",
    		position: 0,
    		//domain: [0, 1],
    		domain: [0.1, 1],
    		type: "Date",
    		tickmode: "auto",
    		showline: true,
    		nticks: 12,
    		tickangle: 45,
    		linewidth: 2,
    		tickfont:
    		{
    			size: 14
    		},
    		titlefont:
    		{
    			size: 14
    		}
    	}
    };

    var layout = base_layout;

    if (data_sources.hasOwnProperty("Demographics"))
    {
        fields = getFields("Demographics");

        plot_data = getTraceData
        (
            "Demographics",
            fields
        );

        if (plot_data.hasOwnProperty("Date Of Death"))
        {
        console.log("plot_data['Date Of Death'] " + plot_data["Date Of Death"]);

            if (plot_data["Date Of Death"] != "" && plot_data["Date Of Death"] != null)
            {
                shape =
                {
                    type: 'line',
                    // x-reference is assigned to the x-values
                    xref: 'x',
                    // y-reference is assigned to the plot paper [0,1]
                    //yref: 'paper',
                    yref: 'paper',
                    // Ariel mentioned full length lines, this would require min and max dates here.
                    x0: formatDate(plot_data["Date Of Death"]),
                    y0: 0,
                    x1: formatDate(plot_data["Date Of Death"]),
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
                    x: formatDate(plot_data["Date Of Death"]),
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
        }
    }

    var table_name;
    var plot_number = 0;
    var num_tables = tables_to_plot.length;

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
                } else
                {
                    Line =
                    {
                        color: marker_colors[plot_number - 1],
                        width: 3
                    };
                }

                //console.log(table_name + " schema");
                //console.log(schema);
                //console.log("getting fields for table " + table_name);
                fields = getFields(table_name);
                //console.log(table_name + " fields");
                //console.log(fields);

                //console.log("data_sources has own property " + table_name);
                plot_data = getTraceData
                (
                    table_name,
                    fields
                );
                plot_data.y_value = [];


                //console.log("plot_data for " + table_name);
                //console.log(plot_data);

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
                    trace_mode = "lines+markers";
                    for (var j = 0; j < plot_data.date.length; j++)
                    {
                        plot_data.y_value[j] = num_events - event_idx + 1;
                    }
                    yaxis_name_suffix = first_event_yaxis_idx > 1 ? first_event_yaxis_idx:""
                    yaxis_name = "yaxis" + yaxis_name_suffix;

                    // This worked except that the hovers for the ends of the lines interfered with
                    // the marker hovers.  This was even when the line hovers were off (set to 'none').
                    // The line hovers blocked the marker hovers when centered on the ends of the lines.
                    // Should be reported as a plotly bug.
                    // Add an additional trace for a line through events.
                    //console.log("plot_data.date: " + plot_data.date);
                    //trace =
                    //{
                    //    x: [plot_data.date[0], plot_data.date[plot_data.date.length - 1]],
                    //    y: [plot_data.y_value[0], plot_data.y_value[0]],
                    //    hoverinfo: 'none',
                    //    type: 'scatter',
                    //    mode: 'line',
                    //    line:
                    //    {
                    //        color: Line.color
                    //    },
                    //    yaxis: "y" + yaxis_name_suffix,
                    //    showlegend: false
                    //};
                    //traces.push(trace);

                    // This works, but just using "trace_mode = 'lines+markers'" above is much simpler.
                    // Plus, the 'lines+markers' method has the behavior of removing the line when the legend is
                    // clicked to remove the markers (this is the behavior desired by Patrick).
                    //shape =
                    //{
                    //    type: 'line',
                    //    // x-reference is assigned to the x-values
                    //    xref: 'x',
                    //    // y-reference is assigned to the plot paper [0,1]
                    //    //yref: 'paper',
                    //    yref: "y" + yaxis_name_suffix,
                    //    // Ariel mentioned full length lines, this would require min and max dates here.
                    //    x0: plot_data.date[0],
                    //    y0: plot_data.y_value[0],
                    //    x1: plot_data.date[plot_data.date.length - 1],
                    //    y1: plot_data.y_value[0],
                    //    //fillcolor: '#d3d3d3',
                    //    opacity: 0.5,
                    //    layer: "below",
                    //    line: Line
                    //};
                    //if (!layout.hasOwnProperty("shapes"))
                    //{
                    //    layout.shapes = [];
                    //}
                    //layout.shapes.push(shape);
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
                    trace_mode = "lines+markers";

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

                console.log("add_yaxis " + add_yaxis);
                console.log("yaxis_idx " + yaxis_idx);
                console.log("yaxis_name " + yaxis_name);

                if (add_yaxis == true)
                {
                    layout[yaxis_name] = yaxis;
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

                var annotation_maker = getAnnotationMaker(table_name, plot_data, selected_OPTR);
                var MultiLegendColorCycleIdx = 0;

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
                                hoverText.push(annotation_maker(index2));
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

                        // If marker not found above, check for color cycle.
                        if (!bMarkerFound && schema.hasOwnProperty("MultiLegendColorCycle"))
                        {
                            console.log("MultiLegendColorCycle " + schema.MultiLegendColorCycle[MultiLegendColorCycleIdx]);
                            LegendMarker.color = schema.MultiLegendColorCycle[MultiLegendColorCycleIdx];
                            LegendLine.color = LegendMarker.color;
                            if (add_yaxis == true)
                            {
                                layout[yaxis_name].titlefont.color =  LegendMarker.color;
                                layout[yaxis_name].tickfont.color =  LegendMarker.color;
                                layout[yaxis_name].color =  LegendMarker.color;
                                layout[yaxis_name].linecolor =  LegendMarker.color;
                                add_yaxis = false;
                            }
                            MultiLegendColorCycleIdx += 1;
                            if (MultiLegendColorCycleIdx >= schema.MultiLegendColorCycle.length)
                            {
                                MultiLegendColorCycleIdx = 0;
                            }
                        }
                    } else
                    {
                        x = plot_data.date;
                        y = plot_data.y_value;
                        hoverText = getText(annotation_maker, plot_data["date"].length)
                    }

                    //console.log("name for annotation maker " + legendText);
                    annotation_makers[legendText] = annotation_maker;
                    //console.log(plot_data.date);

                    trace =
                    {
                        x: x,
                        y: y,
                        autotick: false,
                        ticks: y,
                        name: legendText,
                        text: hoverText,
                        hoverinfo: 'text',
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
                console.log("Not Event or Series");
                console.log(data_sources[table_name]);
            }
        }  else
        {
            //console.log("data_sources DOES NOT have own property " + table_name);
            //console.log("data sources:");
            //console.log(data_sources);
        }

    }


    //delete layout.yaxis.overlaying
    //console.log("setting overlaying");
    //console.log(layout);
    //console.log("yaxis_name " + yaxis_name);
    //console.log("num_tables " + num_tables);
    num_tables_plotted = Object.keys(data_sources).length;
    //console.log("num_tables_plotted " + num_tables_plotted);
    //layout[yaxis_name].overlaying = false;
    //layout["yaxis10"].overlaying = false;

    //console.log("setting layout")
    //layout[yaxis_name].overlaying = false;

    Plotly.newPlot("graph", traces, layout);

    g = document.getElementById('graph');
    //console.log("g.layout");
    //console.log(g.layout);
    //console.log("g.data");
    //console.log(g.data);

    a = 10;

    replot = function(plot=g)
    {
        Plotly.redraw(plot);
    }

    myPlot = document.getElementById('graph');

    myPlot
	    .on('plotly_click', function(data)
	    {
	        makeAnnotations(data, annotation_makers);
	    })
	    .on('plotly_clickannotation', function(event, data)
	    {
	        Plotly.relayout
	        (
	            'graph',
	            'annotations[' + newIndex + ']',
	            newAnnotation
	        );
	    });

}

function getFields(table_name)
{
    //console.log("getting fields for table " + table_name);

    var fields = [];

    $.each(table_schema[table_name].Fields, function(index, item){

        //console.log("index: " + index + "item");
        //console.log(item);
        fields.push(item.FieldName);
    });

    //console.log("fields");
    //console.log(fields);

    return fields;
}

function getText(annotation_maker, N)
{
    var text = [];

    var i;
    for (i = 0 ; i < N ; i++)
    {
        text.push(annotation_maker(i));
    }

    return text;
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
        //console.log("hue: " + hue);
        color_text = "hsl(" +
          hue + ", " +
          saturation + "%, " +
          value + "%)";
        //console.log("color_text");
        //console.log(color_text);

        color_texts.push(color_text);

        var el = $('<div></div>');
        el.attr('class', 'color-spot').attr('id', color_text);
        el.css({"background-color": color_text, "height": "20px", "width": "20px"});

        el.appendTo('#color-spots');
        //console.log(el[0].outerHTML);
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

function staggerMarkers(date, y)
{
    var y2 = [];

    $.each(x, function(idx, x)
    {
        if (item2 == legendText)
        {
            x.push(plot_data.date[index2]);
            y.push(plot_data.y_value[index2]);
            hoverText.push(annotation_maker(index2));
        }
    });

	return y2;
}

function uniq(a)
{
    var seen = {};
    return a.filter(function(item)
    {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}