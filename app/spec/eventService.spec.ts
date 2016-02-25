'use strict';
import {EventService, ServiceEvent} from './../src/eventService';

class EventServiceTester extends EventService {
    getActionsByType(type) {
        return this.actions.get(type);
    }

    getActionByIndex(type, index) {
        return this.actions.get(type)[index];
    }

    getActions() {
        return this.actions;
    }
}

describe('Event Service.', function() {
    beforeEach(function() {
        this.eventServiceTester = new EventServiceTester();
    });

    describe('constructor:', function() {
        it('should set "actions" to an empty Map', function() {
            const eventServiceTester = new EventServiceTester();

            expect(eventServiceTester.getActions() instanceof Map).toBe(true);
        });
    });

    describe('on:', function() {
        it('should add action to event type', function() {
            const action = jasmine.createSpy('action');

            this.eventServiceTester.on('someEvent', action);
            expect(this.eventServiceTester.getActionByIndex('someEvent', 0)).toBe(action);

            this.eventServiceTester.on('otherEvent', action);
            expect(this.eventServiceTester.getActionByIndex('otherEvent', 0)).toBe(action);
        });

        it('should add actions to the list of the same event type', function() {
            const someaction = jasmine.createSpy('someaction');
            const otheraction = jasmine.createSpy('otheraction');

            this.eventServiceTester.on('event', someaction);
            expect(this.eventServiceTester.getActionByIndex('event', 0)).toBe(someaction);

            this.eventServiceTester.on('event', otheraction);
            expect(this.eventServiceTester.getActionByIndex('event', 1)).toBe(otheraction);
        });

        it('should add the same action to a multiple events', function() {
            const action = jasmine.createSpy('action');

            this.eventServiceTester.on('someEvent, otherEvent', action);

            expect(this.eventServiceTester.getActionByIndex('someEvent', 0)).toBe(action);
            expect(this.eventServiceTester.getActionByIndex('otherEvent', 0)).toBe(action);
        });

        it('should set the context of an action', function() {
            const action = jasmine.createSpy('action');
            const boundaction = jasmine.createSpy('boundaction');
            const context = {};

            spyOn(action, 'bind').and.returnValue(boundaction);

            this.eventServiceTester.on('event', action, context);

            expect(this.eventServiceTester.getActionByIndex('event', 0)).toBe(boundaction);
        });

        it('should clear event action after invocation if "shouldCallOnce" flag is set', function() {
            const action = function(){};

            this.eventServiceTester.on('event', action, null, true);
            this.eventServiceTester.trigger('event');

            expect(this.eventServiceTester.getActionByIndex('event', 0)).toBe(undefined);
        });
    });

    describe('once', function() {
        it('should clear event action after invocation', function() {
            const action = function(){};

            this.eventServiceTester.on('event', action, null, true);
            this.eventServiceTester.trigger('event');

            expect(this.eventServiceTester.getActionByIndex('event', 0)).toBe(undefined);
        });
    });

    describe('trigger:', function() {
        it('should fire the action for event', function() {
            const action = jasmine.createSpy('action');
            const eventData = {};
            const rawEvent = {};

            this.eventServiceTester.on('event', action);

            this.eventServiceTester.trigger('event', eventData, rawEvent);

            expect(action).toHaveBeenCalledWith(new ServiceEvent('event', eventData, rawEvent));
        });

        it('should fire all actions for event', function() {
            const actionOne = jasmine.createSpy('actionOne');
            const actionTwo = jasmine.createSpy('actionTwo');
            const eventData = {};

            this.eventServiceTester.on('event', actionOne);
            this.eventServiceTester.on('event', actionTwo);

            this.eventServiceTester.trigger('event', eventData);

            expect(actionOne).toHaveBeenCalledWith(new ServiceEvent('event', eventData));
            expect(actionTwo).toHaveBeenCalledWith(new ServiceEvent('event', eventData));
        });

        it('should not fail if event does not exist', function() {
            expect(this.eventServiceTester.trigger.bind(this.eventServiceTester, 'event')).not.toThrow();
        });

        it('should be able to fire actions for mutiple event types', function() {
            const actionOne = jasmine.createSpy('actionOne');
            const actionTwo = jasmine.createSpy('actionTwo');

            this.eventServiceTester.on('eventOne', actionOne);
            this.eventServiceTester.on('eventTwo', actionTwo);

            this.eventServiceTester.trigger('eventOne, eventTwo');

            expect(actionOne).toHaveBeenCalled();
            expect(actionTwo).toHaveBeenCalled();
        });

        it('should fire "all" event action in any case', function() {
            const action = jasmine.createSpy('action');

            this.eventServiceTester.on('all', action);
            this.eventServiceTester.on('event', function() {});

            this.eventServiceTester.trigger('event');

            expect(action).toHaveBeenCalledWith(new ServiceEvent('all'));
        });
    });
    
    describe('off', function() {
        it('should unbind action from event', function() {
            const action = jasmine.createSpy('action');

            this.eventServiceTester.on('event', action);

            this.eventServiceTester.off('event', action);

            expect(this.eventServiceTester.getActionByIndex('event', 0)).toBe(undefined);
        });
        
        it('should not fail if provided event does not exist', function() {
            const action = jasmine.createSpy('action');

            this.eventServiceTester.on('event', action);

            expect(this.eventServiceTester.off.bind(this.eventServiceTester, 'otherEvent', action)).not.toThrow();
        });

        it('should unbind action from multiple events', function() {
            const action = jasmine.createSpy('action');

            this.eventServiceTester.on('event, anotherEvent', action);

            this.eventServiceTester.off('event, anotherEvent', action);

            expect(this.eventServiceTester.getActionByIndex('event', 0)).toBe(undefined);
            expect(this.eventServiceTester.getActionByIndex('anotherEvent', 0)).toBe(undefined);
        });

        it('should unbind all actions from event', function() {
            this.eventServiceTester.on('event', function(){});
            this.eventServiceTester.on('event', function(){});

            this.eventServiceTester.off('event');

            expect(this.eventServiceTester.getActionsByType('event')).toBe(undefined);
        });
    });
});