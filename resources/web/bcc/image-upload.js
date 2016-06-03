// Code goes here

$(document).ready(function()
{
    //configureEditor();
    addButtonHandlers();
    getData(fillDisplay);
    $('#editor').hide();
});


function addButtonHandlers()
{
    $('#save').on('click', function(event)
    {
        console.log('save clicked');
        event.preventDefault();
        console.log('default caught');
        var htmldata = CKEDITOR.instances['editor'].getData();
        //htmldata = htmldata.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        console.log(htmldata);

        LABKEY.Query.updateRows(
        {
            schemaName: 'lists',
            queryName: 'UploadImages',
            rows: [{'ImageID': 1, "HTML": unescape(htmldata)}],
            success: function(data){console.log("success!"); console.log(data);},
            failure: function(data){console.log("failure!"); console.log(data)}
        });

        $('#display').html(htmldata);

        destroyEditor();
    });

    $('#edit').on('click', function(event)
    {
        console.log("save clicked");
        event.preventDefault();
        console.log("default caught");

        console.log("createing editor");
        getData(createEditor);
    });

}


function createEditor(html)
{
    console.log("creating editor");

    $('#editor').show();

    var editor = CKEDITOR.replace( 'editor',
    {
        height: 150,
        extraPlugins: 'sourcedialog,base64image',
        // Configure your file manager integration. This example uses CKFinder 3 for PHP.
        filebrowserBrowseUrl: '/ckfinder/ckfinder.html',
        filebrowserImageBrowseUrl: '/ckfinder/ckfinder.html?type=Images',
        filebrowserUploadUrl: 'yahoo.com',
        filebrowserImageUploadUrl: 'yahoo.com'
    });

    CKEDITOR.editorConfig = function( config )
    {
        config.uiColor = '#AADC6E';
        config.allowedContent = true;
        config.extraPlugins = 'base64image';
    };

    editor.setData(html);

    return editor;
}


function fillDisplay(html)
{
    console.log("filling display");
    $('#display').html(html);
    console.log("what's in the display div:");
    console.log($('#display').html());
}


function getData(displayData)
{
    LABKEY.Query.selectRows({
        schemaName: 'lists',
        queryName: 'UploadImages',
        columns: ["html"],
        filterArray:
        [
        	LABKEY.Filter.create('ImageID', '1')
        ],
        success: function(result)
        {
            console.log("success!");
            console.log(result);
        
            var html = unescape(unescape(result.rows[0].HTML));
            html = html.replace(/\&lt;/g, "<").replace(/\&gt;/g, ">");
            
            displayData(html);
        },
        failure: function(data){console.log("failure!"); console.log(data);}
    });
}


function destroyEditor()
{
    console.log("destroying editor");
    console.log(editor);
    CKEDITOR.instances['editor'].destroy();
    $('#editor').hide();
}


// http://ckeditor.com/addon/simpleuploads
//https://cdn.ckeditor.com/4.5.9/standard/ckeditor.js

