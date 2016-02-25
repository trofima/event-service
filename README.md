Event Service
===

Events service which provide event handling in an Object scope

It's written in typescript, compiled to es5 and [minified](app/target/eventService.min.js).
WARNING: es6 [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) used. See compatibility table or use shim.

---

Methods
=======

**constructor**

Creates new EventService instance.

    var eventService = new EventService();

---

**.on(type, action[, context])**

`type` (string) - event name to listen to
`action` (Function) - action to be called
`context` (Object) - context for calling the action  

Binds action to the event. You can provide several `type`s divided by spaces or commas.

    eventService.on('hello', (e) => console.log('Hello ', e.data.to));

    eventService.on('hello, hi, goodMorning', (e) => console.log('Hi!!!), this);

---

**.once(type, action[, context])**

`type` (string) - event name to listen to
`action` (Function) - action to be called
`context` (Object) - context for calling the action  

Binds action to the event only *once*. You can provide several `type`s divided by spaces or commas.

    eventService.once('hello', (e) => console.log('Hello ', e.data.to));

    eventService.once('hello, hi, goodMorning', (e) => console.log('Hi!!!), this);

---

**.trigger(type[, data[, rawEvent]])**

`type` (string) - event name to be dispatched
`data` (Object) - event data
`rawEvent` (*) - RAW event  

Triggers an event on *this* object. You can provide several `type`s divided by spaces or commas.

    eventService.trigger('saidHello', { to: 'John' }, nativeClickEvent);
    eventService.trigger('hello, hi, goodMorning', { to: 'John' });

---

**.off([type[, action]])**

`type` (string) - event name to stop listen to
`action` (Function) - action to be removed from listening stack

 Removes actions. You can provide several types divided by spaces or commas. If action isn't provided all actions will be removed for the event type. If `type` isn't provided *all* actions will be removed for the entire object.

    eventService.off('hello, hi', this.sayHello); // removes "this.sayHello" action for the "hello" event
    eventService.off('hello'); // removes all actions for the "hello" event
    eventService.off(); // removes all actions for the eventService instance

---
