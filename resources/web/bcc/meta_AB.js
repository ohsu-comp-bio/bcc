/*jslint browser: true, white: true, indent: 4, maxerr: 999*/

console.log("meta loaded");

var colors =
[
    "#FAEBD7",
    "#00FFFF",
    "#0000FF",
    "#8A2BE2",
    "#A52A2A",
    "#5F9EA0",
    "#D2691E",
    "#DC143C",
    "#006400",
    "#FF8C00",
    "#FFD700"
];


// This is a keyed structure of tables including the name of the table,
// how it should be displayed, and what fields it has. The type is either
// "Event" for data that does not have a numerical value, so is plotted
// on a timeline as opposed "Value" data that is plotted on a time series.


var table_schema =
{
    Diagnoses:
    {
        Type: "Event",
        TableName: "Diagnoses",
        DisplayName: "Diagnoses",
        Marker:
        {
            Shape: "triangle-down",
            Color: "#FAEBD7",
            Size: "12"
        },
        Line:
        {
            Color: "#FAEBD7",
            Width: "3"
        }
        Fields:
        [
            {
                FieldName: "date",
                DisplayName: "Date",
                Type: "DateTime"
            },
            {
                FieldName: "initialDiagnosis",
                DisplayName: "Initial Diagnosis",
                InPlot: "True",
                InAnnotation: "True"
                Type: "Text",
                InPlot: "True",
                InAnnotation: "True",
                SpecialMarkerShape: ""
            },
            {
                FieldName: "histologyDiagnosis",
                DisplayName: "Histology",
                Type: "Text",
                InPlot: "True",
                InAnnotation: "True",
                SpecialMarkerShape: ""
            },
            {
                FieldName: "grade",
                DisplayName: "Grade",
                Type: "Text",
                InPlot: "True",
                InAnnotation: "True",
                SpecialMarkerShape: ""
            },
            {
                FieldName: "dummy",
                DisplayName: "dummy",
                Type: "Null"
            }
        ]
    },

    Treatments:
    {
        Type: "Event",
        TableName: "Treatments",
        DisplayName: "Treatment",
        Marker:
        {
            Shape: "triangle-down",
            Size: "12",
            Color: "#00FFFF"
        },
        Line:
        {
            Width: "3",
            Color: "#0000FF"
        }
        Fields:
        [
            {
                FieldName: "date",
                DisplayName: "Date",
                Type: "DateTime",
            },
            {
                FieldName: "type",
                DisplayName: "Type",
                Type: "Text",
                InPlot: "True",
                InAnnotation: "True",
                SpecialMarkerShape: ""
            },
            {
                FieldName: "dummy",
                DisplayName: "dummy",
                Type: "Null",
            }
        ]
    },

    OncoLogTreatmentTable:
    {
        Type: "Event",
        TableName: "OncoLogTreatmentTable",
        DisplayName: "OncoLog Treatment",
        Marker:
        {
            Shape: "triangle-down",
            Size: "12",
            Color: "#0000FF"
        },
        Line:
        {
            Width: "3",
            Color: "#0000FF"
        },
        Fields:
        [
            {
                FieldName: "Date",
                DisplayName: "Date",
                Type: "DateTime"
            },
            {
                FieldName: "Type",
                DisplayName: "Type"
                Type: "Text",
                InPlot: "True",
                InAnnotation: "True",
                SpecialMarkerShape: "True"
            },
            {
                FieldName: "dummy",
                DisplayName: "dummy",
                Type: "Null"
            }
        ]
    },

    BloodDrawTable:
    {
        Type: "Event",
        TableName: "BloodDrawTable",
        DisplayName: "Blood Draw",
        Marker:
        {
            Shape: "",
            Size: "12",
            Color: "#8A2BE2"
        },
        Line:
        {
            Width: "3",
            Color: "#8A2BE2"
        },
        Fields:
        [
            {
                FieldName:"Date",
                DisplayName: "Date",
                Type: "DateTime"
            },
            {
                FieldName: "dummy",
                DisplayName: "dummy",
                Type: "Null"
            }
        ]
    },

    SampleTable:
    {
        Type: "Event",
        TableName: "SampleTable",
        DisplayName: "Sample Type",
        Marker:
        {
            Shape: "triangle-down",
            Size: "12",
            Color: "#A52A2A"
        },
        Line:
        {
            Width: "3",
            Color: "#A52A2A"
        },
        Fields:
        [
            {
                FieldName: "Date",
                DisplayName: "Date",
                Type: "DateTime"
            },
            {
                FieldName: "SamplePrimaryType",
                DisplayName: "Primary Type",
                Type: "Text",
                InPlot: "True",
                InAnnotation: "True",
                SpecialMarkerShape: ""
            },
            {
                FieldName: "SampleMatchedType",
                DisplayName: "Matched Type",
                Type: "Text",
                InPlot: "True",
                InAnnotation: "True",
                SpecialMarkerShape: ""
            },
            {
                FieldName: "dummy",
                DisplayName: "dummy",
                Type: "Null"
            }
        ]
    },

    BiopsyTable:
    {
        Type: "Event",
        TableName: "BiopsyTable",
        DisplayName: "Samples and Procedures",
        Marker:
        {
            Shape: "triangle-down",
            Size: "#5F9EA0",
            Color: ""
        },
        Line:
        {
            Width: "3",
            Color: "#5F9EA0"
        },
        Fields:
        [
            {
                FieldName: "Date",
                DisplayName: "Date",
                Type: "DateTime"
            },
            {
                FieldName: "Type",
                DisplayName: "Type",
                Type: "Text",
                InPlot: "True",
                InAnnotation: "True",
                SpecialMarkerShape: ""
            },
            {
                FieldName: "dummy",
                DisplayName: "dummy",
                Type: "Null"
            }
        ]
    },

    ImagingTable:
    {
        Type: "Event",
        TableName: "ImagingTable",
        DisplayName: "Image",
        Marker:
        {
            Shape: "triangle-down",
            Size: "12",
            Color: "#D2691E"
        },
        Line:
        {
            Width: "3",
            Color: "#D2691E"
        },
        Fields:
        [
            {
                FieldName: "Date",
                DisplayName: "Date",
                Type: "DateTime"
            },
            {
                FieldName: "Type",
                DisplayName: "Type",
                Type: "Text",
                InPlot: "True",
                InAnnotation: "True",
                SpecialMarkerShape: ""
            },
            {
                FieldName: "dummy",
                DisplayName: "dummy",
                Type: "Null"
            }
        ]
    },

    // We need to add a filter on "test" to get just CA19-9 values.
    LabResults:
    {
        Type: "Series",
        TableName: "LabResults",
        DisplayName: "CA19-9",
        Units: "U/ml",
        Marker:
        {
            Shape: "square",
            Size: "12",
            Color: "#DC143C"
        },
        Line:
        {
            Width: "3",
            Color: "#DC143C"
        },
        Fields:
        [
            {
                FieldName: "date",
                DisplayName: "Date",
                Type: "DateTime"
            },
            {
                FieldName: "result",
                DisplayName: "CA19-9",
                Type: "Number",
                Units: "U/ml",
                InPlot: "True",
                InAnnotation: "True"}
        ]
    },

    PrimaryTumorSizeTable:
    {
        Type: "Series",
        TableName: "TumorSizeTable",
        DisplayName: "Primary Tumor",
        Units: "mm",
        Marker:
        {
            Shape: "circle",
            Size: "12",
            Color: "#006400"
        },
        Line:
        {
            Width: "3",
            Color: "#006400"
        },
        Fields:
        [
            {
                FieldName: "Date",
                DisplayName: "Date",
                Type: "DateTime"
            },
            {
                FieldName: "SizeAxis1",
                DisplayName: "Primary Tumor",
                Type: "Number",
                Units: "mm",
                InPlot: "True",
                InAnnotation: "True",
                SpecialMarkerShape: ""
            }
        ]
    },

    Met1SizeTable:
    {
        Type: "Series",
        TableName: "Met1SizeTable",
        DisplayName: "peripancreatic lymph node",
        Units: "mm",
        Marker:
        {
            Shape: "diamond",
            Size: "12",
            Color: "#FF8C00"
        },
        Line:
        {
            Width: "3",
            Color: "#FF8C00"
        },
        Fields:
        [
            {
                FieldName: "Date",
                DisplayName: "Date",
                Type: "DateTime"
            },
            {
                FieldName: "SizeAxis1",
                DisplayName: "Tumor Size",
                Type: "Number",
                Units: "mm",
                InPlot: "True",
                InAnnotation: "True",
                SpecialMarkerShape: ""
            }
        ]
    },

    Met2SizeTable:
    {
        Type: "Series",
        TableName: "Met2SizeTable",
        DisplayName: "portocaval lymph node",
        Units: "mm",
        Marker:
        {
            Shape: "cross",
            Size: "12",
            Color: "#FFD700"
        },
        Line:
        {
            Width: "3",
            Color: "#FFD700"
        },
        Fields:
        [
            {
                FieldName: "Date",
                DisplayName: "Date",
                Type: "DateTime"
            },
            {
                FieldName: "SizeAxis1",
                DisplayName: "Tumor Size",
                Type: "Number",
                Units: "mm",
                InPlot: "True",
                InAnnotation: "True",
                SpecialMarkerShape: ""
            }
        ]
    },

    Weight:
    {
        Type: "Series",
        TableName: "Weight",
        DisplayName: "Weight",
        Units: "kg",
        Marker:
        {
            Shape: "x-thin",
            Size: "12",
            Color: "red"
        },
        Line:
        {
            Width: "3",
            Color: "red"
        },
        Fields:
        [
            {
                FieldName: "date",
                DisplayName: "Date",
                Type: "DateTime"
            },
            {
                FieldName: "weight",
                DisplayName: "Weight",
                Type: "Number",
                Units: "kg",
                InPlot: "True",
                InAnnotation: "True",
                SpecialMarkerShape: ""
            }
        ]
    }
};
