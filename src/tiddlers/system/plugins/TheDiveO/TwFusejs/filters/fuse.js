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

// Plugin-relative path to default Fuse.js options JSON data tiddler.
var FUSE_OPTS_DEFAULT = "/options/default";

// Locate the plugin title, so we can later easily access our plugin tiddlers
// without having to repeat the plugin title root/stem over and over again.
// Thanks to the CommonJS definitions, we have access to this tiddlers title
// as the module id(entifier).
var PLUGIN = module.id.split("/").slice(0, 4).join("/");

var Fuse = require("../libs/fuse.js");
var Deep = require("../libs/deep.js");

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
 *    have to search through.
 * operator: the arguments to the fuse filter operator...
 *    .operator: name of the filter operator: always "fuse", so AWFUL.
 *    .operand: the operand as a string: what to search for; text references
 *       and variable names have already been resolved at this point into the
 *       string to be searched for.
 *    .prefix: an optional "!" if the filter is to be negated; when the prefix
 *       is empty, then options.matchAllTokens=True is assumed; if the prefix
 *       is "!", then options.matchAllTokens=False.
 *    .suffix: an optional string containing an additional filter argument:
 *       the name of a (TiddlyWiki) variable either directly specifying the
 *       Fuse.js options in form of a JSON string, or instead referencing a
 *       JSON data tiddler by title which then contains the Fuse.js options.
 *       If left empty/unspecified, then the default TwFusejs plugin options
 *       will be taken instead, stored in ./options/default inside this plugin.
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
		if (!!tiddler) {
			tiddlers.push(tiddler);
		}
	});

	// Prepare the Fuse.js search options: there are basically three different
	// sources:
	// 1. no suffix given: take the default options.
	// 2. suffix given, contains JSON data resulting in an option object.
	// 3. suffix given, not JSON, but instead references a JSON data tiddler.
	var fuse_options;
	if (!operator.suffix) {
		// case 1: use the default, Luke!
		// console.log("using default TwFusejs options");
		var optionsTitle = PLUGIN + FUSE_OPTS_DEFAULT;
		try {
			fuse_options = JSON.parse(options.wiki.getTiddler(optionsTitle).fields.text);
		} catch (e) {
			// Return an error message instead of a list of matching tiddlers
			// in case we cannot properly parse the options JSON data tiddler.
			var msg = "invalid fuse options JSON tiddler: \"" + optionsTitle + "\"";
			console.log(msg);
			return [msg];
		}
	} else if (options.widget) {
		// try case 2: variable contents are JSON.
		// console.log("using variable:", operator.suffix);
		try {
			fuse_options = JSON.parse(options.widget.getVariable(operator.suffix));
			// console.log("variable JSON contents:", options.widget.getVariable(operator.suffix));
		} catch (e) {
			fuse_options = null;
		}
		if (!fuse_options || typeof fuse_options === "string") {
			// Erm, case 2 failed, so this should better be case 3: a title of a
			// JSON data tiddler.
			var optionsTitle = fuse_options ?
						fuse_options : options.widget.getVariable(operator.suffix);
			// console.log("using JSON tiddler:", optionsTitle);
			try {
				fuse_options = JSON.parse(
					options.wiki.getTiddler(optionsTitle).fields.text);
			} catch (e) {
					var msg = "malformed JSON data in tiddler \"" + optionsTitle + "\"";
					console.log(msg);
					return [msg];
			}
		}
	} else {
		// erm: suffix = variable name given, but there is no widget context and
		// thus no variables...
		var msg = "missing widget context to look up search options variable";
		console.log(msg);
		return [msg];
	}

	// Handle optional "!" prefix: when no prefix is given, or the prefix
	// is something other than "!", then we AND all search tokens; otherwise,
	// we OR them.
	fuse_options.matchAllTokens = operator.prefix !== "!";
	// console.log("Find all matches:", fuse_options.matchAllTokens);

	// Handle options element "getFn" especially: Fuse.js expect it to
	// contain a function object. If it contains a string instead, then
	// we interpret it to be a module export, so we try to locate the
	// exported function.
	if (fuse_options.getFn && typeof fuse_options.getFn === "string") {
		try {
			// First try to resolve the given module tiddler title; if that fails,
			// then try again with ".js" appended to the title.
			var module;
			try {
				module = require(fuse_options.getFn);
			} catch (e) {
				if ($tw.utils.strEndsWith(fuse_options.getFn, ".js")) {
					throw e;
				}
				module = require(fuse_options.getFn + ".js");
			}
			fuse_options.getFn = module.getFn;
		} catch (e) {
			console.warn("cannot resolve getFn:", fuse_options.getFn);
			delete fuse_options.getFn;
		}
	} else {
		delete fuse_options.getFn;
	}

	// Nota bene: the "id" option is gone as of Fuse.js 5.0.1 (5.0.2?) Yeah,
	// great idea to introduce breaking changes within a major version. So
	// we're going to emulate it from now on; but still support it in the
	// search options configuration tiddlers.
	var idfield = fuse_options.id || "fields.title";

	// Ready to search!
	var search_terms = operator.operand.trim();
	// console.log("Fuse.js search for:", "'"+search+"'");
	// console.log("Fuse.js options:", fuse_options);
	var fuse = new Fuse(tiddlers, fuse_options);
	var hits = search_terms ? fuse.search(search_terms) : [];

	// In case the fuse options cause hit objects instead of simple hit
	// strings to be returned, then only return the (hit) item; this should
	// be a tiddler title, if the "id" option was set to "fields.title".
	var result = [];
	$tw.utils.each(hits, function(hit) {
		if (typeof(hit) === "string")  {
			result.push(hit);
		} else {
			// If we got back an item object, with newer Fuse.js releases we
			// now have to look up the wanted identifying ("id") field
			// ourselves.
			result.push(Deep.deep(hit.item, idfield, [])[0]);
		}
	})
	return result;
};

})();
