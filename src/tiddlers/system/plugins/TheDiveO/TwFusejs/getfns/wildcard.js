/*\
created: 20180813165310714
title: $:/plugins/TheDiveO/TwFusejs/getfns/wildcard.js
type: application/javascript
modified: 20180813165403648
tags:
module-type: library
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var deepValues = function(object, path, result) {
  if (!path) {
    // Reached the leaf, at least according to the path specified.
    result.push(object);
  } else {
    var field;
    var path;
    var dot = path.indexOf(".");
    if (dot >= 0) {
      field = path.slice(0, dot);
      path = path.slice(dot + 1);
    } else {
      field = path;
      path = null;
    }
    if (field === "*" && !path) {
      // Wildcard on a path leaf!
      $tw.utils.each(object, function(value, field) {
        console.log("wildcarded field:", field);
    		result.push(value.toString());
    	});
    } else {
      var value = object[field];
      if (value !== undefined && value !== null) {
        if (!path && (typeof value === "string" || typeof value === "number")) {
          // We've reached the leaf, and it is a scalar value (so no objects)...
          result.push(value.toString());
        } else if ($tw.utils.isArray(value)) {
          // We've got an array, so we continue to resolve, but this time the
          // path remaining on all array elements...
          for (var idx = 0, len = value.length; idx < len; idx += 1) {
            deepValues(value[idx], path, result);
          }
        } else if (path) {
          // This is an object, so try to resolve further if there is a path
          // still left...
          deepValues(value, path, result);
        }
      }
    }
  }
  return result;
};

/* Export a Fuse.js getFn function that allows to use the "*" wildcard referring
 * to all object attributes (on this level). Otherwise, it works like the
 * Fuse.js-builtin deepValue getFn.
 */
exports.getFn = function (item, splitkey) {
  var result = deepValues(item, key.join("."), []);
	return result;
};

})();
