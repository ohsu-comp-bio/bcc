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
    Demographics:
    {
        Type: "Demographics",
        TableName: "Demographics",
        DisplayName: "Demographics",
        Fields:
        [
            //{
            //    FieldName: "date",
            //    DisplayName: "Date"
            //},
            {
                FieldName: "Date Of Birth",
                DisplayName: "Date Of Birth"
            },
            {
                FieldName: "Gender",
                DisplayName: "Gender"
            },
            {
                FieldName: "Date Of Death",
                DisplayName: "Date Of Death",
                IsDate : true
            },
            {
                FieldName: "First Name",
                DisplayName: "First Name"
            },
            {
                FieldName: "Last Name",
                DisplayName: "Last Name"
            }
        ]
    },

    Diagnosis:
    {
        Type: "Event",
        TableName: "Diagnosis",
        DisplayName: "Diagnosis",
        Marker:
        {
            symbol: "diamond-open-dot",
            color: "green",
            size: 12
        },
        //Line:
        //{
        //    color: "green",
        //    width: 1
        //},
        Fields:
        [
            {
                FieldName: "date",
                DisplayName: "Date",
                IsDate : true
            },
            // Hover and pickets are not working due to number of fields here.
            //{
            //    FieldName: "InitialDiagnosis",
            //    DisplayName: "Initial Diagnosis"
            //},
            {
                FieldName: "HistologyDescription",
                DisplayName: "Histology Description"
            },
            //{
            //    FieldName: "DagnosisFromHistologyCode",
            //    DisplayName: "Diagnosis From Histology Code"
            //},
            {
                FieldName: "Grade",
                DisplayName: "Grade"
            },
            {
                FieldName: "TumorSize",
                DisplayName: "Tumor Size",
                Units: "mm"
            },
            //{
            //    FieldName: "LymphVascularInvasion",
            //    DisplayName: "Lymph Vascular Invasion"
            //},
            //{
            //    FieldName: "StageGroupingDominant",
            //    DisplayName: "Stage Grouping Dominant"
            //},
            {
                FieldName: "PrimarySiteMajorGroupsForStaging",
                DisplayName: "Primary Site Major Groups For Staging"
            //},
            //{
            //    FieldName: "Margins",
            //    DisplayName: "Margins"
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
            symbol: "triangle-down",
            color: "green",
            size: 12
        },
        //Line:
        //{
        //    color: "black",
        //    width: 1
        //},
        MultiLegendIdCol: "type", // When used, this should be one of the fields below.
        MultiLegendColorCycle: ["green", "blue", "purple", "orange", "yellow", "brown", "violet"],
        //MultiLegendSymbolCycle: ["circle", "square", "triangle-up", "diamond", "star-triangle-up", "hexagram", "bowtie", "hash"],
        Fields:
        [
            {
                FieldName: "date",
                DisplayName: "Date",
                IsDate : true
            },
            {
                FieldName: "type",
                DisplayName: "Type"
            },
            {
                FieldName: "mostDefSurgicalResDate",
                DisplayName: "Most Definitive Surgical Res Date"
            },
            {
                FieldName: "comment",
                DisplayName: "Comment"
            }
        ]
    },

    OtherTreatments:
    {
        Type: "Event",
        TableName: "OtherTreatments",
        DisplayName: "OtherTreatments",
        Marker:
        {
            symbol: "diamond-tall-open",
            color: "green",
            size: 12
        },
        //Line:
        //{
        //    color: "black",
        //    width: 1
        //},
        MultiLegendIdCol: "type", // When used, this should be one of the fields below.
        MultiLegendColorCycle: ["green", "blue", "purple", "orange", "yellow", "brown", "violet"],
        //MultiLegendSymbolCycle: ["circle", "square", "triangle-up", "diamond", "star-triangle-up", "hexagram", "bowtie", "hash"],
        Fields:
        [
            {
                FieldName: "date",
                DisplayName: "Date",
                IsDate : true
            },
            {
                FieldName: "type",
                DisplayName: "Type"
            },
            {
                FieldName: "mostDefSurgicalResDate",
                DisplayName: "Most Definitive Surgical Res Date"
            },
            {
                FieldName: "comment",
                DisplayName: "Comment"
            }
        ]
    },

    Radiotherapy:
    {
        Type: "Event",
        TableName: "Radiotherapy",
        DisplayName: "Radiotherapy",
        Marker:
        {
            symbol: "triangle-up",
            color: "green",
            size: 12
        },
        //Line:
        //{
        //    color: "black",
        //    width: 1
        //},
        MultiLegendIdCol: "type", // When used, this should be one of the fields below.
        MultiLegendColorCycle: ["green", "blue", "purple", "orange", "yellow", "brown", "violet"],
        //MultiLegendSymbolCycle: ["circle", "square", "triangle-up", "diamond", "star-triangle-up", "hexagram", "bowtie", "hash"],
        Fields:
        [
            {
                FieldName: "date",
                DisplayName: "Date",
                IsDate : true
            },
            {
                FieldName: "type",
                DisplayName: "Type"
            },
            {
                FieldName: "mostDefSurgicalResDate",
                DisplayName: "Most Definitive Surgical Res Date"
            },
            {
                FieldName: "comment",
                DisplayName: "Comment"
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
                DisplayName: "Date",
                IsDate : true
            },
            {
                FieldName: "Type",
                DisplayName: "Type"
            }
        ]
    },

    Procedures:
    {
        Type: "Event",
        TableName: "Procedures",
        DisplayName: "Procedures",
        Marker:
        {
            symbol: "triangle-down",
            color: "#FAEBD7",
            size: 12
        },
        //Line:
        //{
        //    color: "black",
        //    width: 1
        //},
        MultiLegendIdCol: "procedure", // When used, this should be one of the fields below.
        MultiLegendMarkers: // Used with MultiLegendIdCol to define specific markers for each legend ID.
        [
            {
                ID: "Blood draw",
                Marker:
                {
                    symbol: "circle",
                    color: "purple",
                    size: 12
                }
            },
            {
                ID: "CT",
                Marker:
                {
                    symbol: "circle-open",
                    color: "black",
                    size: 12
                }
            },
            {
                ID: "Biopsy",
                Marker:
                {
                    symbol: "square",
                    color: "orange",
                    size: 12
                }
            }
        ],
        Fields:
        [
            {
                FieldName:"date",
                DisplayName: "Date",
                IsDate : true
            },
            {
                FieldName:"procedure",
                DisplayName: "procedure"
            }
        ]
    },

    BloodDraw:
    {
        Type: "Event",
        TableName: "BloodDraw",
        DisplayName: "Research Blood",
        Marker:
        {
            symbol: "circle",
            color: "purple",
            size: 12
        },
        //Line:
        //{
        //    color: "black",
        //    width: 1
        //},
        Fields:
        [
            {
                FieldName:"date",
                DisplayName: "Date",
                IsDate : true
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
                DisplayName: "Date",
                IsDate : true
            },
            {
                FieldName: "SamplePrimaryType",
                DisplayName: "Primary Type"
            },
            {
                FieldName: "SampleMatchedType",
                DisplayName: "Matched Type"
            }
        ]
    },

    Biopsy:
    {
        Type: "Event",
        TableName: "Biopsy",
        DisplayName: "Research Biopsy",
        Marker:
        {
            symbol: "star",
            color: "green",
            size: 12
        },
        //Line:
        //{
        //    color: "black",
        //    width: 1
        //},
        Fields:
        [
            {
                FieldName: "date",
                DisplayName: "Date",
                IsDate : true
            },
            {
                FieldName: "Type",
                DisplayName: "Type"
            }
        ]
    },

    Imaging:
    {
        Type: "Event",
        TableName: "Imaging",
        DisplayName: "Imaging",
        Marker:
        {
            symbol: "circle-open",
            color: "black",
            size: 12
        },
        //Line:
        //{
        //    color: "black",
        //    width: 1
        //},
        Fields:
        [
            {
                FieldName: "date",
                DisplayName: "Date",
                IsDate : true
            },
            {
                FieldName: "imageTypeID",
                DisplayName: "Type"
            },
            {
                FieldName: "Comment",
                DisplayName: "Comment"
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
                DisplayName: "Date",
                IsDate : true
            },
            {
                FieldName: "imageTypeID",
                DisplayName: "Type"
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
        yValueCol: "result", // When used, this should be one of the fields below.
        Marker:
        {
            symbol: "diamond",
            color: "lightgreen",
            size: 12
        },
        //Line:
        //{
        //    color: "lightgreen",
        //    width: 1
        //},
        Fields:
        [
            {
                FieldName: "date",
                DisplayName: "Date",
                IsDate : true
            },
            {
                FieldName: "result",
                DisplayName: "CA19-9",
                Units: "U/ml"
            }
        ]
    },

    CA199:
    {
        Type: "Series",
        TableName: "CA199",
        DisplayName: "CA19-9",
        Units: "U/ml",
        yValueCol: "CA199", // When used, this should be one of the fields below.
        Marker:
        {
            symbol: "circle",
            color: "blue",
            size: 12
        },
        Line:
        {
            color: "blue",
            width: 1
        },
        Fields:
        [
            {
                FieldName: "date",
                DisplayName: "Date",
                IsDate : true
            },
            {
                FieldName: "CA199",
                DisplayName: "CA19-9",
                Units: "U/ml"
            },
            {
                FieldName: "Comment",
                DisplayName: "Comment",
            }
        ]
    },

    PrimaryTumorSizeTable:
    {
        Type: "Series",
        TableName: "TumorSizeTable",
        DisplayName: "Primary Tumor",
        Units: "mm",
        Fields:
        [
            {
                FieldName: "Date",
                DisplayName: "Date",
                IsDate : true
            },
            {
                FieldName: "SizeAxis1",
                DisplayName: "Primary Tumor",
                Units: "mm"
            }
        ]
    },

    TumorSize:
    {
        Type: "Series",
        TableName: "TumorSize",
        DisplayName: "Mass Size",
        Units: "mm",
        Marker:
        {
            symbol: "circle",
            color: "red",
            size: 12
        },
        Line:
        {
            color: "red",
            width: 1
        },
        MultiLegendIdCol: "tumorId", // When used, this should be one of the fields below.
        //MultiLegendColorCycle: ["red", "green", "blue", "purple", "orange", "yellow", "brown", "violet"],
        MultiLegendSymbolCycle: ["circle", "square", "triangle-up", "diamond", "star-triangle-up", "star",
                                 "circle-open", "square-open", "triangle-up-open", "diamond-open", "star-triangle-up-open", "star-open"],
        Fields:
        [
            {
                FieldName: "date",
                DisplayName: "Date",
                IsDate : true
            },
            {
                FieldName: "tumorId",
                DisplayName: "Mass Name",
            },
            {
                FieldName: "sizeAxis1",
                DisplayName: "Tumor Axis 1",
                Units: "mm"
            },
            {
                FieldName: "sizeAxis2",
                DisplayName: "Tumor Axis 2",
                Units: "mm"
            },
            {
                FieldName: "sizeAxis3",
                DisplayName: "Tumor Axis 3",
                Units: "mm"
            },
            {
                FieldName: "Comment",
                DisplayName: "Comment",
            }
        ]
    },


    Weight:
    {
        Type: "Series",
        TableName: "Weight",
        DisplayName: "Weight",
        Units: "kg",
        yValueCol: "weight", // When used, this should be one of the fields below.
        Marker:
        {
            symbol: "circle",
            color: "black",
            size: 8
        },
        Line:
        {
            color: "black",
            width: 1
        },
        Fields:
        [
            {
                FieldName: "date",
                DisplayName: "Date",
                IsDate : true
            },
            {
                FieldName: "weight",
                DisplayName: "Weight",
                Units: "kg"
            },
            // Weight units are displayed as "kg" on the graph regardless of what is set in this column.
            // This column is only used so that we know when pounds should be converted to kilograms.
            // The getAnnotationMaker() function ignores this FieldName value.
            {
                FieldName: "units",
                DisplayName: "Units",
            }
        ]
    }
};
