package org.labkey.bcc.query;

import org.labkey.api.data.AbstractTableInfo;
import org.labkey.api.data.ColumnInfo;
import org.labkey.api.data.JdbcType;
import org.labkey.api.data.SQLFragment;
import org.labkey.api.data.TableCustomizer;
import org.labkey.api.data.TableInfo;
import org.labkey.api.ldk.LDKService;
import org.labkey.api.query.ExprColumn;

import java.sql.JDBCType;
import java.util.ArrayList;
import java.util.List;


//  Based off of SamplesCustomizer.java file, from laboratory module
/**
 * User: pleyshock
 * Date: 1/15/2016
 * Time: 3:28 p.m.
 */

/*
public class MissingPatientDemographicsDataCustomizer implements TableCustomizer
{
    public MissingPatientDemographicsDataCustomizer()
    {

    }

    public void customize(TableInfo ti)
    {
        //apply defaults
        TableCustomizer tc = LDKService.get().getDefaultTableCustomizer();
        tc.customize(ti);

        if (ti instanceof AbstractTableInfo)
        {
            appendMissingDataColumn((AbstractTableInfo)ti);
        }

        //  commented out for hygiene's sake; we don't sort, for one thing
        //this customizer also sorts columns, so we append first
//        TableCustomizer tc2 = new LaboratoryTableCustomizer();
//        tc2.customize(ti);
    }

    private void appendMissingDataColumn(AbstractTableInfo ti)
    {
        if (ti.getColumn("missingdata") == null)
        {

            ColumnInfo firstName = ti.getColumn("FirstName");
            ColumnInfo lastName = ti.getColumn("LastName");
// Original query, which works; keeping here for reference
//            SQLFragment sql = new SQLFragment("(" + ExprColumn.STR_TABLE_ALIAS +".FirstName IS NULL)" );
//            ExprColumn col = new ExprColumn(ti, "missingdata", sql, JdbcType.BOOLEAN, firstName);

            SQLFragment sql = new SQLFragment("(" + ExprColumn.STR_TABLE_ALIAS +".FirstName IS NULL)"
                    + " OR "
                    + "(" + ExprColumn.STR_TABLE_ALIAS +".LastName IS NULL)"
                    + " OR "
                    + "(" + ExprColumn.STR_TABLE_ALIAS +".Gender IS NULL)"
                    + " OR "
                    + "(" + ExprColumn.STR_TABLE_ALIAS +".DOB1 IS NULL)"
                    + " OR "
                    + "(" + ExprColumn.STR_TABLE_ALIAS +".ConsentedDate IS NULL)"
                    + " OR "
                    + "(" + ExprColumn.STR_TABLE_ALIAS +".DeathDate IS NULL)"
                    + " OR "
                    + "(" + ExprColumn.STR_TABLE_ALIAS +".MRN IS NULL)"
            );
            ExprColumn col = new ExprColumn(ti, "missingdata", sql, JdbcType.BOOLEAN, firstName,
                    lastName);
            //  need logic here about what's true, what's false
            col.setLabel("MissingData");
            col.setDescription("This field indicates whether data is missing from Patient Demographic records.");

            //inject amount column after quantity.
            List<ColumnInfo> columns = new ArrayList<ColumnInfo>();
            columns.addAll(ti.getColumns());
            for (ColumnInfo c : columns)
                ti.removeColumn(c);

            int idx = columns.indexOf("FirstName");
            columns.add(idx + 1, col);
            for (ColumnInfo c : columns)
                ti.addColumn(c);

        }

    }
}

*/