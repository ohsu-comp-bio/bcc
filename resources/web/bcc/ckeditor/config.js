/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

console.log("in config.js");

CKEDITOR.editorConfig = function( config ) {
	config.toolbarGroups = [
		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
		{ name: 'links', groups: [ 'links' ] },
		{ name: 'insert', groups: [ 'insert' ] },
		{ name: 'forms', groups: [ 'forms' ] },
		{ name: 'tools', groups: [ 'tools' ] },
		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'others', groups: [ 'others' ] },
		'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
		{ name: 'styles', groups: [ 'styles' ] },
		{ name: 'colors', groups: [ 'colors' ] },
		{ name: 'about', groups: [ 'about' ] }
	];

	config.removeButtons = 'Underline,Subscript,Superscript,Scayt,Cut,Copy,Paste,PasteText,PasteFromWord,Redo,Undo,Link,Unlink,Anchor,SpecialChar,HorizontalRule,Table,Image,Source,Bold,Italic,Strike,RemoveFormat,NumberedList,BulletedList,Indent,Outdent,Blockquote,Styles,Format,About';
};