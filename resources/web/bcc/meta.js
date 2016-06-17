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
    DiagnosisTable:
    {
        Type: "Event",
        TableName: "DiagnosisTable",
        DisplayName: "Diagnosis",
        Fields:
        [   {
                FieldName: "Date",
                DisplayName: "Date"
            },
            {
                FieldName: "InitialDiagnosis",
                DisplayName: "Initial Diagnosis"
            },
            {
                FieldName: "DiagnosisFromHistologyCode",
                DisplayName: "Histology"
            },
            {
                FieldName: "Grade",
                DisplayName: "Grade"
            },
            {
                FieldName: "dummy",
                DisplayName: "dummy"
            }
        ]
    },
    
    TreatmentTable:
    {
        Type: "Event",
        TableName: "TreatmentTable",
        DisplayName: "Treatment",
        Fields: 
        [
            {
                FieldName: "Date",
                DisplayName: "Date"
            },
            {
                FieldName: "Type",
                DisplayName: "Type"
            },
            {
                FieldName: "dummy",
                DisplayName: "dummy"
            }
        ]
    },
    
    OncoLogTreatmentTable:
    {
        Type: "Event",
        TableName: "OncoLogTreatmentTable",
        DisplayName: "OncoLog Treatment",
        Fields: 
        [
            {
                FieldName: "Date",
                DisplayName: "Date"
            },
            {
                FieldName: "Type",
                DisplayName: "Type"
            },
            {
                FieldName: "dummy",
                DisplayName: "dummy"
            }
        ]
    },
    
    BloodDrawTable:
    {
        Type: "Event",
        TableName: "BloodDrawTable",
        DisplayName: "Blood Draw",
        Fields: 
        [
            {
                FieldName:"Date",
                DisplayName: "Date"
            }, 
            {
                FieldName: "dummy",
                DisplayName: "dummy"
            }
        ]
    },
    
    SampleTable:
    {
        Type: "Event",
        TableName: "SampleTable",
        DisplayName: "Sample Type",
        Fields: 
        [
            {
                FieldName: "Date",
                DisplayName: "Date"
            }, 
            {
                FieldName: "SamplePrimaryType",
                DisplayName: "Primary Type"
            },
            {
                FieldName: "SampleMatchedType",
                DisplayName: "Matched Type"
            },
            {
                FieldName: "dummy",
                DisplayName: "dummy"
            }
        ]
    },

    BiopsyTable:
    {
        Type: "Event",
        TableName: "BiopsyTable",
        DisplayName: "Biopsy Table",
        Fields:
        [
            {
                FieldName: "Date",
                DisplayName: "Date"
            },
            {
                FieldName: "Type",
                DisplayName: "Type"
            },
            {
                FieldName: "dummy",
                DisplayName: "dummy"
            }
        ]
    },

    ImagingTable:
    {
        Type: "Event",
        TableName: "ImagingTable",
        DisplayName: "Image",
        Fields: 
        [
            {
                FieldName: "Date",
                DisplayName: "Date"
            }, 
            {
                FieldName: "Type",
                DisplayName: "Type"
            },
            {
                FieldName: "dummy",
                DisplayName: "dummy"
            }
        ]
    },
    
    CA199Table:
    {
        Type: "Series",
        TableName: "CA199Table",
        DisplayName: "CA19-9",
        Units: "U/ml",
        Fields: 
        [
            {
                FieldName: "Date",
                DisplayName: "Date"
            }, 
            {
                FieldName: "CA199",
                DisplayName: "CA19-9",
                Units: "U/ml"
            }
        ]
    },

    TumorSizeTable:
    {
        Type: "Series",
        TableName: "TumorSizeTable",
        DisplayName: "Primary Tumor",
        Units: "mm",
        Fields:
        [
            {
                FieldName: "Date",
                DisplayName: "Date"
            },
            {
                FieldName: "SizeAxis1",
                DisplayName: "Primary Tumor",
                Units: "mm"
            }
        ]
    },

    Met1SizeTable:
    {
        Type: "Series",
        TableName: "Met1SizeTable",
        DisplayName: "peripancreatic lymph node",
        Units: "mm",
        Fields:
        [
            {
                FieldName: "Date",
                DisplayName: "Date"
            },
            {
                FieldName: "SizeAxis1",
                DisplayName: "Tumor Size",
                Units: "mm"
            }
        ]
    },

    Met2SizeTable:
    {
        Type: "Series",
        TableName: "Met2SizeTable",
        DisplayName: "portocaval lymph node",
        Units: "mm",
        Fields:
        [
            {
                FieldName: "Date",
                DisplayName: "Date"
            },
            {
                FieldName: "SizeAxis1",
                DisplayName: "Tumor Size",
                Units: "mm"
            }
        ]
    },

    WeightTable:
    {
        Type: "Series",
        TableName: "WeightTable",
        DisplayName: "Weight",
        Units: "kg",
        Fields:
        [
            {
                FieldName: "Date",
                DisplayName: "Date"
            }, 
            {
                FieldName: "Weight",
                DisplayName: "Weight",
                Units: "kg"
            } 
        ]
    }
};
