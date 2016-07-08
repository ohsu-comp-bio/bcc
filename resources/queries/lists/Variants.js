/*
 * Copyright (c) 2011 LabKey Corporation
 *
 * Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0
 */
// ================================================

var console = require("console");
var LABKEY = require("labkey");

console.log("** evaluating Variants.js");

function beforeInsert(row, errors){
    beforeUpsert(row, errors);
}

function beforeUpdate(row, errors){
    beforeUpsert(row, errors);
}

function beforeUpsert(row, errors) {

    if((row.CGC_Cancer_Somatic_Mut == "yes") && (row.CGC_Mutation_Type == "Mis"))    {
        row.CGCJudgment = "Yes";
    }   //  fi

    var COSMIC_value = row.COSMIC_overlapping_mutations;
    var protein_value = row.Protein_Change;
    if(protein_value)    {
        console.log("protein_value: " + protein_value);
        var result = COSMIC_value.indexOf(protein_value);
        if(result > 0)
        {
            row.Previously_found_in_COSMIC = "Yes";
        }   //  fi
    }

}







