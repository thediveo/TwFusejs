/*\
created: 20180815181502529
title: $:/plugins/TheDiveO/TwFusejs/getfns/multipath.js
type: application/javascript
modified: 20180815181519493
tags:
module-type: library
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

var deep = require(PLUGIN + "/libs/deep.js").deep;

/* Export a Fuse.js getFn function that interprets the key/path not as a single
 * attribute name, but instead as a list of names/keys/paths, separated by ",".
 * The resulting values are then banged together into one single string, with
 * the values separated by plain spaces " ".
 */
exports.getFn = function (item, key) {
  var keys = key.split(",");
  var results = [];
  $tw.utils.each(keys, function(key) {
    results.push(deep(item, key, []));
  });
  // Fuse.js expects getFn()s to return lists, erm, arrays, instead of
  // scalars.
  return [results.join(" ")];
};

})();