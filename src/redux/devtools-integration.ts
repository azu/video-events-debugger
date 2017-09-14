// MIT © 2017 azu
"use strict";
import { RemoteReduxDevToolsOptions } from "remote-redux-devtools";

export interface DevTools {
    init(state: any): void;

    send(..._: any[]): void;

    error(error: Error): void;

    subscribe(handler: (message: {}) => void): () => void;

    disconnect(): void;
}

export interface DevToolsExtension {
    connect(options: {}): DevTools;
}

// extends
export interface DevToolsWindow extends Window {
    __REDUX_DEVTOOLS_EXTENSION__: DevToolsExtension;
}

/**
 * @type {boolean}
 */
export const isIntegratedDevTools = (window: Window): window is DevToolsWindow => {
    const devWindow = window as DevToolsWindow;
    if (typeof devWindow !== "undefined" && devWindow.__REDUX_DEVTOOLS_EXTENSION__) {
        return true;
    }
    return false;
};
const DefaultDevToolsOptions = {
    features: {
        pause: true, // start/pause recording of dispatched actions
        lock: true, // lock/unlock dispatching actions and side effects
        persist: false, // persist states on page reloading
        export: true, // export history of actions in a file
        import: "video-events-debugger-log", // import history of actions from a file
        jump: false, // jump back and forth (time travelling)
        skip: false, // skip (cancel) actions
        reorder: false, // drag and drop actions in the history list
        dispatch: false, // dispatch custom actions or action creators
        test: true // generate tests for the selected actions
    }
};

export class VideoEventsDevTool {
    devTools?: DevTools;

    constructor() {}

    /**
     * connect to devTools
     * @param {Object} options redux-devtools-extension options
     * @see http://extension.remotedev.io/docs/API/Arguments.html
     */
    connect(options: {} = DefaultDevToolsOptions) {
        if (isIntegratedDevTools(window)) {
            this.devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect(options);
        } else {
            throw new Error("Fail to connect redux devTools");
        }
    }

    /**
     * initialize state
     * @param {*} state
     */
    init(state: any) {
        if (this.devTools) {
            this.devTools.init(state);
        }
    }

    /**
     * register subscribe handler to devTools
     * @param {function(message: Object)} handler
     * @returns {function()} unsubscribe function
     */
    subscribe(handler: (message: {}) => void): () => void {
        if (!this.devTools) {
            return () => {};
        }
        return this.devTools.subscribe(handler);
    }

    /**
     * @param {*} action
     * @param {*} state
     * @see http://extension.remotedev.io/docs/API/Methods.html
     */
    send(action: object, state?: any) {
        if (this.devTools) {
            this.devTools.send(action, state);
        }
    }

    /**
     * @param {*} message
     * @see http://extension.remotedev.io/docs/API/Methods.html
     */
    error(message: any) {
        if (this.devTools) {
            this.devTools.error(message);
        }
    }

    /**
     * disconnect to devTools
     */
    disconnect() {
        if (this.devTools) {
            this.devTools.disconnect();
        }
    }
}
