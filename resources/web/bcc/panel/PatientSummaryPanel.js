Ext4.define('BCC.panel.PatientSummaryPanel', {
	extend: 'Ext.panel.Panel',
	
	initComponent: function(){
		Ext4.apply(this, {
			border: false,
			items: [{
				xtype: 'dataview',
				store: {
					type: 'labkey-store',
					filterArray: this.filterArray,
					schemaName: 'study',
					queryName: 'demographics',
					columns: 'OPTR,date,firstName,lastName,mrn,birth,gender,consentStatus,consentedDate,death,somaticMutations/totalVariants',
					autoLoad: true,
					listeners: {
						load: function(s){
							console.log(s.getCount())
						}
					}
				},
				tpl: ['<tpl for=".">',
					'<b>Patient Information:</b><br>',
					'<table>',
					'<tr><td>OPTR:</td><td>{OPTR}</td></tr>',
					'<tr><td>MRN:</td><td>{mrn}</td></tr>',
					'<tr><td>Name:</td><td>{lastName}, {firstName}</td></tr>',
					'<tr><td>Gender:</td><td>{gender}</td></tr>',
					'<tr><td>Birth:</td><td>{birth:date("Y-m-d")}</td></tr>',
					'<tr><td>Death:</td><td>{death:date("Y-m-d")}</td></tr>',
					'<tr><td>Consent Status:</td><td>{[values.consentStatus || "Unknown"]} <tpl if="consentedDate">({consentedDate:date("Y-m-d")})</tpl></td></tr>',
					'</table>',
					'<br>',
					'<b>Data Summary:</b>',
					'<table>',
					'<tr><td>Images:</td><td>{[this.getDataLink(values, "somaticMutations/totalVariants", "images")]}</td></tr>',
					'<tr><td>Variants:</td><td>{[this.getDataLink(values, "somaticMutations/totalVariants", "variants")]}</td></tr>',
					'</table>',
					'</tpl>',
					{
						getDataLink: function(values, fieldName, queryName){
							return '<a href="' + LABKEY.ActionURL.buildURL("query", "executeQuery", null, {schemaName: "study", queryName: queryName, "query.optr~eq": values.OPTR}) + '">' + (values[fieldName] || "0") + '</a>';
						}
					}
				]
			}]
		});
		
		this.callParent(arguments);
	}
});