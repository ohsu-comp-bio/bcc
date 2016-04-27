$ = jQuery;

$(document).ready(function()
{
    alert("changed13");

    var selected_OPTR = "4086";

    //var selected_OPTR = OPTR;

    function GraphData(fields)
    {

        this.data = {};
        for (index in fields)
        {
            var field_name = fields[index];
            this.data[field_name] = [];
        }

        console.log("this.data keys " + Object.keys(this.data));

        this.onSuccess = function(results)
        {
            var rows = results.getRows();

    =       for (index in rows)
            {
                row = rows[index];
                ca199.push(row['CA199'].value);
            }

            console.log("ca199");
            console.log(ca199);
        };

    }

    GraphData.prototype =
    {
        constructor: GraphData,

        getData: function()
        {
            return this.data;
        }

    };


    var ca199 = [];


    console.log("calling doQuery");
    obj = new GraphData(["CA199"]);
    console.log("obj keys " + Object.keys(obj));
    doQuery(obj);
    console.log("called doQuery");

    console.log("get data: " + obj.getData());

    console.log("dates");
    console.log(dates);
    console.log("ca199");
    console.log(ca199);

    function doQuery(obj)
    {
        var query_config =
        {
            "schemaName": "lists",
            "queryName": "CA199Table",
            "viewName": null,
            "dataRegionName": "query",
            "queryLabel": "CA199Table",
            "parameters":{},
            "maxRows": 10,
            "requiredVersion": 13.2,
            "method": "POST",
            "columns": ["Date", "CA199"],
            "onError": onError,
            "onSuccess": obj.onSuccess
        };

        LABKEY.Query.selectRows(query_config);
    }


    function onError(errorInfo)
    {
        alert(errorInfo.exception);
    }


    function onSuccess(results)
    {

        var rows = results.getRows();

        for (index in rows)
        {
            row = rows[index];
            ca199.push(row['CA199'].value);
        }

        console.log(ca199);

    }

});

