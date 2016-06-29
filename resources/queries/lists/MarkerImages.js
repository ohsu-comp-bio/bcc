/*
 * Copyright (c) 2011 LabKey Corporation
 *
 * Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0
 */
// ================================================

var console = require("console");
var LABKEY = require("labkey");

console.log("** evaluating MarkerImages.js");

function beforeInsert(row, errors){
    beforeUpsert(row, errors);
}

function beforeUpdate(row, errors){
    beforeUpsert(row, errors);
}

function beforeUpsert(row, errors) {

    var qresults = LABKEY.Query.selectRows({
        schemaName: 'lists',
        queryName: 'Studies',
        columns: ['StudyID']
    });

    console.log("Query results: " + qresults);


}





