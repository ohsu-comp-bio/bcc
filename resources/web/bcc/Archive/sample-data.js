// Note: this is JSON.stringify output of the graph.data property.
// True JS does not need to quotes around keys.

var sample_data =
[
{
    "x": ["2015-11-2", "2015-11-30", "2015-12-7", "2015-12-29", "2016-1-5",
        "2016-1-25", "2016-2-1"
    ],
    "y": [0, 0, 0, 0, 0, 0, 0],
    "autotick": false,
    "ticks": ["2015-11-2", "2015-11-30", "2015-12-7", "2015-12-29",
        "2016-1-5", "2016-1-25", "2016-2-1"
    ],
    "name": "Treatment",
    "text": [
        "<b>Patient: </b>4442<br /><b>Date: </b>2015-11-2<br /><b>Type</b>: gemcitabine + Abraxane<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2015-11-30<br /><b>Type</b>: gemcitabine + Abraxane<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2015-12-7<br /><b>Type</b>: gemcitabine + Abraxane<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2015-12-29<br /><b>Type</b>: gemcitabine + Abraxane<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-1-5<br /><b>Type</b>: gemcitabine + Abraxane<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-1-25<br /><b>Type</b>: gemcitabine + Abraxane<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-2-1<br /><b>Type</b>: gemcitabine + Abraxane<br />"
    ],
    "hoverinfo": "text",
    "type": "scatter",
    "mode": "markers",
    "marker":
    {
        "size": 12,
        "color": "hsl(10, 50%, 50%)",
        "symbol": 1
    },
    "line":
    {
        "width": 3
    },
    "yaxis": "y",
    "uid": "bbd26d"
},
{
    "x": ["2015-10-12", "2016-3-31"],
    "y": [0, 0],
    "autotick": false,
    "ticks": ["2015-10-12", "2016-3-31"],
    "name": "Samples and Procedures",
    "text": [
        "<b>Patient: </b>4442<br /><b>Date: </b>2015-10-12<br /><b>Type</b>: FNA<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-3-31<br /><b>Type</b>: Whipple<br />"
    ],
    "hoverinfo": "text",
    "type": "scatter",
    "mode": "markers",
    "marker":
    {
        "size": 12,
        "color": "hsl(40.90909090909091, 50%, 50%)",
        "symbol": 2
    },
    "line":
    {
        "width": 3
    },
    "yaxis": "y2",
    "uid": "3ce212"
},
{
    "x": ["2016-2-24"],
    "y": [83.7],
    "autotick": false,
    "ticks": ["2016-2-24"],
    "name": "CA19-9 (U/ml)",
    "text": [
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-2-24<br /><b>CA19-9</b>: 83.7 U/ml<br />"
    ],
    "hoverinfo": "text",
    "type": "scatter",
    "mode": "lines+markers",
    "marker":
    {
        "size": 12,
        "color": "hsl(71.81818181818181, 50%, 50%)",
        "symbol": 3
    },
    "line":
    {
        "width": 3
    },
    "yaxis": "y3",
    "uid": "fb851d"
},
{
    "x": ["2015-7-20", "2016-2-8", "2016-2-24", "2016-3-31"],
    "y": [24, 19, 29, 38],
    "autotick": false,
    "ticks": ["2015-7-20", "2016-2-8", "2016-2-24", "2016-3-31"],
    "name": "Primary Tumor (mm)",
    "text": [
        "<b>Patient: </b>4442<br /><b>Date: </b>2015-7-20<br /><b>Primary Tumor</b>: 24 mm<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-2-8<br /><b>Primary Tumor</b>: 19 mm<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-2-24<br /><b>Primary Tumor</b>: 29 mm<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-3-31<br /><b>Primary Tumor</b>: 38 mm<br />"
    ],
    "hoverinfo": "text",
    "type": "scatter",
    "mode": "lines+markers",
    "marker":
    {
        "size": 12,
        "color": "hsl(102.72727272727273, 50%, 50%)",
        "symbol": 4
    },
    "line":
    {
        "width": 3
    },
    "yaxis": "y12",
    "uid": "0d49b8"
},
{
    "x": ["2015-7-7", "2016-2-8", "2016-2-24"],
    "y": [22, 13, 17],
    "autotick": false,
    "ticks": ["2015-7-7", "2016-2-8", "2016-2-24"],
    "name": "peripancreatic lymph node (mm)",
    "text": [
        "<b>Patient: </b>4442<br /><b>Date: </b>2015-7-7<br /><b>Tumor Size</b>: 22 mm<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-2-8<br /><b>Tumor Size</b>: 13 mm<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-2-24<br /><b>Tumor Size</b>: 17 mm<br />"
    ],
    "hoverinfo": "text",
    "type": "scatter",
    "mode": "lines+markers",
    "marker":
    {
        "size": 12,
        "color": "hsl(133.63636363636363, 50%, 50%)",
        "symbol": 5
    },
    "line":
    {
        "width": 3
    },
    "yaxis": "y12",
    "uid": "f965de"
},
{
    "x": ["2015-7-7", "2016-2-8"],
    "y": [13, 15],
    "autotick": false,
    "ticks": ["2015-7-7", "2016-2-8"],
    "name": "portocaval lymph node (mm)",
    "text": [
        "<b>Patient: </b>4442<br /><b>Date: </b>2015-7-7<br /><b>Tumor Size</b>: 13 mm<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-2-8<br /><b>Tumor Size</b>: 15 mm<br />"
    ],
    "hoverinfo": "text",
    "type": "scatter",
    "mode": "lines+markers",
    "marker":
    {
        "size": 12,
        "color": "hsl(164.54545454545453, 50%, 50%)",
        "symbol": 6
    },
    "line":
    {
        "width": 3
    },
    "yaxis": "y12",
    "uid": "9118ec"
},
{
    "x": ["2016-2-24", "2016-3-14", "2016-3-15", "2016-3-30", "2016-3-31",
        "2016-4-1", "2016-4-2", "2016-4-3", "2016-4-4", "2016-4-9",
        "2016-4-14", "2016-4-15", "2016-4-16", "2016-4-17", "2016-4-18",
        "2016-4-19", "2016-4-22", "2016-4-23", "2016-4-27", "2016-4-29",
        "2016-5-11", "2016-5-25"
    ],
    "y": [89.767, 89.812, 88.905, 87.952, 88.4, 88.3, 97.7, 95.4, 91.6, 89.5,
        87.9, 88.6, 87.8, 86.1, 84.3, 85, 87.4, 88.2, 89.3, 86.2, 80.604,
        82.192
    ],
    "autotick": false,
    "ticks": ["2016-2-24", "2016-3-14", "2016-3-15", "2016-3-30",
        "2016-3-31", "2016-4-1", "2016-4-2", "2016-4-3", "2016-4-4",
        "2016-4-9", "2016-4-14", "2016-4-15", "2016-4-16", "2016-4-17",
        "2016-4-18", "2016-4-19", "2016-4-22", "2016-4-23", "2016-4-27",
        "2016-4-29", "2016-5-11", "2016-5-25"
    ],
    "name": "Weight (kg)",
    "text": [
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-2-24<br /><b>Weight</b>: 89.767 kg<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-3-14<br /><b>Weight</b>: 89.812 kg<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-3-15<br /><b>Weight</b>: 88.905 kg<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-3-30<br /><b>Weight</b>: 87.952 kg<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-3-31<br /><b>Weight</b>: 88.4 kg<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-4-1<br /><b>Weight</b>: 88.3 kg<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-4-2<br /><b>Weight</b>: 97.7 kg<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-4-3<br /><b>Weight</b>: 95.4 kg<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-4-4<br /><b>Weight</b>: 91.6 kg<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-4-9<br /><b>Weight</b>: 89.5 kg<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-4-14<br /><b>Weight</b>: 87.9 kg<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-4-15<br /><b>Weight</b>: 88.6 kg<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-4-16<br /><b>Weight</b>: 87.8 kg<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-4-17<br /><b>Weight</b>: 86.1 kg<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-4-18<br /><b>Weight</b>: 84.3 kg<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-4-19<br /><b>Weight</b>: 85 kg<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-4-22<br /><b>Weight</b>: 87.4 kg<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-4-23<br /><b>Weight</b>: 88.2 kg<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-4-27<br /><b>Weight</b>: 89.3 kg<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-4-29<br /><b>Weight</b>: 86.2 kg<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-5-11<br /><b>Weight</b>: 80.604 kg<br />",
        "<b>Patient: </b>4442<br /><b>Date: </b>2016-5-25<br /><b>Weight</b>: 82.192 kg<br />"
    ],
    "hoverinfo": "text",
    "type": "scatter",
    "mode": "lines+markers",
    "marker":
    {
        "size": 12,
        "color": "hsl(195.45454545454547, 50%, 50%)",
        "symbol": 7
    },
    "line":
    {
        "width": 3
    },
    "yaxis": "y7",
    "uid": "8b5712"
}];