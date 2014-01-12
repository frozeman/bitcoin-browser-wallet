var emptyFunction = function(){};


// chrome stubs
chrome = {
    tabs: {
        executeScript: emptyFunction,
    },
    runtime: {
        onMessage: {
            addListener: emptyFunction
        },
        sendMessage: function(){

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

// qr code
var QRCode = function(){};
QRCode.CorrectLevel = {
    H: ''
};


// jquery stubs
var $, jQueryStub;

(function () {
    "use strict";

    var emptyFunction = function () {
    };

    jQueryStub = function () {
    };

    jQueryStub.prototype = {
        onEventMap: {},
        ready: emptyFunction,
        show: emptyFunction,
        scroll: emptyFunction,
        scrollTop: emptyFunction,
        val: emptyFunction,
        each: emptyFunction,
        attr: emptyFunction,
        done: emptyFunction,
        hide: emptyFunction,
        focus: emptyFunction,
        off: emptyFunction,
        length: 0,
        text: function(){
            return {
                attr: emptyFunction
            };
        },
        html: emptyFunction,
        find: function(){
            return new jQueryStub();
        },
        on: function (eventKey, eventFunction) {
            jQueryStub.prototype.onEventMap[eventKey] = eventFunction;

        },
        fireOnEvent: function (key, eventObject) {
            jQueryStub.prototype.onEventMap[key](eventObject);
        },
        trigger: function(eventKey){
            jQueryStub.prototype.onEventMap[eventKey]();
        },
        fn: {},
        addedClasses: [],
        addClass: function (className) {
            jQueryStub.prototype.addedClasses.push(className);
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

    $ = function () {
        return new jQueryStub();
    };

    $.ajax = function(){
        return {
            done: emptyFunction
        };
    };
    $.getJSON = emptyFunction;

})();
