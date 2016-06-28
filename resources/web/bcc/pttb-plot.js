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

    Useful References:
        https://plot.ly/javascript/reference/

        https://plot.ly/javascript-graphing-library/reference/

        https://plot.ly/javascript/axes/

        https://api.plot.ly/v2/plot-schema?sha1=%27%27

    */

    constructor()
    {
        this.yaxis_collection = {}; // Collection of yaxes stored by name for easier user reference
        this.xaxis_collection = {}; // Collection of xaxes stored by name for easier user reference
        this.traces_collection = {}; // Collection of xaxes stored by name for easier user reference
        this.max_axis_number; // Used to number the axes, for example yaxis1, yaxis2, ...

        this.traces = []; // the actual traces list passed to plotly
        this.layout = {}; // the actual layout object passed to plotly
        this.updateLayout(
        {
            // Code needed:
            // Initialize layout with default properties
        });
    }

    set divID(divID)
    {
        // Code needed:
        // Check to see if a div with that ID exists.
        // Either report problem, or create the necessary
        // div.

        this.divID = divID;
    }

    updateLayout(properties={})
    {
        this.layout =
        {
            // Code needed:
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
            // Code needed:
            // default properties
        };

        // This is the object to be stored in the yaxis collection.
        // It will be keyed by its name (also stored in `yaxis_name`).
        // It is important to understand that in the plotly layout object,
        // yaxes are referred to as yaxis, yaxis2, yaxis3, .... However,
        // they are referred to in the trace objects by y, y2, y3, ...
        // This tells plotly which axis to plot the trace on (for instance,
        // the axis for CA19-9 vs the one for Weight). This is one of the
        // VERY confusing aspects of plotly.
        //
        // With this system, a user can refer to and update a yaxis by user-defined
        // name.
        var yaxis_object =
        {
            yaxis_name: "yaxis" + this.max_yaxis_number, // Reference key for easy access by user
            yaxis_name_ref: "y" + this.max_yaxis_number, // The yaxis reference put into a trace object
            yaxis_number: max_yaxis_number,
            yaxis_properties: new_yaxis // The yaxis name put in the layout
        }

        this.max_yaxis_number += 1; // Increment to number the next yaxis.

        for (var key in properties)
        {
            new_yaxis[key] = properties[key];
        }

        this.yaxis_collection[axis_name] = yaxis_object;

    }

    updateY_Axis(axis_name, properties={})
    {
        for (var key in properties)
        {
            this.yaxis_collection[axis_name][key] = properties[key];
        }
    }

    // This is the object to be stored in the yaxis collection.
    // It will be keyed by its name (also stored in `xaxis_name`).
    // It is important to understand that in the plotly layout object,
    // xaxes are referred to as xaxis, xaxis2, xaxis3, .... However,
    // they are referred to in the trace objects by x, x2, x3, ...
    // This tells plotly which axis to plot the trace on. This is one of the
    // VERY confusing aspects of plotly.
    //
    // With this system, a user can refer to and update a xaxis by user-defined
    // name.
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

        var xaxis_object =
        {
            xaxis_name: "xaxis" + this.max_xaxis_number,
            xaxis_name_ref: "x" + this.max_xaxis_number,
            xaxis_number: max_xaxis_number,
            xaxis_properties: new_xaxis
        }

        this.max_xaxis_number += 1;

        this.xaxis_collection[axis_name] = xaxis_object;

    }

    updateX_Axis(axis_name, properties={})
    {
        for (var key in properties)
        {
            this.xaxis_collection[axis_name][key] = properties[key];
        }
    }

    // I have mixed feelings about this API regarding how many parameters should be passed in.
    // Really, everything but the name could be put in properties. My thought was to make
    // arguments for all the truly essential non-default items. But maybe that is overkill.
    addTrace
        (
            name, // A name for the trace to allow easy removal or reconfiguration
            x, // x values
            y, // y values
            yaxisname, // Name of the associated Y-axis, e.g. "TumorSizes" or "Weight"
            title, // The name as will appear in the legend.
            text, // Text available to show on hover
            hoverinfo, // what information is displayed on hover
            properties={} // non-default properties such as marker, line, color
        )
    {

        // The trace MUST be associated with a particular y axis or things
        // will go very wrong. So this is an important check.
        var yaxis_exists = Object.keys(yaxis_collection).indexOf(yaxis) >= 0;
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
            text: text,
            hoverinfo: hoverinfo
            // Need code;
            // other default properties
        };

        for (var key in properties)
        {
            new_trace[key] = properties[key];
        }

        // The user gives the name reference to the yaxis. However, plotly
        // needs a value like "y", "y2", "y3", etc. So the yaxis_name_ref
        // is extracted from the yaxis object for that name.
        new_trace.yaxis = this.yaxis_collection[yaxis].yaxis_name_ref;

        this.traces_collection[name] = new_trace;
        

    updateTrace(name, properties={})
    {
        for (var key in properties)
        {
            this.traces_collection[name][key] = properties[key];
        }
    }

    addAnnotations(schema, click=true, hover=true)
    {
        // this is going ot be complicated. It will involve
        // starting with Plotly.on('click',.....) as in current code.
        // Hopefully we can streamline the closure issue. I think
        // we might even want to look at the plotly source code
        // to better understand how the click events work and what
        // additional parameters can be passed in.
    }

    generateAnnotation(point)
    {
        // This is basically what happens inside the click event as
        // currently written. The click handler passes a point 
        // object to the click callback. The callback generates
        // an annotation and adds it to the plot.
        //
        // The tricky part is that we want to annotation to include
        // more data than what comes in with the point object. I'm 
        // not sure how isolated the click callback scope is, but 
        // we can experiment on finding the best way to handle it.
        // 
        // Another point is that the way I currently have the code,
        // I use the same function to create the text for the click
        // popup as for the hover. So it's good if it is an independent
        // method that gets passed into the click handler, rather
        // than something hard-coded into the click handler.
    }

    // At some point, calculations need to be done to create the lines
    // for the event type data and set their heights etc. Also, to set
    // the domains for the various y-axes and the xaxis for the event
    // sub plot.
    //
    // This could all be done here. But perhaps it would be neater
    // to have a configureAxes method called from inside
    // generatePlot.
    generatePlot()
    {
        // The layout has a key/value pair for each of the
        // xaxes which are named xaxis, xaxis1, xaxis2 etc.
        xaxis_collection.forEach(function(object, name)
        {
            var axis_name = object.xaxis_name;
            var properties = object.xaxis_properties;
            this.layout[axis_name] = properties;
        });
        
        // The layout has a key/value pair for each of the
        // yaxes which are named yaxis, yaxis1, yaxis2 etc.
        yaxis_collection.forEach(function(object, name)
        {
            var axis_name = object.yaxis_name;
            var properties = object.yaxis_properties;
            this.layout[axis_name] = properties;
        });

        // We have created a traces object with key/value
        // pairs for each trace object keyed by a user-defined
        // name. Plotly wants a list of trace objects. So
        // loop through the traces and push to a list.
        traces_collection.forEach(function(object, name)
        {
            this.traces.push(object.trace_properties);
        });

        Plotly.newPlot(this.divID, this.traces, this.layout);
        
        //Plotly.onClick(...)
        
        //Plotly.onHover(...)
    }


}