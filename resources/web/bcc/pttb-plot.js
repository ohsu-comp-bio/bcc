class PlotlyPlot
{
    /*

    Usage scenario:
    _______________

    tables_we_are_plotting = [...];
    schema = {};

    collectTheData(optr, callback=createOurPlot); // Main routine called by the UI after selecting the optr

    createOurPlot(data)
    {
        plot = new PlotlyPlot();

        num_yaxes = assess how many different axes types we have
        axes_positions = calculate axes positions
        xaxis_domain = calculate xaxis_domain

        plot.addX_Axis('Dates',
        {
            domain: xaxis_domain,
            position: xaxis_position,
            // other non-default properties
        });

        for table_name in tables we are plotting
        {
            var plot_data = getData(schema[table_name], data[table_name]); // basically what we already have

            var units_type = schema[table_name].Units; // e.g. TumorSize, Weight, Concentration. Basically one axis per unit type

            update range[units_type] based on current data;

            if (list of y axes does not already have one for this units_type)
            {
                plot.addAY_axis(units_type, {...various properties...});
            }
            else
            {
                update range for this units type
            }

            var display_name = schema[table_name].DisplayName;

            plot.addTrace(display_name, plot_data.x, plot_data.y, units_type, {...other propertie...}); // note: units_types give the yaxis name

            *** Somehow add method for making hover and click annotaitons. Not sure how this will work ***

            plot.updateLayout({...whatever needs to be added here such as title...});

            plot.generatePlot();

        }
    }

    Additional objects:
        map from units to axis name and if already created

    Additional functions:

        getData() // basically what we already have. Extracts data for a given table from the collection returned by the multi query
        calculate the range from the data

    */

    constructor()
    {
        this.yaxis_list = {};
        this.xaxis_list = {};
        this.traces_list = {};
        this.max_axis_number;

        this.traces = [];
        this.layout = {};
        this.updateLayout(
        {
            // default properties
        });
    }

    set divID(divID)
    {
        // Check to see if a div with that ID exists.
        // Either report problem, or create one
        this.divID = divID;
    }

    updateLayout(properties={})
    {
        this.layout =
        {
            // default values
        };

        for (var key in properties)
        {
            this.layout[key] = properties[key];
        }
    }

    addY_Axis(axis_name, properties={})
    {
        var new_yaxis =
        {
            // default properties
        };

        var yaxis_object =
        {
            yaxis_name: "yaxis" + this.max_yaxis_number,
            yaxis_name_ref: "y" + this.max_yaxis_number,
            yaxis_properties: new_yaxis
        }

        this.max_yaxis_number += 1;

        for (var key in properties)
        {
            new_yaxis[key] = properties[key];
        }

        this.yaxis_list[axis_name] = yaxis_object;

    }

    updateY_Axis(axis_name, properties={})
    {
        for (var key in properties)
        {
            this.yaxis_list[axis_name][key] = properties[key];
        }
    }

    addX_Axis(axis_name, properties={})
    {
        var new_xaxis =
        {
            // default properties
        };

        for (var key in properties)
        {
            new_xaxis[key] = properties[key];
        }

        for (var key in properties)
        {
            new_xaxis[key] = properties[key];
        }

        var xaxis_object =
        {
            xaxis_name: "xaxis" + this.max_xaxis_number,
            xaxis_name_ref: "x" + this.max_xaxis_number,
            xaxis_properties: new_xaxis
        }

        this.max_xaxis_number += 1;

        this.xaxis_list[axis_name] = xaxis_object;

    }

    updateX_Axis(axis_name, properties={})
    {
        for (var key in properties)
        {
            this.xaxis_list[axis_name][key] = properties[key];
        }
    }

    addTrace
        (
            name, // A name for the trace to allow easy removal or reconfiguration
            x, // x values
            y, // y values
            yaxis, // Name of the associated Y-axis, e.g. "TumorSizes" or "Weight"
            title, // The name as will appear in the legend.
            properties={} // non-default properties such as marker, line, color, hover and click annotations
        )
    {

        var yaxis_exists = Object.keys(yaxis_list).indexOf(yaxis) >= 0;
        if (!yaxis_exists)
        {
            console.log("Invalid y-axis " + yaxis + ".");
            console.log("Trace " + name + " not added.");

            return false;
        }

        var new_trace =
        {
            x: x,
            y: y,
            title: title,
            // other default properties
        };

        for (var key in properties)
        {
            new_trace[key] = properties[key];
        }

        new_trace.yaxis = this.yaxis_list[yaxis].yaxis_name_ref;

        this.traces_list[name] = new_trace;
    }

    updateTrace(name, properties={})
    {
        for (var key in properties)
        {
            this.traces_list[name][key] = properties[key];
        }
    }

    addAnnotations(schema, click=true, hover=true)
    {

    }

    generateAnnotation(point)
    {

    }

    generatePlot()
    {
        xaxis_list.forEach(function(object, name)
        {
            var axis_name = object.xaxis_name;
            var properties = object.xaxis_properties;
            this.layout[axis_name] = properties;
        });

        yaxis_list.forEach(function(object, name)
        {
            var axis_name = object.yaxis_name;
            var properties = object.yaxis_properties;
            this.layout[axis_name] = properties;
        });

        traces_list.forEach(function(object, name)
        {
            this.traces.push(object.trace_properties);
        });

        Plotly.newPlot(this.divID, this.traces, this.layout);
    }


}