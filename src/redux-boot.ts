// MIT © 2017 azu
import { isVideoElement } from "./boot";
import { VideoEventObserver } from "./VideoEventObserver";
import { isIntegratedDevTools, VideoEventsDevTool } from "./redux/devtools-integration";

const element = document.querySelector("video");
if (isVideoElement(element)) {
    if (!isIntegratedDevTools(window)) {
        throw new Error("Should install Redux DevTools Extension.");
    }
    const observer = new VideoEventObserver(element);
    const devTools = new VideoEventsDevTool();
    observer.onChange((key, event) => {
        const action = Object.assign(
            {},
            {
                type: key
            },
            event
        );
        let mediaProperties = observer.getMediaProperties();
        devTools.send(action, mediaProperties);
    });
    observer.start();
    devTools.connect();
    devTools.init(observer.getMediaProperties());
}
