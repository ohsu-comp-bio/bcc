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
}
