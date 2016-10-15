package org.labkey.bcc;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.labkey.api.attachments.Attachment;
import org.labkey.api.data.AttachmentDisplayColumn;
import org.labkey.api.data.ColumnInfo;
import org.labkey.api.data.RenderContext;
import org.labkey.api.util.MimeMap;
import org.labkey.api.util.PageFlowUtil;
import org.labkey.api.view.template.ClientDependency;

import java.io.File;
import java.io.IOException;
import java.io.Writer;
import java.util.Set;

/**
 * Created by bimber on 10/21/2015.
 */
public class AttachedFileDisplayColum extends AttachmentDisplayColumn
{

    MimeMap _map;

    public AttachedFileDisplayColum(ColumnInfo col)
    {
        super(col);
        _map = new MimeMap();
    }

    @Override
    public @NotNull Set<ClientDependency> getClientDependencies()
    {
        return PageFlowUtil.set(ClientDependency.fromPath("omerointegration/utils.js"), ClientDependency.fromPath("ldk/LDKApi.lib.xml"));
    }

    protected void renderIconAndFilename(RenderContext ctx, Writer out, String filename, boolean link, boolean thumbnail) throws IOException
    {
        renderIconAndFilename(ctx, out, filename, null, link, thumbnail);
    }

    protected void renderIconAndFilename(RenderContext ctx, Writer out, String filename, @Nullable String fileIconUrl, boolean link, boolean thumbnail) throws IOException
    {
        if (null != filename)
        {
            String url = null;

            if (link)
            {
                url = renderURL(ctx);

                if (null != url)
                {
                    out.write("<a title=\"Download attached file\" href=\"");
                    out.write(PageFlowUtil.filter(url));
                    out.write("\">");
                }
            }

            String displayName = getFileName(filename);
            boolean isImage = filename.toLowerCase().endsWith(".png")
                    || filename.toLowerCase().endsWith(".jpeg")
                    || filename.toLowerCase().endsWith(".jpg");

            if (url != null && thumbnail && isImage)
            {
                StringBuilder popupHtml = new StringBuilder();
                popupHtml.append("<img style=\"max-width:500px; height:auto;\" src=\"");
                popupHtml.append(PageFlowUtil.filter(url));
                popupHtml.append("\" />");

                StringBuilder thumbnailHtml = new StringBuilder();
                thumbnailHtml.append("<img style=\"display:block; height:auto; width:100%; max-width: 32px; vertical-align:middle\"");
                thumbnailHtml.append(" src=\"").append(PageFlowUtil.filter(url)).append("\"");
                thumbnailHtml.append(" title=\"").append(displayName).append("\"");
                thumbnailHtml.append("\" />");

                out.write(PageFlowUtil.helpPopup(displayName, popupHtml.toString(), true, thumbnailHtml.toString(), 310, url == null ? null : "window.open('" + url + "');"));
            }
            else
            {
                StringBuilder icon = new StringBuilder();
                icon.append("<img src=\"").append(ctx.getRequest().getContextPath());
                icon.append((null != fileIconUrl) ? fileIconUrl : Attachment.getFileIcon(filename));
                icon.append("\" alt=\"icon\"");
                icon.append("/>&nbsp;").append(PageFlowUtil.filter(displayName));

                if (url != null && thumbnail && _map.isInlineImageFor(new File(filename)) ) {
                    StringBuilder thumbnailHtml = new StringBuilder();
                    thumbnailHtml.append("<img style=\"max-width:300px; height:auto;\" src=\"");
                    thumbnailHtml.append(PageFlowUtil.filter(url));
                    thumbnailHtml.append("\" />");

                    out.write(PageFlowUtil.helpPopup(displayName, thumbnailHtml.toString(), true, icon.toString(), 310, url == null ? null : "window.open('" + url + "');"));
                }
                else
                    out.write(icon.toString());
            }

            if (link && null != url)
            {
                out.write("</a>");
            }
        }
        else
        {
            out.write("&nbsp;");
        }
    }

}
