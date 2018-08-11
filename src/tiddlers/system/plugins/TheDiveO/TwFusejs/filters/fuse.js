/*\
created: 20180809165919537
title: $:/plugins/TheDiveO/TwFusejs/filters/fuse.js
type: application/javascript
modified: 20180809170012994
tags:
module-type: filteroperator
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Fuse = require("$:/plugins/TheDiveO/TwFusejs/libraries/fuse");

/* The "fuse" filter operator, powered by Fuse.js.
 *
 * The parameters to this operator function are as follows:
 *
 * source: a tiddler iterator that represents the results of the previous
 *    filter step.
 * operator: the arguments to the fuse filter operator...
 *    .operator: name of the filter operator: always "fuse".
 *    .operand: the operand as a string, what to search for; text references
 *       and variable names have already been resolved at this point.
 *    .prefix: an optional "!" if the filter is to be negated; this is ignored.
 *    .suffix: an optional string containing an additional filter argument:
 *       it specifies the title of a JSON tiddler with fuse search options.
 * options:
 *    .wiki: wiki object reference.
 *    .widget: an optional widget node object reference.
 *
 * It's allowed to return either an array of titles or a tiddler iterator,
 * depending on your needs.
 */
exports.fuse = function(source, operator, options) {
	console.log("searching for:", "'"+operator.operand+"'");

	var tiddlers = [];
	source(function(tiddler, title) {
    tiddlers.push(tiddler);
	});
	var optionsTitle = operator.suffix || "$:/plugins/TheDiveO/TwFusejs/options/default";
	var optionsTiddler = options.wiki.getTiddler(optionsTitle);
	var options;
	try {
		options = JSON.parse(optionsTiddler.fields.text);
	} catch (e) {
		console.log("invalid fuse options JSON tiddler:", optionsTitle);
		return ["invalid fuse options JSON tiddler: " + optionsTitle];
	}

	var fuse = new Fuse(tiddlers, options);

	var result = fuse.search(operator.operand, options);
	return result;
};

})();
