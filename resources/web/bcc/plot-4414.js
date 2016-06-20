function plot(selected_OPTR)
{
    console.log("in plot");

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
    var event_axis_height_increment = 0.07;
    var series_axis_position_increment = 0.07;
    var ranges = {};

    //var tables_to_plot =
    //[
    // 	"TreatmentTable",
    // 	"BloodDrawTable",
    // 	"DiagnosisTable",
    // 	"OncoLogTreatmentTable",
    // 	//"ImagingTable",
    // 	"SampleTable",
    // 	"CA199Table",
    // 	"TumorSizeTable",
    // 	"WeightTable"
    //];

    $.each(tables_to_plot, function(index, table_name)
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
    });

    var series_domain = [0, 1.0 - event_axis_height_increment*num_events];
    //console.log("series_domain");
    //console.log(series_domain);

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
    	title: "<b>Patient OPTR: " + selected_OPTR + "</b>",
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
    		domain: [series_axis_position_increment*(num_series-1), 1],
    		type: "date",
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
    			size: 18
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
        fields = getFields(table_name);
        //console.log(table_name + " fields");
        //console.log(fields);

        plot_data = getDataFromJS
        (
            table_name,
            fields,
            {key: "optr", value: selected_OPTR}
        );

        //console.log("plot_data for " + table_name);
        //console.log(plot_data);

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

        //console.log("plot_data.date");
        //console.log(plot_data.date);

        //console.log("plot_data['ykey']");
        //console.log(plot_data[y_key]);

        trace =
        {
            x: plot_data.date,
            y: plot_data[y_key],
            name: name,
            text: getText(annotation_maker, plot_data.date.length),
            hoverinfo: "name+text",
            type: 'scatter',
            mode: trace_mode,
            marker:
            {
                size: 14,
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
        console.log("trace.yaxis");
        console.log(trace.yaxis);
        traces.push(trace);

        yaxis =
        {
            titlefont:
            {
                size: 18,
                color: marker_colors[plot_number - 1]
            },
            ticklength: 10,
            tickfont:
            {
            	size: 18,
            	color: marker_colors[plot_number - 1]
            },
            side: "left",
            color: marker_colors[plot_number - 1],
            linecolor: marker_colors[plot_number-1],
            showline: true
        };

        if (schema.Type == "Series")
        {
            yaxis.position = series_axis_position;
            series_axis_position += series_axis_position_increment;

            //console.log("trying to set range for yaxisname " + yaxisname);
            //console.log(y_range);
            yaxis.range = y_range;
            yaxis.domain = series_domain;
            yaxis.overlaying = "y" + num_tables;
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
        	console.log("got event");
        	console.log("table name " + table_name);
            event_domain = [max_domain - event_axis_height_increment*0.9, max_domain];
            max_domain -= event_axis_height_increment;
            //console.log("max domain " + max_domain);
            console.log("domain");
            console.log(event_domain);

            yaxis.autorange = "true";
            yaxis.domain = event_domain;
            yaxis.nticks = 0;
            yaxis.showgrid = false;
            yaxis.showline = false;
            yaxis.showticklabels = false;
            yaxis.position = series_axis_position_increment*num_series;
            delete yaxis.range;

        }

        //console.log("setting layout for axis " + yaxisname);
        //var layout = base_layout;
        layout["yaxis" + yaxisname_modifier] = yaxis;
        //console.log("layout[" + yaxisname + "]");
        //console.log(layout[yaxisname]);
        //console.log("layout");
        //console.log(layout);
        //console.log("layout[yaxisname].range");
        //console.log(layout[yaxisname].range);

        //Plotly.relayout('graph', layout);
        //Plotly.addTraces('graph', [trace]);

    }

    //delete layout.yaxis.overlaying
    layout["yaxis" + num_tables].overlaying = false;

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