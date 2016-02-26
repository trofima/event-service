export interface Action {
    (event: ServiceEvent): any;
}
export declare class ServiceEvent {
    type: string;
    data: any;
    rawEvent: any;
    constructor(type: string, data?: any, rawEvent?: any);
}
export declare class EventService {
    constructor();
    on(typeString: string, action: Action, context?: any, shouldCallOnce?: Boolean): void;
    once(typeString: string, action: Action, context?: any): void;
    trigger(typeString: string, data?: any, rawEvent?: any): void;
    off(typeString: string, action?: Action): void;
    protected actions: Map<string, Action[]>;
    private decorateAction({action, context, shouldCallOnce, typeString});
    private createOneTimeAction(action, typeString);
    private bind(type, action);
    private triggerOne(type, e);
    private fire(type, e);
    private offOne(type, action?);
    private unbind(type, action?);
    private getSplitter();
    private warnUregistered(type);
}
