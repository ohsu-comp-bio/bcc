function plot()
{
    console.log("in plot-test-1.js");

    selected_OPTR = 4086;

    var xy_temp;
    xy_temp = getDataFromJS
    (
        "CA199Table",
        {x: "date",y: "ca199"},
        {key: "optr",value: selected_OPTR}
    );

    var trace1 =
    {
        x: xy_temp.x,
        y: xy_temp.y,
        text: xy_temp.y,
        hoverinfo:"x+y+name",
        name: 'CA199',
        type: 'scatter',
        mode: 'lines+markers',
        marker:
        {
            size: 9,
            color: "#FFA500"
        }
    };

    var yaxis1 =
    {
        "title": "CA199",
        "titlefont":
        {
            size: 12,
            color: '#FFA500'
        },
        "domain": [0, 0.8],
        "showgrid": true,
        "side": "left",
        "nticks": 7,
        "showline": true
    };

    var layout1 =
    {
        yaxis1: yaxis1,
        hovermode: "closest"
    };

    xy_temp = getDataFromJS
    (
        "WeightTable",
        {x: "date",y: "weight"},
        {key: "optr",value: selected_OPTR}
    );

    var trace2 =
    {
        x: xy_temp.x,
        y: xy_temp.y,
        text: xy_temp.y,
        hoverinfo:"x+y+name",
        name: 'Weight',
        yaxis: 'y2',
        type: 'scatter',
        mode: "lines+markers",
        marker:
        {
            size: 9,
            color: "#808000"
        }
    };

    var yaxis2 =
    {
        "title": 'Weight',
        "titlefont":
        {
            size: 12,
            color: '#808000'
        },
        "domain": [0, 0.8],
        "showgrid": true,
        "gridcolor":
        {
            color: 'rgb(148, 103, 189)'
        },
        "overlaying": 'y1',
        "side": 'right',
        "nticks": 7,
        "showline": true
    };

    var layout2 =
    {
        yaxis2: yaxis2,
        hovermode: "closest"
    };

    xy_temp = getDataFromJS
    (
        "TreatmentTable",
        {
            x: "date",
            value: "type"
        },
        {
            key: "optr",
            value: selected_OPTR
        }
    );

    console.log("treatment type");
    console.log(xy_temp.value);

    trace3 =
    {
        x: xy_temp.x,
        y: xy_temp.y,
        text: xy_temp.value,
        hoverinfo: "x+text",
        name: 'Treatment',
        yaxis: 'y3',
        type: 'scatter',
        mode: "markers",
        marker:
        {
            size: 9,
            color: "#800000"
        }
    }

    var yaxis3 =
    {
        "titlefont":
        {
            size: 12,
            color: '#800000'
        },
        "domain": [0.85, 0.9],
        "showgrid": false,
        "overlaying": 'y2',
        "showline": false,
        "showticklabels": false,
        "zeroline": true
    };

    var layout3 =
    {
        yaxis3: yaxis3,
        hovermode: "closest"
    };

    xy_temp = getDataFromJS
    (
        "BloodDrawTable",
        {
            x: "date"
        },
        {
            key: "optr",
            value: selected_OPTR
        }
    );

    trace4 = {
        x: xy_temp.x,
        y: xy_temp.y,
        text: new Array(xy_temp.x.length).fill(""),
        name: 'Blood Draw',
        yaxis: 'y4',
        type: 'scatter',
        mode: "markers",
        marker:
        {
            size: 9,
            color: "#FDD017"
        }
    }

    var yaxis4 = {
        "titlefont":
        {
            size: 12,
            color: '#FDD017'
        },
        "domain": [0.9, 0.95],
        "showgrid": false,
        "overlaying": 'y3',
        "showline": false,
        "showticklabels": false,
        "zeroline": true,
    };

    var layout4 = {
        yaxis4: yaxis4,
        hovermode: "closest"
    };

    xy_temp = getDataFromJS("OncoLogTreatmentTable", {x:"date", value:"type"}, {key:"optr", value: selected_OPTR});

    console.log("oncolog xy_temp");
    console.log(xy_temp);

    trace5 =
    {
        x: xy_temp.x,
        y: xy_temp.y,
        text: xy_temp.value,
        //hoverinfo:"x+text",
        name: 'OncoLog',
        yaxis: 'y5',
        type: 'scatter',
        mode: "markers",
        marker:{size: 9, color: "#800080"}
    }

    var yaxis5 =
    {
        "titlefont":
        {
          size: 12,
          color: '#800080'
        },
        "domain": [0.95, 1],
        "showgrid": false,
        "overlaying": 'y4',
        "showline": false,
        "showticklabels": false,
        "zeroline": true,
    };

    var layout5 =
    {
        yaxis5: yaxis5,
        hovermode: "closest"
    };

    // start out with empty plot
    Plotly.newPlot("graph", [],
    {
        title: "Multiple Y-Axis Plot",
        height: 600
    });

    Plotly.relayout("graph", layout5);
    Plotly.addTraces("graph", [trace5]);

    Plotly.relayout("graph", layout4);
    Plotly.addTraces("graph", [trace4]);

    Plotly.relayout("graph", layout3);
    Plotly.addTraces("graph", [trace3]);

    Plotly.relayout("graph", layout1);
    Plotly.addTraces("graph", [trace1]);

    Plotly.relayout("graph", layout2);
    Plotly.addTraces("graph", [trace2]);

    myPlot = document.getElementById('graph');

    myPlot.on('plotly_click', function(data)
    {
        //console.log(data);

        var point = data.points[0];

        console.log("point");
        console.log(point);

        console.log("point.pointNumber: " + point.pointNumber);
        //console.log("x[point.pointNumber]: " + x[point.pointNumber]);

        Object.keys(point).forEach(function(value, key)
        {
            console.log(key + ": " + value);
        });

        console.log("point.x " + point.x);
        console.log("point.y " + point.y);
        var name = point.fullData.name;
        console.log("name " + point.fullData.name);
        console.log("point.xaxis.d2l(point.x) " + point.xaxis.d2l(point.x))

        x_datetime = new Date(point.xaxis.d2l(point.x));
        console.log("x_datetime: " + x_datetime);
        x_datestring = x_datetime.toLocaleDateString('en-US');
        console.log("x_datestring: " + x_datestring);

        var yref = point.yaxis._id;
        console.log("yref: " + yref);

        text = point.fullData.text[point.pointNumber];
        console.log("text " + text);

        var newAnnotation =
        {
            x: point.x,
            y: point.y,
            yref: yref,
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
            text: '<b>Patient: </b>' + selected_OPTR + '<br>' + '<b>Date: </b>' +
                x_datestring + '<br>' + '<b>' + name + ': </b>' + text + '<br>'
        };

        var divid = document.getElementById('graph');
        var newIndex = (divid.layout.annotations || [])
            .length;

        // delete instead if clicked twice
        if (newIndex)
        {
            var foundCopy = false;
            divid.layout.annotations.forEach(function(ann, sameIndex)
            {
                if (ann.text === newAnnotation.text)
                {
                    Plotly.relayout(
                        'graph',
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
            'graph',
            'annotations[' + newIndex + ']',
            newAnnotation
        );

    })
    .on('plotly_clickannotation', function(event, data)
    {
        Plotly.relayout(
            'graph',
            'annotations[' + newIndex + ']',
            newAnnotation
        );
    });

}

function getDataFromJS(table_name, fields, filter)
{
    console.log("in getEventDataFromJS");
    console.log("table_name " + table_name + " fields");
    console.log(fields);
    console.log("filter");
    console.log(filter);

    var selected_items = [];
    var xy_data = {
        x: [],
        y: [],
        value: []
    };
    data_list = data_sources[table_name].objects;
    //console.log("data_list");
    //console.log(data_list);


    $.each(data_list, function(index, item)
    {
        //console.log("tablename " + table_name + " index :" + index + " item: ");
        //console.log(item);
        //console.log("filter.key " + filter.key + " filter.value " + filter.value);
        //console.log(item[filter.key] == filter.value);
        //console.log(fields.x + " item[fields.x] " + item[fields.x] + " " + fields.y + " item[fields.y] " + item[fields.y]);
        if (item[filter.key] == filter.value)
        {
            selected_items.push(item);
            //xy_data.x.push(item[fields.x]);
            //xy_data.y.push(item[fields.y]);
        }
    });

    // Some data seems to have "Date" while other data hs "date".
    // Normalize date attribute name.
    var date_field = "";
    var has_date = false;
    if (fields.x == "date")
    {
        date_field = "date";
        has_date = true;
    }
    if (fields.x == "Date")
    {
        date_field = "Date";
        has_date = true;
    }

    // Sort data by date
    if (has_date)
    {
        selected_items.sort(function(d1, d2)
        {
            return new Date(d1[date_field]) - new Date(d2[date_field]);
        });
    }

    console.log("selected_items");
    console.log(selected_items);

    $.each(selected_items, function(index, item)
    {
        if ('x' in fields)
        {
            xy_data.x.push(item[fields.x]);
        }

        if ('y' in fields)
        {
            xy_data.y.push(item[fields.y]);
        }
        else
        {
            xy_data.y.push(0);
        }

        if ('value' in fields)
        {
            xy_data.value.push(item[fields.value]);
        }
        else
        {
            xy_data.value.push(item[fields.y]);
        }

    });

    console.log("xy_data");
    console.log(xy_data);

    return xy_data;
}