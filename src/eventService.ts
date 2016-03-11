'use strict';

export interface Action {
    (event:ServiceEvent): any;
}

export class ServiceEvent {
    constructor(public type:string, public data?:any, public rawEvent?:any) {}
}

export class EventService {
    constructor() {
        this.actions = new Map();
    }

    on(typeString:string, action:Action, context:any = null, shouldCallOnce:Boolean = false) {
        let decoratedAction = this.decorateAction({action, context, shouldCallOnce, typeString});
        let types = typeString.match(this.getSplitter());

        types.forEach((type) => this.bind(type, decoratedAction));
    }

    once(typeString:string, action:Action, context:any = null) {
        this.on(typeString, action, context, true);
    }

    trigger(typeString:string, data?:any, rawEvent?:any) {
        let types = typeString.match(this.getSplitter());

        types.forEach((type) => this.triggerOne(type, new ServiceEvent(type, data, rawEvent)));
        this.triggerOne('all', new ServiceEvent('all', data, rawEvent));
    }

    off(typeString:string, action?:Action) {
        let types = typeString.match(this.getSplitter());

        types.forEach((type) => this.offOne(type, action));
    }

    protected actions:Map<string, Action[]>;

    private decorateAction({action, context, shouldCallOnce, typeString}):Action {
        let boundAction = context ? action.bind(context) : action;

        if (shouldCallOnce)
            return this.createOneTimeAction(boundAction, typeString);

        return boundAction;
    }

    private createOneTimeAction(action:Action, typeString:string):Action {
        const decoratedFunction = (event) => {
            action(event);
            this.off(typeString, decoratedFunction);
        };

        return decoratedFunction;
    }

    private bind(type:string, action:Action) {
        let actionList = this.actions.has(type) ? this.actions.get(type) : [];

        this.actions.set(type, [...actionList, action]);
    }

    private triggerOne(type:string, e:ServiceEvent) {
        if (this.actions.has(type))
            this.fire(type, e);
        else if (type !== 'all')
            this.warnUregistered(type);
    }

    private fire(type:string, e:ServiceEvent) {
        this.actions.get(type)
            .forEach((action) => action(e));
    }

    private offOne(type:string, action?:Action) {
        if (this.actions.has(type))
            this.unbind(type, action);
        else
            this.warnUregistered(type);
    }

    private unbind(type:string, action?:Action) {
        if (action) {
            let actions = this.actions.get(type);

            this.actions.set(type, actions.filter((candidateAction) => candidateAction !== action));
        } else
            this.actions.delete(type);
    }

    private getSplitter():RegExp {
        return /[^,\s]+/g;
    }

    private warnUregistered(type:string) {
        console.warn(`There is no event of type "${type}" registered`);
    }
}