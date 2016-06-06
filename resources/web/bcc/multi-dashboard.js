var portlets = {};

$(document).ready(function()
{
    console.log("document ready");
    configureDashboardMain();
    configurePortletArea();
    $('#portlet-area').empty();
    console.log($('#portlet-area').html());
    loadPage();

});

function configureDashboardMain()
{
    console.log("configuring dashbaord");

    $('#container').parents().closest('div').css('padding-top', '0');
    $('#container').parents().closest('labkey-wp-body').css('padding-top', '0', 'margin', '0');
    $('#container').parents().closest('tr').css('padding-top', '0', 'margin', '0');
    $('#container').parents().closest('td').css('padding-top', '0', 'margin', '0');
    $('#container').parents().closest('tbody').css('padding-top', '0', 'margin', '0');

    $('#header').css
    ({
        "max-width": "100%",
        "margin": "0 auto 0 0"
    });

    $('#save-dashboard').on('click', function()
    {
        savePage();
    });

    $('#add-portlet').on('click', function(event)
    {
        addPortlet();
    });

}

function configurePortletArea()
{
    console.log("configuring column");

    $("#portlet-area").sortable({
        connectWith: "#portlet-area",
        handle: ".portlet-header",
        cancel: ".portlet-toggle, .title",
        placeholder: "portlet-placeholder ui-corner-all",
        cursor: "move",
        stop: function() {
            console.log("stopped");
        },
        update: function() {
            console.log("updated");
        },
        changed: function() {
            console.log("changed");
            $('#save-dashboard').css('color', 'red');
        }
    });

    $('#portlet-area').css(
    {
        "width": "100%",
    });

    $('.fa').css('margin', 'auto 1em 0 0');
}

function addPortlet()
{
    // Create the new portlet
    var portlet_string  = "<div class='portlet'>\n"
                        + "    <div class='portlet-header'><span class='title'>Header</span></div>\n"
                        + "    <div class='portlet-content'>Content</div>\n"
                        + "</div>";

    var $new_portlet = $(portlet_string);
    $new_portlet
        .addClass
        (
            "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"
        )
        .css(
        {
            "width": "100%",
            "margin": "1em auto 0 0",
        });

    $new_portlet.find(".portlet-header")
        .addClass("ui-widget-header ui-corner-all")
        .prepend("<span class='fa fa-plus fa-pull-right portlet-toggle'></span>")
        .prepend("<span class='fa fa-times fa-pull-right close'></span>")
        .prepend("<span class='fa fa-pencil fa-pull-right edit'></span>")
        .end();

    $('#portlet-area').append($new_portlet);

    configurePortlet($new_portlet);

}

function configurePortlet($portlet)
{
    var $portlet_toggle = $portlet.find('.portlet-toggle');
    /*
    if ($portlet.is(':visible'))
    {
        $portlet_toggle.removeClass('fa-minus').addClass('fa-plus');
    }
    else
    {
        $portlet_toggle.removeClass('fa-plus').addClass('fa-minus');
    }
    */

    console.log($portlet);

    // Add toggle event
    $portlet.find(".portlet-toggle").on('click', function()
        {
            console.log("portlet toggle clicked");
            $portlet_toggle = $(this);

            if ($portlet_toggle.hasClass('fa-minus'))
            {
                console.log("has minus");
                $portlet_toggle.removeClass('fa-minus').addClass('fa-plus');
            }
            else if ($portlet_toggle.hasClass('fa-plus'))
            {
                console.log("has plus");
                $portlet_toggle.removeClass('fa-plus').addClass('fa-minus');
            }

            $(this).closest(".portlet").find(".portlet-content").toggle();
        });

    // Add close event
    $portlet.find('.close').on('click', function()
        {
            if ($('#editor').length>0)
            {
                CKEDITOR.instances['editor'].destroy();
                $('#editor').remove();
            }

            $(this).parents(".portlet:first").remove();
        });

    // Add edit event
    $portlet.find('.edit').on('click', function()
    {
        $portlet = $(this).closest('.portlet');
        $portlet_toggle = $portlet.find('.portlet-toggle');
        var $portlet_content = $portlet.find('.portlet-content');

        if ($('#editor').length>0) // Then already in edit mode
        {
            console.log("saving and closing editor");

            // Update portlet title
            $portlet
                .find('.title')
                .attr('contenteditable','false')
                .css('border','');

            // Make sure content is showing and minus sign is showing
            if ($portlet_toggle.hasClass('fa-minus'))
            {
                $portlet_toggle.removeClass('fa-minus').addClass('fa-plus');
            }
            else if ($portlet_toggle.hasClass('fa-plus'))
            {
                $portlet_toggle.removeClass('fa-plus').addClass('fa-minus');
            }

            if (!$portlet_content.is(':visible'))
            {
                $portlet_content.show();
            }

            // toggle pencil/floppy
            $portlet.find('.edit').toggleClass("fa-pencil fa-floppy-o");
            CKEDITOR.instances['editor'].destroy();
            $('#editor').remove();

            savePage();
        }
        else // enable edit mode
        {
            // get value of title
            var $portlet_header = $portlet.find('.portlet-header');
            var temp_title = $portlet_header.find('.title').html();
            console.log("temp title: " + temp_title);
            $portlet_header
                .find('.title')
                .attr('contenteditable','true')
                .css('border','2px solid green');
            // Add the textarea for the ckeditor
            $portlet.after('<textarea id=\'editor\'></textarea>');
            // Open the portlet content
            $portlet.find('.portlet-content').toggle();
            // Make sure content is showing and minus sign is showing
            // Make sure content is showing and minus sign is showing
            if ($portlet_toggle.hasClass('fa-plus'))
            {
                $portlet_toggle.toggleClass("fa-plus fa-minus");
            }
            if (!$portlet_content.is(':visible'))
            {
                $portlet_content.show();
            }
            // Toggle the edit/save icons
            $portlet.find('.edit').toggleClass("fa-pencil fa-floppy-o");
            // Instantiate the editor
            //var ckeditor = CKEDITOR.replace('editor');

            var base_url = LABKEY.ActionURL.getBaseURL();
            console.log("base URL: " + base_url);
            CKEDITOR.plugins.addExternal('base64image', base_url + 'bcc/ckeditor/plugins/base64image/');

            var ckeditor = CKEDITOR.replace( 'editor',
            {
                height: 150,
                extraPlugins: 'base64image',
                removeButtons: "Image"
            });

            // Fill the editor with the current portlet content
            ckeditor.setData($portlet_content.html());
            // Dynamically update the portlet content with the editor content
            ckeditor.on('change',function()
            {
                var html = this.getData();
                //console.log(html);
                $portlet_content.html(html);
            });
        }
    });

    console.log("new portlet");
    console.log($portlet.prop('outerHTML'));

    $('.fa').css('margin', 'auto 1em auto 0');
}

function savePage()
{
    //var htmldata = CKEDITOR.instances['editor'].getData();
    //htmldata = htmldata.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    //console.log(htmldata);

    var portlet_area = $('#portlet-area').html();
    console.log("saving html");
    console.log(portlet_area);

    LABKEY.Query.updateRows(
    {
        schemaName: 'lists',
        queryName: 'UploadImages',
        rows: [{'ImageID': 2, "HTML": portlet_area}],
        success: function(data){console.log("save success!"); console.log(data);},
        failure: function(data){console.log("save failure!"); console.log(data)}
    });

    //$('#display').html(htmldata);

    //destroyEditor();
}

function loadPage()
{
    console.log("loading page");
    LABKEY.Query.selectRows({
        schemaName: 'lists',
        queryName: 'UploadImages',
        columns: ["html"],
        filterArray:
        [
        	LABKEY.Filter.create('ImageID', 2)
        ],
        success: function(result)
        {
            console.log("success!");
            console.log(result);

            var html = unescape(unescape(result.rows[0].HTML));
            html = html.replace(/\&lt;/g, "<").replace(/\&gt;/g, ">");

            console.log("loading page html");
            console.log(html);

            if (html === null || html == "null")
            {
                return;
            }

            $('#portlet-area').html(html);

            //configurePortletArea();

            console.log("configuring portlets");
            $('.portlet').each(function()
            {
                console.log("configuring portlet");
                console.log($(this));
                configurePortlet($(this));
            });

            //displayData(html);
        },
        failure: function(data){console.log("failure!"); console.log(data);}
    });

    $('#portlet-area').css
    ({
        "width": "100%",
    });

    $('.fa').css('margin', 'auto 1em 0 0');

    $('.portlet').css
    ({
        "width": "100%",
        "margin": "1em auto 0 0",
    });

    //configurePortletArea();
}

