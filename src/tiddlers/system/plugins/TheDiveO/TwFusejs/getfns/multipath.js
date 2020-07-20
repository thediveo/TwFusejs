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

var deep = require("../libs/deep.js").deep;

/* Export a Fuse.js getFn function that interprets the key/path not as a single
 * attribute name, but instead as a list of names/keys/paths, separated by ",".
 * The resulting values are then banged together into one single string, with
 * the values separated by plain spaces " ".
 */
exports.getFn = function (item, splitkey) {
  // Newer major versions of fuse.js now pass the key path as individual
  // components split at "." boundaries. We now reverse this good intention
  // without real value in order to correctly split into separate keys instead
  // of key components.
  var keys = splitkey.join(".").split(",")
  var results = [];
  $tw.utils.each(keys, function(key) {
    results.push(deep(item, key.trim(), []));
  });
  // Fuse.js expects getFn()s to return lists, erm, arrays, instead of
  // scalars.
  return [results.join(" ")];
};

})();
