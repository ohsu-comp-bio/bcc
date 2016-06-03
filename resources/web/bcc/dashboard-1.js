$(document).ready(function()
{
    $( ".column" ).sortable({
        connectWith: ".column",
        handle: ".portlet-header",
        cancel: ".portlet-toggle",
        placeholder: "portlet-placeholder ui-corner-all",
        cursor: "move"
    });

    $( ".portlet" )
        .addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
        .find( ".portlet-header" )
        .addClass( "ui-widget-header ui-corner-all" )
        .prepend( "<span class='ui-icon ui-icon-plusthick portlet-toggle'></span>");


    $( ".portlet-toggle" ).click(function() {
        var icon = $( this );
        icon.toggleClass( "ui-icon-minusthick ui-icon-plusthick" );
        icon.closest( ".portlet" ).find( ".portlet-content" ).toggle();
    });

    $('#serialize').on('click', function()
    {
        var sorted = $( ".column" ).sortable( "serialize", { key: "sort" } );
        //console.log(sorted);
        var sortedIDs = $( ".column" ).sortable( "toArray" );
        //console.log(sortedIDs);
        var ids = $('.column').children('.portlet').map(function(index, item)
        {
            return item.id;
        });
        console.log(ids);
    });

});



//http://stackoverflow.com/questions/10441751/how-to-minimize-a-jquery-ui-portlet-by-default