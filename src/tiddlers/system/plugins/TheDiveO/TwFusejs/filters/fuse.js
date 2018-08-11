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

// Locate the plugin title, so we can later easily access our plugin tiddlers
// without having to repeat the plugin title root/stem over and over again.
// Thanks to the CommonJS definitions, we have access to this tiddlers title
// as the module id(entifier).
var PLUGIN = module.id.split("/").slice(0, 4).join("/");

var Fuse = require(PLUGIN + "/libraries/fuse");

/* The "fuse" filter operator, powered by Fuse.js.
 *
 * Usage examples:
 *
 * [fuse[foobar]] searches all tiddlers (including shadows, et cetera!) for
 *    "foobar" or something similar, returning a list of matching tiddler
 *    titles.
 * [!is[current]!is[system]fuse[foobar]] searches only normal tiddlers.
 * [fuse:myfuseopts[foobar]] uses the fuse search options stored in the
 *   JSON data tiddler "myfuseopts" and searches for "foobar" or similar.
 *
 * The parameters to this operator function are as follows:
 *
 * source: a tiddler iterator that represents the results of the previous
 *    filter step. This is the set of tiddlers our fuse search operator will
 *    operate on.
 * operator: the arguments to the fuse filter operator...
 *    .operator: name of the filter operator: always "fuse".
 *    .operand: the operand as a string: what to search for; text references
 *       and variable names have already been resolved at this point into the
 *       string to be searched for.
 *    .prefix: an optional "!" if the filter is to be negated; this is ignored
 *       for the fuse search operator.
 *    .suffix: an optional string containing an additional filter argument:
 *       if not empty, then the operator suffix specifies the title of a
 *       JSON tiddler specifying the fuse search options to use.
 * options:
 *    .wiki: wiki object reference.
 *    .widget: an optional widget node object reference.
 *
 * It's allowed to return either an array of titles or a tiddler iterator,
 * depending on your needs: however, for the fuse operator, we always return
 * an array of title (strings).
 */
exports.fuse = function(source, operator, options) {
	//console.log("searching for:", "'"+operator.operand+"'");

	// As we want Fuse.js to search an array of tiddlers and not just
	// tiddler titles, we ensure to have all input tiddler objects ready
	// for Fuse.js to work on.
	var tiddlers = [];
	source(function(tiddler, title) {
    tiddlers.push(tiddler);
	});

	// Now prepare Fuse.js' options: read them from a JSON data tiddler,
	// which the user can specify as the filter operator suffix. If left
	// blank, then this defaults to the "default" search options JSON
	// data tiddler included in this plugin.
	var optionsTitle = operator.suffix || (PLUGIN + "/options/default");
	var optionsTiddler = options.wiki.getTiddler(optionsTitle);
	var options;
	try {
		options = JSON.parse(optionsTiddler.fields.text);
	} catch (e) {
		// Return an error message instead of a list of matching tiddlers
		// in case we cannot properly parse the options JSON data tiddler.
		console.log("invalid fuse options JSON tiddler:", optionsTitle);
		return ["invalid fuse options JSON tiddler: " + optionsTitle];
	}

	// Search!
	var fuse = new Fuse(tiddlers, options);
	var hits = fuse.search(operator.operand, options);

	// In case the fuse options cause hit objects instead of simple hit
	// strings to be returned, then only return the (hit) item; this should
	// be a tiddler title, if the "id" option was set to "fields.title".
	var result = [];
	$tw.utils.each(hits, function(hit) {
		if (typeof(hit) === "string")  {
			result.push(hit);
		} else {
			result.push(hit.item);
		}
	})
	return result;
};

})();
