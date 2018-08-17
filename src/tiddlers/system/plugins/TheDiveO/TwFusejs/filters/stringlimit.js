/*\
created: 20180811135806330
title: $:/plugins/TheDiveO/TwFusejs/filters/stringlimit.js
type: application/javascript
modified: 20180811140005330
tags:
module-type: filteroperator
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/* Given a set of titles, this filter limits each title to a certain maximum length..
 *
 * Usage examples:
 *
 * [stringlimit[]] limits title to the default length of 100 characters; defaults to
 *   adding a trailing ellipsis "..." when truncating a title.
 * [stringlimit[20]] truncates titles to max 20 characters.
 * [stringlimit:***[]] sets the ellipsis to "***" when truncating titles.
 *
 * The parameters to the operator function are as follows:
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
exports.stringlimit = function(source, operator, options) {
	var ellipsis = operator.suffix || "...";
	var maxTitleLen = parseInt(operator.operand) || 100;
	var results = [];
	source(function(tiddler, title) {
		if (title.length > maxTitleLen) {
			title = title.substr(0, maxTitleLen) + ellipsis;
		}
		results.push(title);
	});
	return results;
};

})();
