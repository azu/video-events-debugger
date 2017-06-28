// MIT © 2017 azu
import { isVideoElement } from "./boot";
import { VideoEventObserver } from "./VideoEventObserver";
import { isIntegratedDevTools, VideoEventsDevTool } from "./redux/devtools-integration";

const inputSelector = prompt("Please input CSS selector for video element", "video");
const element = document.querySelector(inputSelector);
if (!isVideoElement(element)) {
    throw new Error(`This is not video element. selector${inputSelector}`);
} else {
    if (!isIntegratedDevTools(window)) {
        throw new Error("Should install Redux DevTools Extension.");
    }
    const observer = new VideoEventObserver(element);
    const devTools = new VideoEventsDevTool();
    observer.onChange((key, event) => {
        devTools.send(event, observer.getMediaProperties());
    });
    observer.start();
    devTools.connect();
    devTools.init(observer.getMediaProperties());
}
