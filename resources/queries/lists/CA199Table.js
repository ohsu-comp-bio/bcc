/*
 * Copyright (c) 2011 LabKey Corporation
 *
 * Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0
 */
// ================================================

var console = require("console");

console.log("** evaluating: " + this['javax.script.filename']);
console.log(row.CA199Raw)

function beforeInsert(row, errors) {

    var flag_value;

    if(row.CA199Raw)
    {
        flag_value = row.CA199Raw.match(/[<>=]/);
        if (flag_value)
        {
            //  Extract purely numeric value
            row.CA199 = row.CA199Raw.substring(1);
        }   else    {
            row.CA199 = row.CA199Raw;
        }
    }   //  fi
}



