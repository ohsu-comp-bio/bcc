$ = jQuery;

$(document).ready(function()
{
    //alert("changed13");

    console.log("before getting OPTRs");

    console.log("calling getOPTRs");
    getOPTRs();

    console.log("after calling optrs");
    console.log(optrs);


    function getOPTRs()
    {

        console.log("in getOPTRs");
        var query_config =
        {
            "schemaName": "lists",
            "queryName": "CA199Table",
            "viewName": null,
            "dataRegionName": "query",
            "queryLabel": "PatientDemographics",
            "parameters":{},
            "maxRows": 5000,
            "requiredVersion": 13.2,
            "method": "POST",
            "columns": ["OPTR"],
            "sort": "OPTR"
        };

        query_config.success = processOPTRResults;
        query_config.failure = onError;

        console.log("running query");
        LABKEY.Query.selectRows(query_config);

        //console.log("inside getOPTRs: optrs");
        //console.log(optrs);
    }


    var optrs = [];

    function processOPTRResults(results)
    {
        console.log("beginning of success");
        //console.log(optrs);

        rows = results.getRows();

        for (index in rows)
        {
            if (rows[index].hasOwnProperty("OPTR"))
            {
                var optr = rows[index]["OPTR"].value;
                if (optrs.indexOf(optr) == -1)
                {
                    console.log("optrs doesn't have: " + optr);
                    optrs.push(optr);
                    console.log("appending text: " + "<option value=" + optr + ">" + optr + "</option>");
                    $("<option value=" + optr + ">" + optr + "</option>").appendTo('#optr-select');
                    //$('#optr_select').append("<option value=" + optr + ">" + optr + "</option>");
                }
                else
                {
                    console.log("optrs already has " + optr);
                }
            }

            //unique_optrs = Array.from(new Set(optrs));

            //unique_optrs.forEach(function(optr)
            //{
            //    $('#optr_list').append("<option value=" + optr + ">");
            //});

        }

        console.log("end of success");
        //console.log(optrs);
    }

    console.log("outside after");
    //console.log(optrs);

    $('#dropdown-button').on('click', function(){
        toggleDropdown();
        });

    var is_down = false;

    function toggleDropdown()
    {
        if (is_down)
        {
            document.getElementById('dropdown').style.display = "none";
            document.getElementById('dropdown-button').innerHTML = "Options &#x25bc;";
            is_down = false;
        }
        else
        {
            document.getElementById('dropdown').style.display = "block";
            document.getElementById('dropdown-button').innerHTML = "Options &#x25b2;";
            is_down = true;
        }
    }


/*
    $('#theform').on('submit', function(e){
        e.preventDefault();
        console.log("form submitted");
        return false;
    return false;});
    */

    //document.getElementById('clickme').style.color = "red";

    //$('#clickme').text("Ha!");

    $('#submit-options').on('click', function(e)
        {
            console.log("button clicked");
            e.stopPropagation();
            //e.preventDefault();
            console.log("selected OPTR: " + $('#optr-select').val());
            console.log("selected data");

            var data_options = [];
            $('.OptionsCheckbox').each(function(index, item)
                {
                    if (item.checked){data_options.push(item.name);}
                    console.log(index + ": " + item.name + " " + item.checked);
                });

            //return false;
            console.log(data_options);
        });


    //${labkey.dependency(path = 'https://cdn.plot.ly/plotly-latest.min.js')};

    var OPTR = LABKEY.ActionURL.getParameter("OPTR");
    //alert("OPTR: " + OPTR);

    // Ensure that page dependencies are loaded
    LABKEY.requiresExt3ClientAPI(true, function()
        {
            //Ext.onReady(init_TTBplotA);
        });

    function populateOPTRvalues_TTBplotA(data)
    {
        var el = document.getElementById("OPTR2_TTBplotA");
        el.options[0].text = "<Select OPTR>";
        for (var i = 0; i < data.rows.length; i++)
        {
            var opt = document.createElement("option");
            opt.text = data.rows[i].OPTR;
            opt.value = data.rows[i].OPTR;
            if (OPTR && OPTR == opt.value)
                opt.selected = true;
            el.options[el.options.length] = opt;
        }
    }


    return;

    var selected_OPTR = "4086";

    //var selected_OPTR = OPTR;

    doQuery();


    function doQuery()
    {
        // When all the dependencies are loaded we then load the data via selectRows.
        // The queryConfig object stores all the information needed to make a selectRows request.
        var query_config =
        {
            "schemaName": "lists",
            "queryName": "CA199Table",
            "viewName": null,
            "dataRegionName": "query",
            "queryLabel": "CA199Table",
            "parameters":{},
            "maxRows": 5000,
            "requiredVersion": 13.2,
            "method": "POST",
            "columns": ["Date", "CA199"],
            "filterArray":
            [
                {
                    "name": "OPTR",
                    "value": [selected_OPTR],
                    "type": "eq"
                }
            ]
        };

        if (query_config.filterArray && query_config.filterArray.length > 0)
        {
            var filters = [];

            for (var i = 0; i < query_config.filterArray.length; i++)
            {
                var filter = query_config.filterArray[i];
                filters.push(LABKEY.Filter.create(filter.name, filter.value,
                    LABKEY.Filter.getFilterTypeForURLSuffix(
                        filter.type)));
            }

            query_config.filterArray = filters;
        }

        query_config.success = onSuccess;
        query_config.failure = onError;
        LABKEY.Query.selectRows(query_config);
    }


    function onError(errorInfo)
    {
        alert(errorInfo.exception);
    }


    //console.log(doQuery());


    var dates = [];
    var ca199 = [];

    function onSuccess(results)
    {

        //console.log(results);

        var rows = results.getRows();

        rows.sort(function(v1, v2)
        {
            return new Date(v1['Date'].value) - new Date(v2['Date'].value);
        });

        var data = '';
        var length = rows.length;
        console.log(length);

        for (var idxRow = 0; idxRow < length; idxRow++)
        {
            var row = rows[idxRow];

            var date = new Date(row['Date'].value).toLocaleDateString("en-US");
            //console.log("Date: " + date + " CA19-9: " + row['CA199'].value);

            dates.push(date);
            ca199.push(row['CA199'].value);

        }

        console.log(dates);
        console.log(ca199);

        console.log("listing");
        for (var i = 0; i < dates.length; i++)
        {
            console.log("[" + i + "] date: " + dates[i] + " ca199: " + ca199[i]);
        }

        console.log("making plot");
        makeScatterPlot(dates, ca199);

    }


    function toDate(d)
    {
        var parts = d.split('/');

        return new Date(parts[2], parts[0], parts[1]).getTime();
    }


    function makeScatterPlot(x, y)
    {
        console.log("in plot");
        console.log(x);
        console.log(y);

        var timeline = {
            x: x.map(toDate),
            y: y,
            mode: 'lines+markers',
            type: 'scatter',
            marker: {size: 9}
        };

        var data = [timeline];

        var layout = {
            title: "Title",
            displayModeBar: true,
            xaxis:
            {
                type: 'date',
                tickvals: x.map(toDate),
                ticktext: x,
                tickfont:
                {
                    color: "rgb(107, 107, 107)",
                    size: 11
                },
                ticks: "outside",
                tickwidth: 1,
                tickangle: 40,
                ticklen: 5,
                showticklabels: true,
                showline: false,
                showgrid: true,
                autorange: true,
            },
            yaxis:
            {
                showgrid: true,
            }
        };


        Plotly.plot(
            "myDiv",
            data,
            layout
        );

myPlot = document.getElementById('myDiv');


myPlot.on('plotly_click',
  function(data)
  {

    var point = data.points[0];

    var newAnnotation =
    {
      x: point.xaxis.d2l(point.x),
      y: point.yaxis.d2l(point.y),
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
      text: '<b>Patient: </b>' + selected_OPTR + '<br>'
          + '<b>Date: </b>' + dates[point.pointNumber] + '<br>'
          + '<b>CA199: </b>' + point.y + '<br>'
    };

    var divid = document.getElementById('myDiv');
    var newIndex = (divid.layout.annotations || []).length;

    console.log(point.pointNumber);
    // delete instead if clicked twice
    if (newIndex)
    {
			var foundCopy = false;
			divid.layout.annotations.forEach(
      function(ann, sameIndex)
      {
        if (ann.text === newAnnotation.text)
        {
          Plotly.relayout
          (
            'myDiv',
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
			  'myDiv',
			  'annotations[' + newIndex + ']',
			  newAnnotation
			);
		})
  .on('plotly_clickannotation', function(event, data)
  {
		Plotly.relayout
		(
      'myDiv',
      'annotations[' + newIndex + ']',
      newAnnotation
    );
  });



    }
});

