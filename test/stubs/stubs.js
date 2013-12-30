var emptyFunction = function(){};


// chrome stubs
chrome = {
    tabs: {
        executeScript: emptyFunction,
    },
    runtime: {
        onMessage: {
            addListener: emptyFunction
        }
    },
    extension: {
        getBackgroundPage: function(){
            return {
                storage: {}
            };
        }
    },
    storage: {
        sync: {
            set: emptyFunction,
            get: emptyFunction
        }
    }
};


// jquery stubs
var $, jQuery;

(function () {
    "use strict";

    var emptyFunction = function () {
    };

    var JQuery = function () {
    };

    JQuery.prototype = {
        onEventMap: {},
        ready: emptyFunction,
        show: emptyFunction,
        scroll: emptyFunction,
        scrollTop: emptyFunction,
        val: emptyFunction,
        each: emptyFunction,
        attr: emptyFunction,
        done: emptyFunction,
        ajax: function(){
            return {
                done: emptyFunction
            };
        },
        text: function(){
            return {
                attr: emptyFunction
            };
        },
        html: emptyFunction,
        find: function(){
            return new JQuery();
        },
        on: function (eventKey, eventFunction) {
            JQuery.prototype.onEventMap[eventKey] = eventFunction;

        },
        fireOnEvent: function (key, eventObject) {
            JQuery.prototype.onEventMap[key](eventObject);
        },
        trigger: function(eventKey){
            JQuery.prototype.onEventMap[eventKey]();
        },
        fn: {},
        addedClasses: [],
        addClass: function (className) {
            JQuery.prototype.addedClasses.push(className);
        },
        data: function() {
            return {

            }
        },
        scrollLeft: function() {
        },
        width: function() {
        }
    };
    jQuery = new JQuery();

    $ = function () {
        return jQuery;
    };

})();

$.getJSON = emptyFunction;