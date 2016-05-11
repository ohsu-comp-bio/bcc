//${ labkey.dependency(path = 'https://cdn.plot.ly/plotly-latest.min.js') };

function plot()
{
  console.log("in pttb-plot.js");

  selected_OPTR = 4086;

  var xy_temp;
  xy_temp = getXYDataFromJS("CA199Table", {x:"date", y:"ca199"}, {key:"optr", value: selected_OPTR});

  var trace1 =
  {
    x: xy_temp.x,
    y: xy_temp.y,
    name: 'CA199',
    type: 'scatter',
    mode: 'lines+markers',
    marker:{size: 9, color: "#FFA500"}
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

  xy_temp = getXYDataFromJS("WeightTable", {x:"date", y:"weight"}, {key:"optr", value: selected_OPTR});

  var trace2 =
  {
    x: xy_temp.x,
    y: xy_temp.y,
    name: 'Weight',
    yaxis: 'y2',
    type: 'scatter',
    mode: "lines+markers",
    marker:{size: 9, color: "#808000"}
  };

  var yaxis2 =
  {
  	"title": 'Weight',
    "titlefont":
    {
      size: 12,
      color: '#808000'
    },
    "domain": [0,0.8],
    "showgrid": true,
    "gridcolor": {color: 'rgb(148, 103, 189)'},
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

  xy_temp = getXYDataFromJS("TreatmentTable", {x:"date"}, {key:"optr", value: selected_OPTR});

  trace3 =
  {
    x: xy_temp.x,
    y: xy_temp.x.map(function(){return 0}),
    name: 'Treatment',
    yaxis: 'y3',
    type: 'scatter',
    mode: "markers",
    marker:{size: 9, color: "#800000"}
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


  xy_temp = getXYDataFromJS("BloodDrawTable", {x:"date"}, {key:"optr", value: selected_OPTR});

  trace4 =
  {
    x: xy_temp.x,
    y: xy_temp.x.map(function(){return 0}),
    name: 'Blood Draw',
    yaxis: 'y4',
    type: 'scatter',
    mode: "markers",
    marker:{size: 9, color: "#FDD017"}
  }

  var yaxis4 =
  {
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

  var layout4 =
  {
  	yaxis4: yaxis4,
  	hovermode: "closest"
  };


  xy_temp = getXYDataFromJS("OncoLogTreatmentTable", {x:"date"}, {key:"optr", value: selected_OPTR});

  trace5 =
  {
    x: xy_temp.x,
    y: xy_temp.x.map(function(){return 0}),
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
    "domain": [0.95, 1.0],
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
  Plotly.newPlot("graph",[],{title: "Multiple Y-Axis Plot", height: 600});

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

    Object.keys(point).forEach(function(value, key){
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

    var newAnnotation =
    {
        x: point.x,
        y: point.y,
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
            x_datestring + '<br>' + '<b>' + name + ': </b>' + point.y + '<br>'
    };

    var divid = document.getElementById('graph');
    var newIndex = (divid.layout.annotations || []).length;

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

    Plotly.relayout
    (
        'graph',
        'annotations[' + newIndex + ']',
        newAnnotation
    );

  })
  .on('plotly_clickannotation',function(event, data)
  {
      Plotly.relayout(
          'graph',
          'annotations[' + newIndex + ']',
          newAnnotation
      );
  });

}

function getXYDataFromJS(table_name, fields, filter)
{
  console.log("in getXYDataFromJS");
  console.log("table_name " + table_name + " fields");
  console.log(fields);
  console.log("filter");
  console.log(filter);

  var selected_items = [];
  var xy_data = {x:[], y:[]};
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

  if (has_date)
  {
    selected_items.sort(function(d1,d2){
      return new Date(d1[date_field]) - new Date(d2[date_field]);
    });
  }

  console.log("selected_items");
  console.log(selected_items);

  $.each(selected_items, function(index, item){
    if ('x' in fields) { xy_data.x.push(item[fields.x]); }
    if ('y' in fields) { xy_data.y.push(item[fields.y]); }
  });

  console.log("xy_data");
  console.log(xy_data);

  return xy_data;
}
