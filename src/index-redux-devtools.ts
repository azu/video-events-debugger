// MIT © 2017 azu
import { isVideoElement } from "./boot";
import { VideoEventObserver } from "./observer/VideoEventObserver";
import { isIntegratedDevTools, VideoEventsDevTool } from "./redux/devtools-integration";

const inputSelector = prompt("Please input CSS selector for video element", "video");
if (inputSelector == null) {
    throw new Error("selector is not defined");
}
const element = document.querySelector(inputSelector);
if (!isVideoElement(element)) {
    throw new Error(`This is not video element. selector${inputSelector}`);
} else {
    if (!isIntegratedDevTools(window)) {
        throw new Error("Should install Redux DevTools Extension.");
    }
    const observer = new VideoEventObserver(element);
    const devTools = new VideoEventsDevTool();
    observer.onChange((key: string, event: Event) => {
        const action = {
            type: key,
            ...event
        };
        devTools.send(action, observer.getMediaProperties());
    });
    observer.start();
    devTools.connect();
    devTools.init(observer.getMediaProperties());
}
