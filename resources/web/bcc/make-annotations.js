/*jslint browser: true, white: true, sloppy: true, indent: 4, maxerr: 999*/

// Generates the annotations used for hovers and popups. These are allowed
// minimal html tags like <b> and <i>

// @point_data -- structure passed to click event callback
function makeAnnotations(point_data, graph_div_id)
{
    //console.log("in makeAnnotatoins");

    var point = point_data.points[0]; // contains the x and y values of the point
    
    //console.log("point");
    //console.log(point);
    
    var yref = point.yaxis._id;
    //console.log("yref: " + yref);

    var annotation_text = point.fullData.text[point.pointNumber];
    //console.log("annotation_text");
    //console.log(annotation_text);
    
    var newAnnotation =
    {
        x: point.x,
        y: point.y,
        yref: yref,
        arrowhead: 8,
        ax: 0,
        ay: -60,
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        arrowcolor: point.fullData.marker.color,
        font:
        {
            size: 10
        },
        bordercolor: point.fullData.marker.color,
        borderwidth: 2,
        borderpad: 2,
        text: annotation_text
    };
    
    var divid = document.getElementById(graph_div_id);
    var newIndex = (divid.layout.annotations || []).length;
    
    // delete instead if clicked twice
    if (newIndex)
    {
        var foundCopy = false;
        divid.layout.annotations.forEach(function(ann, sameIndex)
        {
            if (ann.text === newAnnotation.text)
            {
                Plotly.relayout
                (
                    graph_div_id,
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
        graph_div_id,
        'annotations[' + newIndex + ']',
        newAnnotation
    );

}