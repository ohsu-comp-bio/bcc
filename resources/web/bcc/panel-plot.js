/*
var tables_to_plot =
[
    "DiagnosisTable",
    "BloodDrawTable",
    "TreatmentTable",
    "OncoLogTreatmentTable",
    //"ImagingTable",
    "SampleTable",
    "CA199Table",
    "TumorSizeTable",
    "WeightTable"
];
*/

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
    var series_axis_position = 0;
    var trace_mode;
    var event_axis_height_increment = 0.14;
    var series_axis_position_increment = 0.14;
    var ranges = {};


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
            else if (schema.Type == "Series")
            {
                num_series += 1;
            }
        }
    });

    var series_domain = [0, 1.0 - event_axis_height_increment*num_events];
    console.log("series_domain");
    console.log(series_domain);

    var num_markers = tables_to_plot.length;
    var marker_colors = makeMarkerColors(10, 350, 50, 50, num_markers);
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
    		//domain: [series_axis_position_increment*(num_series-1), 1],
    		domain: [0.1, 1],
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
    var plot_number = 0;
    var num_tables = tables_to_plot.length;

    for (var i = 0 ; i < num_tables ; i ++)
    {
    	table_name = tables_to_plot[i];
        if (data_sources.hasOwnProperty(table_name))
        {
            plot_number++;
            console.log(plot_number);

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


            var yaxisname_modifier = plot_number>1 ? plot_number : "";

            if (schema.Type == "Event")
            {
                y_key = "dummy";
                trace_mode = "markers";
            }
            else
            {
                y_key = fields[1];
                trace_mode = "lines+markers";

                var y = plot_data[y_key].map(parseFloat);
                y_range = getRange(y, 1);
                ranges["yaxis" + yaxisname_modifier] = y_range;
                //console.log("y_range");
                //console.log(y_range);

            }

            //console.log("y_key " + y_key);

            console.log("plot_Date");
            console.log(plot_data.Date);

            //console.log("plot_data['ykey']");
            //console.log(plot_data[y_key]);

            trace =
            {
                x: plot_data.Date,
                y: plot_data[y_key],
                autotick: false,
                ticks: plot_data.Date,
                ticks: plot_data.Date,
                name: name,
                text: getText(annotation_maker, plot_data["Date"].length),
                hoverinfo: "text",
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
                yaxis: "y" + yaxisname_modifier
            };

            console.log("trace" + plot_number);
            console.log(trace);
            console.log("trace.yaxis");
            console.log(trace.yaxis);
            trace.yaxis = "y" + yaxisname_modifier;
            if
                (
                    table_name == "PrimaryTumorSizeTable" ||
                    table_name == "Met1SizeTable" ||
                    table_name == "Met2SizeTable"
                )
            {
                console.log("tumor size table " + table_name);
                console.log("setting trace yaxis to y12");
                trace.yaxis = "y12";
            }

            console.log("trace.yaxis");
            console.log(trace.yaxis);
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
                //yaxis.position = series_axis_position;
                yaxis.position = 0;
                series_axis_position += series_axis_position_increment;

                //console.log("trying to set range for yaxisname " + yaxisname);
                //console.log(y_range);
                yaxis.range = y_range;
                yaxis.domain = series_domain;
                //yaxis.domain = [0,0.7]
                //yaxis.overlaying = "y" + num_tables;
                //yaxis.overlaying = "y12";
                yaxis.overlaying = false;
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
                max_domain -= event_axis_height_increment;
                //console.log("max domain " + max_domain);
                //console.log("domain");
                //console.log(event_domain);
                yaxis.overlaying = false;

                yaxis.autorange = "true";
                yaxis.domain = event_domain;
                //yaxis.domain = [0.86, 1];
                yaxis.nticks = 0;
                yaxis.showgrid = false;
                yaxis.showline = false;
                yaxis.showticklabels = false;
                yaxis.position = series_axis_position_increment*num_series;
                delete yaxis.range;

            }

            console.log("setting layout for axis " + "yaxis" + yaxisname_modifier);
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
                yaxis.position = 0.2;
                console.log("setting layout yaxis12 to yaxis");
                layout["yaxis12"] = yaxis;
                layout["yaxis12"].overlaying = false;
            }
            else
            {
                console.log("non tumor size table " + table_name);
                console.log("setting yaxis " + yaxisname_modifier);
                layout["yaxis" + yaxisname_modifier] = yaxis;
                if (schema.Type == "Series")
                {
                    layout["yaxis" + yaxisname_modifier].overlaying = "y12";
                }
                else
                {
                    layout["xaxis"].domain = [0.2, 1];
                    layout["yaxis" + yaxisname_modifier].overlaying = false;
                }

                if (table_name == "CA199Table")
                {
                    layout["yaxis" + yaxisname_modifier].position = 0.1;
                    layout["yaxis" + yaxisname_modifier].overlaying = "y12";
                }

            }


            //console.log("layout[" + yaxisname + "]");
            //console.log(layout[yaxisname]);
            //console.log("layout");
            //console.log(layout);
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
    console.log("num_tables_plotted " + num_tables_plotted);
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