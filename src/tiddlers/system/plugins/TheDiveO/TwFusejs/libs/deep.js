/*\
created: 20180815161626210
title: $:/plugins/TheDiveO/TwFusejs/libs/deep.js
type: application/javascript
modified: 20180815161710665
tags:
module-type: library
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/* Utility to fetch the value of a named (multi-level) object element/attribute.
 *
 * The parameters are as follows:
 *
 * object: the object from which the values should be taken.
 * path: the element/attribute path, in the form of "a1", "a1.a2", et cetera.
 * result: result array to push requested values onto.
 * leafhook: optional hook function called on leaves.
 */
function deepValues(object, path, result, leafhook) {
  if (!path) {
    // Reached the leaf, at least according to the path specified. So we
    // can add the "object" as the final value.
    result.push(object);
  } else {
    // There is still some path left, bite off the first element from the
    // remaining path, and work on that...
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
    // If there is no path left, give an optional leafhook a chance
    // to get into business; if a leafhook returns true, then we don't
    // need to care anymore about this field and its value.
    if (!path && leafhook) {
      if (leafhook(object, field, result)) {
        return;
      }
    }
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
      } else {
        $tw.utils.each(value, function(value) {
          result.push(value.toString());
        })
      }
    }
  }
  return result;
};

exports.deep = deepValues;

})();
