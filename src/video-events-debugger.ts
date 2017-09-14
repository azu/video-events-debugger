import { isVideoElement } from "./boot";
import { VideoEventObserver } from "./observer/VideoEventObserver";
import { isIntegratedDevTools, VideoEventsDevTool } from "./redux/devtools-integration";
import * as Hls from "hls.js";
import { HlsJsEventObserver } from "./observer/HlsJsEventObserver";

export function injectHlsJsDebugger(hls: Hls) {
    if (!isIntegratedDevTools(window)) {
        throw new Error("Should install Redux DevTools Extension.");
    }
    const observer = new HlsJsEventObserver(hls);
    const devTools = new VideoEventsDevTool();
    observer.onChange((key: string, data: any) => {
        const action = Object.assign(
            {},
            {
                type: key
            },
            data
        );
        devTools.send(action, observer.getRecord());
    });
    observer.start();
    devTools.connect();
    // devTools.init(observer.getRecord());
    return devTools;
}

export function injectConsole(element: HTMLVideoElement) {
    if (!isVideoElement(element)) {
        throw new Error(`This is not video element.`);
    } else {
        const observer = new VideoEventObserver(element);
        observer.onChange((key: string, event: Event) => {
            const action = Object.assign(
                {},
                {
                    type: key
                },
                event
            );
            console.groupCollapsed(key);
            console.log(observer.getMediaProperties());
            console.groupEnd();
        });
        observer.start();
    }
}

export { isIntegratedDevTools };

export function injectDevTools(element: HTMLVideoElement) {
    if (!isVideoElement(element)) {
        throw new Error(`This is not video element.`);
    } else {
        if (!isIntegratedDevTools(window)) {
            throw new Error("Should install Redux DevTools Extension.");
        }
        const observer = new VideoEventObserver(element);
        const devTools = new VideoEventsDevTool();
        observer.onChange((key: string, event: Event) => {
            const action = Object.assign(
                {},
                {
                    type: key
                },
                event
            );
            devTools.send(action, observer.getMediaProperties());
        });
        observer.start();
        devTools.connect();
        devTools.init(observer.getMediaProperties());
    }
}
