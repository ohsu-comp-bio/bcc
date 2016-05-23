/*jslint browser: true, white: true, indent: 4, maxerr: 999*/
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

var table_schema = 
{
    DiagnosisTable:
    {
        Type: "Event",
        TableName: "DiagnosisTable",
        DisplayName: "Diagnosis",
        Fields:
        [   {
                FieldName: "date",
                DisplayName: "Date"
            },
            {
                FieldName: "initialdiagnosis",
                DisplayName: "Initial Diagnosos"
            },
            {
                FieldName: "diagnosisfromhistologycode",
                DisplayName: "Histology"
            },
            {
                FieldName: "grade",
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
                FieldName: "date",
                DisplayName: "Date"
            },
            {
                FieldName: "type",
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
                FieldName: "date",
                DisplayName: "Date"
            },
            {
                FieldName: "type",
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
                FieldName:"date",
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
                FieldName: "date",
                DisplayName: "Date"
            }, 
            {
                FieldName: "sampleprimarytype",
                DisplayName: "SampleType"
            },
            {
                FieldName: "samplematchedtype",
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
                FieldName: "date",
                DisplayName: "Date"
            }, 
            {
                FieldName: "type",
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
                FieldName: "date",
                DisplayName: "Date"
            }, 
            {
                FieldName: "ca199",
                DisplayName: "CA19-9",
                Units: "U/ml"
            }
        ]
    },
    
    TumorSizeTable:
    {
        Type: "Series",
        TableName: "TumorSizeTable",
        DisplayName: "Tumor Size",
        Units: "mm",
        Fields:
        [
            {
                FieldName: "date",
                DisplayName: "Date"
            }, 
            {
                FieldName: "sizeaxis1",
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
                FieldName: "date",
                DisplayName: "Date"
            }, 
            {
                FieldName: "weight",
                DisplayName: "Weight",
                Units: "kg"
            } 
        ]
    }
};
