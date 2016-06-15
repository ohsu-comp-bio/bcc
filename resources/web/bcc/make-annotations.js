/*jslint browser: true, white: true, sloppy: true, indent: 4, maxerr: 999*/

// Generates the annotations used for hovers and popups. These are allowed
// minimal html tags like <b> and <i>

// @point_data -- structure passed to click event callback
// @annotation_makers -- a structure of callback functions
//  to make annotations that is indexed by table name.
//
// The annotation making process is fairly complicated, and can
// be simplified. But it is challenging because the click event
// is handled by a callback, but Plotly does not pass in all
// the information we would like to use in the annotation. So I
// created the list of annotation_makers which are are function
// closures that carry data from outside the scope of the event
// callback into the click event handler.
function makeAnnotations(point_data, annotation_makers)
{
    //console.log("in makeAnnotatoins");
    //console.log(annotation_makers);
    
    var point = point_data.points[0]; // contains the x and y values of the point
    
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