package org.labkey.bcc;

import org.labkey.api.data.ColumnInfo;
import org.labkey.api.data.DisplayColumn;
import org.labkey.api.data.DisplayColumnFactory;

/**
 * Created by bimber on 10/21/2015.
 */
public class AttachedFileDisplayColumnFactory implements DisplayColumnFactory
{
    @Override
    public DisplayColumn createRenderer(ColumnInfo colInfo)
    {
        return new AttachedFileDisplayColum(colInfo);
    }
}
