/*
 * Copyright (c) 2011 LabKey Corporation
 *
 * Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0
 */
// ================================================

var console = require("console");
//var LABKEY = require("labkey");

console.log("** evaluating Variants.js");

function beforeInsert(row, errors){
    beforeUpsert(row, errors);
}

function beforeUpdate(row, errors){
    beforeUpsert(row, errors);
}

function beforeUpsert(row, errors) {

    //if((row.CGC_Cancer_Somatic_Mut == "yes") && (row.CGC_Mutation_Type == "Mis"))    {
    if(row.Flagged == "x")  {
        row.CGCJudgment = "Yes";
    }

    console.log("Flagged is: " + row.Flagged);
    console.log("CGC_Judgment AFTER is: " + row.CGCJudgment);
}







