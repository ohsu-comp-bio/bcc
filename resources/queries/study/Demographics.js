// 9-28-2016 CRP - I commented out the following line so that I could define my own trigger script
// to auto fill the date field.
// I am concerned that this is not the correct way to add my own script.
//require("bcc/triggers").initScript(this);
//var console = require("console");

function beforeInsert(row, errors) {
	//console.log("beforeInsert got triggered");
	//console.log("row is: " + row);
	// We are hiding the date field, but it is required, so we will just fill
	// it in with the current date.
	row.date = new Date();
    if(row['Date Of Birth']){
	    //console.log("beforeInsert row['Date Of Birth'] = " + row['Date Of Birth']);
        // On Insert, we are getting this format: 1941-09-14 23:00:00.0
        // Note that dates are being entered without any time.  Time is defaulting to 12 am,
        // but in some cases the timezone is being applied incorrectly so that an hour is lost.
        // This results in a date for the previous day.  As a workaround for this, we are going
        // to add 12 hours to the time.  This should place us in the correct day even when a
        // time zone calculation subtracts an hour.
        var str = new String(row['Date Of Birth']);
        var dobDTM = new Date(parseInt(str.substring(0,4), 10),
                              parseInt(str.substring(5,7), 10) - 1,
                              parseInt(str.substring(8,10), 10),
                              parseInt(str.substring(11,13), 10) + 12, // Add 12 hours to make it the middle of the day.
                              0,0,0);
        var gmtDtmStr = dobDTM.toISOString();
        //console.log("beforeInsert gmtDtmStr = " + gmtDtmStr);
        // Per JF, make sure we are not adding any time information to the DB.
        row['Date Of Birth'] = gmtDtmStr.substring(0,10);
    }
}

function beforeUpdate(row, oldRow, errors) {
	//console.log("beforeUpdate got triggered");
	//console.log("row is: " + row);
	// When updating a record, check the date and set it to the current date ONLY if
	// it is NOT already set to a valid date.
	var testDate = Date(row.date);
    if (testDate = 'Invalid Date') {
        row.date = new Date();
    }

    if(row['Date Of Birth']){
	    //console.log("beforeUpdate row['Date Of Birth'] = " + row['Date Of Birth']);
        // On Update, we are getting this format: Tue Oct 14 23:00:00 PST 1941
        // Note that dates are being entered without any time.  Time is defaulting to 12 am,
        // but in some cases the timezone is being applied incorrectly so that an hour is lost.
        // This results in a date for the previous day.  As a workaround for this, we are going
        // to add 12 hours to the time.  This should place us in the correct day even when a
        // time zone calculation subtracts an hour.
        var dobDTM = new Date(row['Date Of Birth']);
        dobDTM.setHours(12); // Add 12 hours to make it the middle of the day.
        var gmtDtmStr = dobDTM.toISOString();
        //console.log("beforeUpdate gmtDtmStr = " + gmtDtmStr);
        // Per JF, make sure we are not adding any time information to the DB.
        row['Date Of Birth'] = gmtDtmStr.substring(0,10);
    }
}
