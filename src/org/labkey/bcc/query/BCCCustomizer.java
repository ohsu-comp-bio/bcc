package org.labkey.bcc.query;

import org.labkey.api.data.AbstractTableInfo;
import org.labkey.api.data.ColumnInfo;
import org.labkey.api.data.TableInfo;
import org.labkey.api.data.WrappedColumn;
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
            AbstractTableInfo ati = (AbstractTableInfo)ti;

            doSharedCustomization(ati);

            //now table-specific customization:
            if (matches(ti, "study", "demographics"))
            {
                customizeDemographicsTable((AbstractTableInfo) ti);
            }
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

    private void customizeDemographicsTable(AbstractTableInfo ti)
    {
        if (ti.getColumn("somaticMutations") == null)
        {
            UserSchema us = getUserSchema(ti, "study");
            ColumnInfo col17 = getWrappedIdCol(us, ti, "somaticMutations", "demographicsSomicMutations");
            col17.setLabel("Somatic Mutation Summary");
            col17.setDescription("Provides summaries of somatic mutation data");
            col17.setDisplayWidth("150");
            ti.addColumn(col17);
        }
    }

    /**
     * Use this to link other queries to the demographics table.  The target query must have one row per patient.
     * This is most commonly used to link queries that calculate some type of patient-level summary of the data,
     * such as total mutants by type.  This linkage allows one to join other columns into any table where a patientId
     * is present.
     */
    private ColumnInfo getWrappedIdCol(UserSchema us, AbstractTableInfo ds, String name, String queryName)
    {
        return getWrappedCol(us, ds, name, queryName, "OPTR", "OPTR");
    }

    private ColumnInfo getWrappedCol(UserSchema us, AbstractTableInfo ds, String name, String queryName, String colName, String targetCol)
    {

        WrappedColumn col = new WrappedColumn(ds.getColumn(colName), name);
        col.setReadOnly(true);
        col.setIsUnselectable(true);
        col.setUserEditable(false);
        col.setFk(new QueryForeignKey(us, null, queryName, targetCol, targetCol));

        return col;
    }
}