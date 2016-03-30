/*
 * Copyright (c) 2011 LabKey Corporation
 *
 * Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0
 */
// ================================================

var console = require("console");

//console.log("** evaluating: " + this['javax.script.filename']);

function beforeInsert(row, errors) {

    var flag_match;

    if(row.CA199){
        //  test - just do SOMEthing!
        //row.CA199 = '123456';

        //var match = row.stringResults.match(/^([<>=]*)[ ]*(\d*\.*\d*)([-]*\d*\.*\d*)([+]*)[ ]*(.*)$/);
//        flag_match = row.CA199.match(/^([<>=]*)[ ]*(\d*\.*\d*)([-]*\d*\.*\d*)([+]*)[ ]*(.*)$/);
        flag_match = row.CA199.match(/[<>=]/);
        if(flag_match)
            row.CA199 = '7734';

    }
}



