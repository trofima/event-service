Events
===

Events service which provide event handling in an Object scope

---

Methods
=======

**Constructor**

Creates new Events instance.

    var events = new Events();

---

**.on(type, callback[, context])**

`type` (string) - event name to listen to  
`callback` (Function) - callback to be called  
`context` (Object) - context for calling the callback  

Binds callback to the event. You can provide several `type`s divided by spaces or commas.

    events.on('hello', function(e){
        console.log('Hello ', e.data.to);
    });

    events.on('hello, hi, goodMorning', this._sayHello, this);

---

**.once(type, callback[, context])**

`type` (string) - event name to listen to  
`callback` (Function) - callback to be called  
`context` (Object) - context for calling the callback  

Binds callback to the event only *once*. You can provide several `type`s divided by spaces or commas.

    events.once('hello', function(e){
        console.log('Hello ', e.data.to);
    });

    events.once('hello, hi, goodMorning', this._sayHello, this);

---

**.trigger(type[, data[, rawEvent]])**

`type` (string) - event name to be dispatched  
`data` (Object) - event data  
`rawEvent` (*) - RAW event  

Triggers an event in *this* window. You can provide several `type`s divided by spaces or commas.

    events.trigger('saidHello', { to: 'John' });
    events.trigger('hello, hi, goodMorning', { to: 'John' });

---

**.off([type[, callback]])**

`type` (string) - event name to stop listen to
`callback` (Function) - callback to be removed from listening stack

 Removes event listeners. You can provide several types divided by spaces or commas. If `type` isn't provided *all* callbacks will be removed.

    events.off('hello');
    events.off('hello, hi', this._sayHello);
    events.off();

---
