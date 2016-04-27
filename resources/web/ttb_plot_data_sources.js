

var ttb_plot_data_sources =
[
    {
        "TableName" : "PatientDemographics",
        "Fields" :
        [
            {
                "FieldName" : "OPTR",
                "DisplayName" : "OPTR",
                "Values" : [],
                "Type" : "Key",
            },
        ]
    },
    {
        "TableName" : "BloodDrawTable",
        "Fields" :
        [
            {
                "FieldName" : "Date",
                "DisplayName" : "Date",
                "Values" : [],
                "Type" : "Date",
                "Axis" : "x"
            },
            {
                "FieldName" : "BloodDraw",
                "DisplayName" : "Blood Draw",
                "Units" : "",
                "Values" : [],
                "Type" : "Value",
                "GraphType" : "",
                "MarkerType" : "",
                "MarkerSize" : 9,
                "Axis" : "y"
            }
        ]
    },
    {
        "TableName" : "CA199Table",
        "Fields" :
        [
            {
                "FieldName" : "Date",
                "DisplayName" : "Date",
                "Values" : [],
                "Type" : "Date",
                "Axis" : "x"
            },
            {
                "FieldName" : "CA199",
                "DisplayName" : "CA19-9",
                "Units" : "",
                "Values" : [],
                "Type" : "Value",
                "GraphType" : "",
                "MarkerType" : "",
                "MarkerSize" : 9,
                "Axis" : "y"
            }
        ]
    },
    {
        "TableName" : "Weights",
        "Fields" :
        [
            {
                "FieldName" : "Date",
                "DisplayName" : "Date",
                "Values" : [],
                "Type" : "Date",
                "Axis" : "x"
            },
            {
                "FieldName" : "Weight",
                "DisplayName" : "Weight",
                "Units" : "kg",
                "Values" : [],
                "Type" : "Value",
                "GraphType" : "",
                "MarkerType" : "",
                "MarkerSize" : 9,
                "Axis" : "y"
            }
        ]
    },
    {
        "TableName" : "OncoLogTreatmentTable",
        "Fields" :
        [
            {
                "FieldName" : "Date",
                "DisplayName" : "Date",
                "Values" : [],
                "Type" : "Date",
                "Axis" : "x"
            },
            {
                "FieldName" : "OncoLogTreatment",
                "DisplayName" : "OncoLog Treatment",
                "Values" : [],
                "Type" : "Event",
                "GraphType" : "",
                "MarkerType" : "",
                "MarkerSize" : 9,
                "Axis" : "y"
            }
        ]
    },
    {
        "TableName" : "TreatmentTable",
        "Fields" :
        [
            {
                "FieldName" : "Date",
                "DisplayName" : "Date",
                "Values" : [],
                "Type" : "Date",
                "Axis" : "x"
            },
            {
                "FieldName" : "TreatmentEvent",
                "DisplayName" : "Treatment",
                "Values" : [],
                "Type" : "Event",
                "GraphType" : "",
                "MarkerType" : "",
                "MarkerSize" : 9,
                "Axis" : "y"
            }
        ],
    }
];


var fields =
{
    "BloodDraw":
        {
        "TableName": "BloodDrawTable",
        "DisplayName": "Blood Draw",
        "Abcissa": {"Name": "Date", "Type": "Date"},
        "Type": "Event",
        "GraphType": "",
        "MarkerType": "",
        "MarkerSize": 9,
        "MarkerColor": "",
        "LineType": "",
        "LineSize": "",
        "LineColor": ""
        },
    "CA199":
        {
        "TableName": "CA199Table",
        "DisplayName": "CA19-9",
        "Abcissa": {"Name": "Date", "Type": "Date"},
        "Type": "Value",
        "GraphType": "",
        "MarkerType": "",
        "MarkerSize": 9,
        "MarkerColor": "",
        "LineType": "",
        "LineSize": "",
        "LineColor": ""
        },
    "Weight":
        {
        "TableName": "Weights",
        "DisplayName": "Weight (kg)",
        "Abcissa": {"Name": "Date", "Type": "Date"},
        "Type": "Value",
        "GraphType": "",
        "MarkerType": "",
        "MarkerSize": 9,
        "MarkerColor": "",
        "LineType": "",
        "LineSize": "",
        "LineColor": ""
        },
    "OncoLogTreatment":
        {
        "TableName": "OncoLogTreatmentTable",
        "DisplayName": "OncoLog Treatment",
        "Abcissa": {"Name": "Date", "Type": "Date"},
        "Type": "Event",
        "GraphType": "",
        "MarkerType": "",
        "MarkerSize": 9,
        "MarkerColor": "",
        "LineType": "",
        "LineSize": "",
        "LineColor": ""
        },
    "TreatmentEvent":
        {
        "TableName": "TreatmentTable",
        "DisplayName": "Treatment",
        "Abcissa": {"Name": "Date", "Type": "Date"},
        "Type": "Event",
        "GraphType": "",
        "MarkerType": "",
        "MarkerSize": 9,
        "MarkerColor": "",
        "LineType": "",
        "LineSize": "",
        "LineColor": ""
        },
}