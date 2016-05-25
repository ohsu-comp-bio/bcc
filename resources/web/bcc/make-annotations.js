/*jslint browser: true, white: true, sloppy: true, indent: 4, maxerr: 999*/
function makeAnnotations(point_data, annotation_makers)
{
    //console.log("in makeAnnotatoins");
    //console.log(annotation_makers);
    
    var point = point_data.points[0];
    
    //console.log("point");
    //console.log(point);
    
    var point_number = point.pointNumber;
    //console.log("point.pointNumber: " + point_number);
    var yref = point.yaxis._id;
    //console.log("yref: " + yref);
    
    var name = point.fullData.name;
    //console.log("name: " + name);
    var annotationMaker = annotation_makers[name];
    //console.log("annotationMaker");
    //console.log(annotationMaker);
    
    var annotation_text = annotationMaker(point_number);
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
    
    var divid = document.getElementById('graph');
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
                    'graph',
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
        'graph',
        'annotations[' + newIndex + ']',
        newAnnotation
    );

}