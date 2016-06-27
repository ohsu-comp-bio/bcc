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
    console.log("data_sources");
    console.log(data_sources);

    console.log("setting variables");
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
    var event_domain = [];
    var series_domain = [];
    var max_domain = 1.0;
    var num_events = 0;
    var num_series = 0;
    var series_axis_positions = {};
    var trace_mode;
    var event_axis_height_increment = 0.1;
    var series_axis_positions_increment = 0.1;
    var ranges = {};
    var event_count;
    var series_count;

    //console.log("marker colors");
    //console.log(marker_colors);

/*
    // start out with empty plot
    Plotly.newPlot("graph", [],
    {
        title: "Patient: " + selected_OPTR,
        height: 800
    });
*/

    //console.log("table_schema");
    //console.log(table_schema);

    //console.log("Object.keys(table_schema)");
    //console.log(Object.keys(table_schema));
    //table_names = Object.keys(table_schema);
    //console.log("table_names");
    //console.log(table_names);

    var yaxis_count = 0;
    var events_count = 0;
    var series_axes_count = 0;

    var yaxes = {};
    var series_units = {};
    var yaxis_number = 0;
    var num_axes = 0;
    var series_yaxis_positions = {};
    var series_yaxis_count = 0;

    console.log("getting yaxis names and counting events and series");
    $.each(tables_to_plot, function(index, table)
    {
        schema = table_schema[table];
        var units = schema.hasOwnProperty("Units") ? schema.Units : "NA";
        console.log("table " + table + " units " + units);
        if (schema.Type == "Event")
        {
            console.log("event");
            yaxis_number += 1;
            num_events += 1;
            yaxes[table] =
            {
                yaxis: "yaxis" + yaxis_number,
                yaxis_ref: "y" + yaxis_number
            }
        }
        else
        {
            console.log("series");
            num_series += 1;
            if (series_units.hasOwnProperty(units))
            {
                console.log("units already present");
                yaxes[table] = yaxes[series_units[units][0]];
                series_units[units].push(table);
            }
            else
            {
                yaxis_number += 1;
                series_yaxis_count += 1;
                series_units[units] = [table];
                yaxes[table] =
                {
                    yaxis: "yaxis" + yaxis_number,
                    yaxis_ref: "y" + yaxis_number
                }
            }
            series_yaxis_positions[table] = (series_yaxis_count - 1)*series_axis_positions_increment;
            console.log("series units");
            console.log(series_units);
        }
        console.log("yaxes");
        console.log(yaxes);
    });

    var num_axes = yaxis_number;

    console.log("num events " + num_events);
    console.log("num series " + num_series);
    console.log("num_axes " + num_axes);

    var series_y_domain = [0, 1.0 - event_axis_height_increment*num_events];
    console.log("series_y_domain");
    console.log(series_y_domain);
    var num_series_units = Object.keys(series_units).length;
    var x_domain = [series_axis_positions_increment*(num_series_units - 1), 1.0];
    console.log("x domain");
    console.log(x_domain);
    console.log("series yaxis_positions");
    console.log(series_yaxis_positions);

    //console.log("series_domain");
    //console.log(series_domain);

    var num_markers = tables_to_plot.length;
    var marker_colors = makeMarkerColors(0, 360, 80, 50, num_markers);

    var base_layout =
    {
    	title: "<b>OPTR: " + selected_OPTR + "</b>",
    	titlefont:
    	{
    		size: 36
    	},
    	height: 800,
    	width: 1200,
    	hovermode: 'closest',
    	xaxis:
    	{
    		title: "<b>Date</b>",
    		position: 0,
    		domain: x_domain,
    		type: "date",
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
    var plot_number;
    var num_tables = tables_to_plot.length;


    for (var i = 0 ; i < num_tables ; i ++)
    {
    	plot_number = i + 1;
    	console.log(plot_number);
    	table_name = tables_to_plot[i];

        console.log("plotting table " + plot_number + ": " + table_name);
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

        if (data_sources.hasOwnProperty(table_name))
        {
            console.log("data_sources has own property " + table_name);
            plot_data = getTraceData
            (
                table_name,
                fields
            );


            console.log("plot_data for " + table_name);
            console.log(plot_data);

            var annotation_maker = getAnnotationMaker(table_name, plot_data, selected_OPTR);
            //console.log("name for annotation maker " + name);
            annotation_makers[name] = annotation_maker;
            //console.log(plot_data.date);


            if (schema.Type == "Event")
            {
                y_key = "dummy";
                trace_mode = "markers";
                event_count += 1;
            }
            else
            {
                y_key = fields[1];
                trace_mode = "lines+markers";

                var y = plot_data[y_key].map(parseFloat);
                y_range = getRange(y, 1);
                ranges["yaxis" + yaxes[table_name].yaxis] = y_range;
                //console.log("y_range");
                //console.log(y_range);
            }

            //console.log("y_key " + y_key);

            //console.log("plot_data.date");
            //console.log(plot_data.date);

            //console.log("plot_data['ykey']");
            //console.log(plot_data[y_key]);

            trace =
            {
                x: plot_data.Date,
                y: plot_data[y_key],
                name: name,
                text: getText(annotation_maker, plot_data.Date.length),
                hoverinfo: "text",
                type: 'scatter',
                mode: trace_mode,
                marker:
                {
                    size: 11,
                    color: marker_colors[plot_number - 1],
                    symbol: plot_number*4
                },
                line:
                {
                    width: 2
                },
                yaxis: yaxes[table_name].yaxis_ref
            };

            console.log(yaxes[table_name].yaxis);
            console.log("trace" + plot_number);
            console.log(trace);
            console.log("trace.yaxis: " + trace.yaxis);
            traces.push(trace);

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
                showline: true
            };

            if (schema.Type == "Series")
            {
                console.log("yaxis position for table name " + table_name + " is " + series_yaxis_positions[table_name]);
                yaxis.position = series_yaxis_positions[table_name];
                yaxis.range = y_range;
                yaxis.domain = series_y_domain;
                yaxis.overlaying = "y" + num_axes;
                //yaxis.overlaying = false;
                //yaxis.overlaying = "y12";
                yaxis.title = "<b>" + schema.DisplayName + units + "</b>";
                yaxis.nticks = 7;
                yaxis.showgrid = false;
                yaxis.showline = true;
                yaxis.showticklabels = true;
                //yaxis.zeroline = true;
                yaxis.gridcolor = marker_colors[plot_number];
            }
            else
            {
                //console.log("got event");
                //console.log("table name " + table_name);
                event_domain = [max_domain - event_axis_height_increment, max_domain];
                yaxis.domain = event_domain;
                max_domain -= event_axis_height_increment;
                //console.log("max domain " + max_domain);
                //console.log("domain");
                //console.log(event_domain);
                //yaxis.overlaying = false;
                //yaxis.overlaying = "y" + num_axes;
                //yaxis.overlaying = "y12"
                yaxis.autorange = "true";
                //yaxis.domain = [0.86, 1];
                yaxis.nticks = 0;
                yaxis.showgrid = false;
                yaxis.showline = false;
                yaxis.showticklabels = false;
                yaxis.position = series_axis_positions_increment*Object.keys(series_units).length;
                delete yaxis.range;
            }

            console.log("setting layout for axis " + "yaxis" + yaxes[table_name].yaxis);
            //var layout = base_layout;
            if
                (
                    table_name == "PrimaryTumorSizeTable" ||
                    table_name == "Met1SizeTable" ||
                    table_name == "Met2SizeTable"
                )
            {
                yaxis.range = [0,50];
                console.log("tumor size table " + table_name);
                yaxis.title = "<b>Tumor Size (mm)</b>";
            }
            else
            {
                console.log("non tumor size table " + table_name);
            }

            layout[yaxes[table_name].yaxis] = yaxis;
            //console.log("layout[" + yaxisname + "]");
            //console.log(layout[yaxisname]);
            console.log("layout");
            console.log(layout);
            //console.log("layout[yaxisname].range");
            //console.log(layout[yaxisname].range);

            //Plotly.relayout('graph', layout);
            //Plotly.addTraces('graph', [trace]);

        }
        else
        {
            console.log("data_sources DOES NOT have own property " + table_name);
            //console.log("data sources:");
            //console.log(data_sources);
        }

    }


    //delete layout.yaxis.overlaying
    //console.log("setting overlaying");
    //console.log(layout);
    //console.log("yaxisname_modifier " + yaxisname_modifier);
    //console.log("num_tables " + num_tables);
    num_tables_plotted = Object.keys(data_sources).length;
    //console.log("num_tables_plotted " + num_tables_plotted);
    //layout["yaxis" + yaxisname_modifier].overlaying = false;
    //layout["yaxis10"].overlaying = false;

    //console.log("setting layout")
    //layout["yaxis" + yaxisname_modifier].overlaying = false;

//    traces[0].yaxis="y";
//    traces[1].yaxis="y2";
//    console.log("traces[1].yaxis");
//    console.log(traces[1].yaxis);

    Plotly.newPlot("graph", traces, layout);

    g = document.getElementById('graph');
    console.log("g.layout");
    console.log(g.layout);
    console.log("g.data");
    console.log(g.data);
    console.log("\n\n\n");

    console.log(JSON.stringify(g.layout));
    console.log(JSON.stringify(g.data));

    a = 10;

    replot = function(plot=g)
    {
        Plotly.redraw(plot);
    }


    /*
    console.log("ranges");
    console.log(ranges);

    for (var ax in ranges)
    {
    	console.log("setting range for axis " + ax + " to");
    	console.log(ranges[ax]);

    	g.layout[ax].range = ranges[ax];
    }
	*/

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
    console.log("getting fields for table " + table_name);

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

	return [min-fudge, max+fudge];
}

function createYAxis(table_name, table_type, units)
{

}