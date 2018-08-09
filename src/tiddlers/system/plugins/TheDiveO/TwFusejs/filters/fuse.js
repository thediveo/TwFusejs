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

/* Gives a name to and and exports our fuse filter operator function. The parameters
 * to operator functions are as follows:
 *
 * source: a tiddler iterator that represents the results of the previous
 *    filter step.
 * operator: the arguments to this filter operator...
 *    .operator: name of the filter operator.
 *    .operand: the operand as a string; text references and variable names
 *       have already been resolved at this point.
 *    .prefix: an optional "!" if the filter is to be negated.
 *    .suffix: an optional string containing an additional filter argument.
 * options:
 *    .wiki: wiki object reference.
 *    .widget: an optional widget node object reference.
 *
 * It's allowed to return either an array of titles or a tiddler iterator,
 * depending on your needs.
 */
exports.fuse = function(source, operator, options) {
	var tiddlers = [];
	source(function(tiddler, title) {
    tiddlers.push(tiddler);
	});
	var optionsTitle = "$:/plugins/TheDiveO/TwFusejs/options/default";
	var optionsTiddler = options.wiki.getTiddler(optionsTitle);
	var options = JSON.parse(optionsTiddler.fields.text);
	var fuse = new Fuse(tiddlers, options);
	console.log("searching for:", operator.operand);
	console.log("options:", options);
	var result = fuse.search(operator.operand, options);
	console.log("results:", result);
	return result;
};

})();
