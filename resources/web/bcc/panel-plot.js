
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
    var layouts = [];
    var yaxis = {};
    var layout = {};
    var schema = {};
    var annotation_maker;
    var y_key = "";
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
    var tumor_yaxis_idx = 0;
    var num_events = 0;
    var event_idx = 0;
    var trace_mode;
    var series_axis_position_increment = 0.075;

    $.each(tables_to_plot, function(index, table_name)
    {
        if (data_sources.hasOwnProperty(table_name))
        {
            schema = table_schema[table_name];
            //console.log(schema);
            if (schema.Type == "Event")
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

    var table_name;
    var plot_number = 0;
    var num_tables = tables_to_plot.length;

    for (var i = 0 ; i < num_tables ; i ++)
    {
    	table_name = tables_to_plot[i];
        if (data_sources.hasOwnProperty(table_name))
        {
            plot_number++;
            //console.log(plot_number);

            //console.log("plotting table " + plot_number + ": " + table_name);
            schema = table_schema[table_name];

            var units = "";
            if ("Units" in schema)
            {
                units = " (" + schema.Units + ")";
            }
            var name = schema.DisplayName + units;

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


            //console.log("plot_data for " + table_name);
            //console.log(plot_data);

            var annotation_maker = getAnnotationMaker(table_name, plot_data, selected_OPTR);
            //console.log("name for annotation maker " + name);
            annotation_makers[name] = annotation_maker;
            //console.log(plot_data.date);

            add_yaxis = false;

            yaxis =
            {
                titlefont:
                {
                    size: 14,
                    color: marker_colors[plot_number - 1]
                },
                ticklength: 10,
                tickfont:
                {
                    size: 14,
                    color: marker_colors[plot_number - 1]
                },
                side: "left",
                color: marker_colors[plot_number - 1],
                linecolor: marker_colors[plot_number-1],
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
                    trace_mode = "markers";
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
                y_key = "dummy";
                for (var j = 0; j < plot_data[y_key].length; j++)
                {
                    plot_data[y_key][j] = num_events - event_idx + 1;
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
                //    y: [plot_data[y_key][0], plot_data[y_key][0]],
                //    hoverinfo: 'none',
                //    type: 'scatter',
                //    mode: 'line',
                //    line:
                //    {
                //        color: marker_colors[plot_number - 1]
                //    },
                //    yaxis: "y" + yaxis_name_suffix,
                //    showlegend: false
                //};
                //traces.push(trace);

                shape =
                {
                    type: 'line',
                    // x-reference is assigned to the x-values
                    xref: 'x',
                    // y-reference is assigned to the plot paper [0,1]
                    //yref: 'paper',
                    yref: "y" + yaxis_name_suffix,
                    x0: plot_data.date[0],
                    y0: plot_data[y_key][0],
                    x1: plot_data.date[plot_data.date.length - 1],
                    y1: plot_data[y_key][0],
                    //fillcolor: '#d3d3d3',
                    opacity: 0.5,
                    line: {
                        width: 1,
                        color: marker_colors[plot_number - 1]
                    }
                };
                if (!layout.hasOwnProperty("shapes"))
                {
                    layout.shapes = [];
                }
                layout.shapes.push(shape);
            } else // Series
            {
                yaxis_idx++;
                series_yaxis_idx++;
                if (first_series_yaxis_idx == 0)
                {
                  first_series_yaxis_idx = yaxis_idx;
                } else
                {
                  yaxis.overlaying = "y" + (first_series_yaxis_idx > 1 ? first_series_yaxis_idx:"");
                }

                yaxis_name_suffix = yaxis_idx > 1 ? yaxis_idx:"";
                yaxis_name = "yaxis" + yaxis_name_suffix;
                y_key = fields[1];
                trace_mode = "lines+markers";

                var y = plot_data[y_key].map(parseFloat);
                yaxis.position = 0;
                yaxis.range = getRange(y, 0.02);
                yaxis.domain = series_yaxis_domain;
                yaxis.title = "<b>" + schema.DisplayName + units + "</b>";
                yaxis.nticks = 7;
                yaxis.showgrid = false;
                yaxis.showline = true;
                yaxis.showticklabels = true;
                yaxis.position = (series_yaxis_idx - 1) * series_axis_position_increment;
                yaxis.gridcolor = marker_colors[plot_number - 1];
                add_yaxis = true;
                layout.xaxis.domain = [(series_yaxis_idx - 1) * series_axis_position_increment + 0.025, 1];
            }

            console.log("add_yaxis " + add_yaxis);
            console.log("yaxis_idx " + yaxis_idx);
            console.log("yaxis_name " + yaxis_name);



            console.log("y_key");
            console.log(y_key);
            console.log("plot_data[y_key]");
            console.log(plot_data[y_key]);

            //console.log("plot_data['ykey']");
            //console.log(plot_data[y_key]);

            trace =
            {
                x: plot_data.date,
                y: plot_data[y_key],
                autotick: false,
                ticks: plot_data.date,
                name: name,
                text: getText(annotation_maker, plot_data["date"].length),
                hoverinfo: 'text',
                type: 'scatter',
                mode: trace_mode,
                marker:
                {
                    size: 12,
                    color: marker_colors[plot_number - 1],
                    symbol: plot_number
                },
                line:
                {
                    width: 3
                },
                yaxis: "y" + yaxis_name_suffix
            };

            //console.log("trace" + plot_number);
            //console.log(trace);
            //console.log("trace.yaxis");
            //console.log(trace.yaxis);
            //trace.yaxis = yaxis_name;
            if
                (
                    table_name == "PrimaryTumorSizeTable" ||
                    table_name == "Met1SizeTable" ||
                    table_name == "Met2SizeTable"
                )
            {
                //console.log("tumor size table " + table_name);
                //console.log("setting trace yaxis to y12");
                trace.yaxis = "y12";
            }

            if (add_yaxis == true)
            {
                layout[yaxis_name] = yaxis;
            }

            traces.push(trace);

            //console.log("setting layout for axis " + yaxis_name);
            //var layout = base_layout;
            if
                (
                    table_name == "PrimaryTumorSizeTable" ||
                    table_name == "Met1SizeTable" ||
                    table_name == "Met2SizeTable"
                )
            {
                yaxis.range = [0,50];
                //console.log("tumor size table " + table_name);
                yaxis.title = "<b>Tumor Size (mm)</b>";
                yaxis.position = 0.2;
                //console.log("setting layout yaxis12 to yaxis");
                layout["yaxis12"] = yaxis;
                layout["yaxis12"].overlaying = false;
            }

            //console.log("layout[" + yaxis_name + "]");
            //console.log(layout[yaxis_name]);
            //console.log("layout");
            //console.log(layout);
            //console.log("layout[yaxis_name].range");
            //console.log(layout[yaxis_name].range);

            //Plotly.relayout('graph', layout);
            //Plotly.addTraces('graph', [trace]);

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