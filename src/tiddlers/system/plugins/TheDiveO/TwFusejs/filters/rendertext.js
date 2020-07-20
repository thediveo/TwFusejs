/*\
created: 20180811135806330
title: $:/plugins/TheDiveO/TwFusejs/filters/rendertext.js
type: application/javascript
modified: 20180811140005330
tags:
module-type: filteroperator
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/* Given a set of titles, renders each title's text content (or another tiddler
 * field) into text.
 *
 * Usage examples:
 *
 * [rendertext[]] renders each title's text field into plain text.
 *
 * [rendertext:F[]] renders each title's field "F" into plain text.
 *
 * The parameters to the operator function are as follows:
 *
 * source: a tiddler iterator that represents the results of the previous
 *    filter step.
 * operator: the arguments to this filter operator...
 *    .operator: name of the filter operator.
 *    .operand: the operand as a string; text references and variable names
 *       have already been resolved at this point. This filter ignores the
 *       operand.
 *    .prefix: an optional "!" if the filter is to be negated; this gets
 *       ignored by this filter, though.
 *    .suffix: an optional string containing an additional filter argument:
 *       the name of the tiddler field to render as text.
 * options:
 *    .wiki: wiki object reference.
 *    .widget: an optional widget node object reference.
 *
 * It's allowed to return either an array of titles or a tiddler iterator,
 * depending on your needs.
 */
exports.rendertext = function(source, operator, options) {
	var field = operator.suffix || "text";
	var results = [];
	source(function(tiddler, title) {
		if (!!tiddler) {
			//console.log("render tiddler:", tiddler);
			var text = options.wiki.renderText(
				"text/plain",
				tiddler.fields.type || "text/vnd.tiddlywiki",
			tiddler.fields[field],
				{
					parseAsInline: false,
					parentWidget: options.widget
				});
			results.push(text);
		}
	});
	return results;
};

})();
