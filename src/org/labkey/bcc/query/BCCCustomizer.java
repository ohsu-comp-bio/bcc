package org.labkey.bcc.query;

import org.labkey.api.data.AbstractTableInfo;
import org.labkey.api.data.TableInfo;
import org.labkey.api.ldk.LDKService;
import org.labkey.api.ldk.table.AbstractTableCustomizer;
import org.labkey.api.query.QueryForeignKey;
import org.labkey.api.query.QueryService;
import org.labkey.api.query.UserSchema;

/**
 * Created by bimber on 11/18/2015.
 */
public class BCCCustomizer extends AbstractTableCustomizer
{
    @Override
    public void customize(TableInfo ti)
    {
        LDKService.get().getDefaultTableCustomizer().customize(ti);

        //this allows us to apply standard customization to any table configured to use this customizer
        if (ti instanceof AbstractTableInfo)
        {
            doSharedCustomization((AbstractTableInfo) ti);
        }
    }

    private void doSharedCustomization(AbstractTableInfo ti)
    {
        if (ti.getColumn("OPTR") != null)
        {
            ti.getColumn("OPTR").setRequired(true);
            UserSchema studySchema = QueryService.get().getUserSchema(ti.getUserSchema().getUser(), ti.getUserSchema().getContainer(), "study");
            if (studySchema != null)
            {
                //this FK will reference PatientDemographics, specifically pointing to OPTR, which is not the true PK of that dataset
                ti.getColumn("OPTR").setFk(new QueryForeignKey(studySchema, ti.getUserSchema().getContainer(), "PatientDemographics", "OPTR", "OPTR"));
            }
        }

        //add more code below, to test for columns and apply other standardizations, such as always hiding built-in fields
        if (ti.getColumn("lsid") != null)
        {
            ti.getColumn("lsid").setHidden(true);
        }

        if (ti.getColumn("StudyId") != null)
        {
            ti.getColumn("StudyId").setLabel("Study ID");
        }

        if (ti.getColumn("objectid") != null)
        {
            ti.getColumn("objectid").setHidden(true);
        }

    }
}