/*\
created: 20200718200145986
title: $:/plugins/TheDiveO/TwFusejs/widgets/setjson.js
type: application/javascript
modified: 20200718200224457
tags: 
module-type: widget
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

/* Creates a new <$jsdondata> widget. */
var SetJsonWidget = function(parseTreeNode, options) {
    this.initialise(parseTreeNode, options);
};
  
/* "Inherits" from the Widget base "class" in order to get all
 * the basic widget functionality.
 */
SetJsonWidget.prototype = new Widget();

/* Renders this widget into the DOM. */
SetJsonWidget.prototype.render = function(parent, nextSibling) {
    this.parentDomNode = parent;
    this.computeAttributes();
    this.execute();
    this.renderChildren(parent, nextSibling);
};

/* Computes the internal state of this widget. */
SetJsonWidget.prototype.execute = function() {
    this.jsonName = this.getAttribute("name")
    this.jsonData = this.getAttribute("json");
    this.jsonField = this.getAttribute("field");
    this.jsonDefault = this.getAttribute("default");
    this.jsonType = this.getAttribute("type");
    this.setVariable(this.jsonName, this.getValue(), this.parseTreeNode.params, !!this.parseTreeNode.isMacroDefinition);
    this.makeChildWidgets();
};  

/* Calculates the resulting JSON data. */
SetJsonWidget.prototype.getValue = function() {
    var jsondata = this.jsonData || "";
    if (!this.jsonField) {
        return jsondata;
    }
    var valuetype = this.jsonType || "string";
    var defaultvalue = this.jsonDefault;
    var fieldname = this.jsonField;
    var data;
    try {
        data = JSON.parse(jsondata);
    } catch (e) {
        return jsondata;
    }
    if (!(this.jsonField in data)) {
        switch (valuetype) {
            case "bool":
                data[fieldname] = defaultvalue === "true" || defaultvalue === "True";
                break;
            case "number":
                data[fieldname] = Number.parseFloat(defaultvalue);
                break;
            case "string":
            default:
                data[fieldname] = defaultvalue;
        }
    }
    return JSON.stringify(data, null, $tw.config.preferences.jsonSpaces);
};

/* Selectively refreshes this widget if needed and returns
 * true if either this widget itself or one of its children
 * needs to be re-rendered.
 */
SetJsonWidget.prototype.refresh = function(changedTiddlers) {
    var changedAttributes = this.computeAttributes();
    if (changedAttributes.name || changedAttributes.json || changedAttributes.field
        || changedAttributes.default || changedAttributes.type) {
        this.refreshSelf();
        return true;
    }
    return this.refreshChildren(changedTiddlers);
};

/* Finally exports the widget constructor. */
exports.setjson = SetJsonWidget;

})();