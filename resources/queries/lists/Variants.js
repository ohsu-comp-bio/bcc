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

    if((row.CGC_Cancer_Somatic_Mut == "yes") && (row.CGC_Mutation_Type == "Mis"))    {
        row.CGCJudgment = "Yes";
    }

    var tempy = row.PreviousCOSMIC;


//    if(tempy.includes("blah"))  {
    if(tempy.includes("blah"))  {
        console.log("I contain a blah");
    }

//    if()
//        row.Previous_COSMIC = "Yes";

}







