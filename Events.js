/**
 * @fileOverview Events service
 *
 * */

var Events = function(){
    'use strict';

    /**
     * Events service
     * @class Events
     *
     * @constructor
     */
    var Events = function(){

    };

    var callbacksHolder = {};

    /**
     * Executes the callback
     *
     * @param {InternalEvent} e - internal event to be dispatched
     * @param {Array} callbacks - callbacks to fire
     * @private
     */
    var fire = function(e, callbacks){
        callbacks.forEach(function(item){
            var context = item.context;

            if (!context){
                item.callback(e);
            } else{
                item.callback.call(context, e);
            }

            if (item.once){
                offMethods.offCallback(item.type, item.callback);
            }
        }, this);
    };

    var offMethods = {
        /**
         * Removes all event listeners of the provided type
         *
         * @param {string} type - event name to stop listen to
         * @private
         */
        off: function(type){
            delete callbacksHolder[type];
        },

        /**
         * Removes certain event listener
         *
         * @param {string} type - event name to stop listen to (there can be several types provided that should be divided by spaces and commas)
         * @param {Function} callback - callback to be removed from listening stack
         * @private
         */
        offCallback: function(type, callback){
            var callbacks = callbacksHolder[type];

            if (callbacks){
                callbacks.some(function(clbk, i){
                    return !!(callback === clbk && callbacks.splice(i, 1));
                });
            }
        }
    };
    
    Events.prototype = {
        constructor: Events,

        on: function(type, callback, context, once){
            context = context || null;
            once = once || false;

            var typeArr,
                eName,
                splitRegExp = /[^,\s]+/g;

            while ((typeArr = splitRegExp.exec(type))){
                eName = typeArr[0];
                callbacksHolder[eName] = callbacksHolder[eName] || [];

                callbacksHolder[eName].push({
                    callback: callback,
                    context: context,
                    once: once
                });
            }
        },

        /**
         * Binds callback to the event only once
         *
         * @param {string} type - event name to listen to (there can be several types provided that should be divided by spaces and commas)
         * @param {Function} callback - callback to be called
         * @param {Object} [context] - context for calling the callback
         */
        once: function(type, callback, context){
            context = context || null;

            this.on(type, callback, context, true);
        },

        /**
         * Triggers an event in this window
         *
         * @param {string} type - event name to be dispatched (there can be several types provided that should be divided by spaces and commas)
         * @param {Object} [data] - event data
         * @param {*} [rawEvent] - RAW event
         */
        trigger: function(type, data, rawEvent){
            data = data || null;
            rawEvent = rawEvent || null;

            var typeArr,
                eName,
                callbacks,
                e,
                all,
                splitRegExp = /[^,\s]+/g; //it can't be saved in the PMS prototype because that property will became a link to the RegEx instance. And the RegEx instance has a lastIndex pointer which shouldn't be changing from different places, because this can result to an infinite loop.

            while ((typeArr = splitRegExp.exec(type))){
                eName = typeArr[0];
                all = callbacksHolder.all;
                callbacks = callbacksHolder[eName];
                e = new InternalEvent({
                    type: eName,
                    data: data,
                    rawEvent: rawEvent
                });

                if (callbacks){
                    if (all){
                        callbacks.push(all);
                    }

                    fire(e, callbacks);
                }
            }
        },

        /**
         * Removes event listeners
         * 
         * If not "type" provided removes ALL listeners
         *
         * @param {string} [type] - event name to stop listen to
         * @param {Function} [callback] - callback to be removed from listening stack
         */
        off: function(type, callback){
            type = type || null;
            callback = callback || null;

            var typeArr, 
                eName,
                offMethodName,
                splitRegExp = /[^,\s]+/g;

            if (!type){
                callbacksHolder = {};
            } else{
                if (callback){
                    offMethodName = 'offCallback';
                } else{
                    offMethodName = 'off';
                }

                while ((typeArr =splitRegExp.exec(type))){
                    eName = typeArr[0];

                    offMethods[offMethodName](eName, callback);
                }
            }
        }
    };

    /**
     * Internal Event
     * @class InternalEvent
     *
     * @param {Object} sets - event settings
     * @param {string} sets.type - event type
     * @param {*} sets.data - event data
     * @param {*} sets.rawEvent - RAW event object or data
     * @constructor
     */
    var InternalEvent = function(sets){
        this.type = sets.type;
        this.data = sets.data;
        this.rawEvent = sets.rawEvent;
    };
    
    return Events;
}(); 