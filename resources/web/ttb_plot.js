console.log("in script");

${ labkey.dependency(path = 'https://cdn.plot.ly/plotly-latest.min.js') };

(function()
{
    var selected_OPTR = "4086";

    var doQuery = function()
    {
        // When all the dependencies are loaded we then load the data via selectRows.
        // The queryConfig object stores all the information needed to make a selectRows request.
        var query_config = {
            "schemaName": "lists",
            "queryName": "CA19_9Table",
            "viewName": null,
            "dataRegionName": "query",
            "queryLabel": "CA199Table",
            "parameters":
            {},
            "maxRows": 5000,
            "requiredVersion": 13.2,
            "method": "POST",
            "columns": ["Date", "CA19_9"],
            "filterArray": [
            {
                "name": "OPTR",
                "value": [selected_OPTR],
                "type": "eq"
            }]
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
    };


    function onError(errorInfo)
    {
        alert(errorInfo.exception);
    }


    console.log(doQuery());


    function onSuccess(results)
    {
        /*
        console.log(Object.keys(results));
        console.log(results.getColumnModel());
        console.log(results.getMetaData());
        console.log(results.getQueryName());
        console.log(results.getRowCount());
        console.log(results.getSchemaName());
        */

        console.log(results);

        dates = [];
        ca199 = [];

        var rows = results.getRows();

        var data = '';
        var length = rows.length;


        for (var idxRow = 0; idxRow < length; idxRow++)
        {
            var row = rows[idxRow];

            date = new Date(row['Date'].value).toLocaleDateString(
                "en-US");
            console.log("Date: " + date + " CA19-9: " + row['CA19_9'].value);

            dates.push(date);
            ca199.push(row['CA19_9'].value);

            console.log("length: " + dates.length);

            for (var i = 0; i < dates.length; i++)
            {
                console.log("[" + i + "] date: " + dates[i] +
                    " ca199: " + ca199[i]);
            }

            makeScatterPlot(dates, ca199);
        }


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
                    type: 'scatter'
                };

                data = [timeline];

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


    }
})();