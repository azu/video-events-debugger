// MIT © 2017 azu
import { VideoEventObserver } from "./VideoEventObserver";

export function isVideoElement(v: any): v is HTMLVideoElement {
    if (v === undefined || v === null) {
        throw new Error(`This is null or undefined ${v}`);
    }
    if (v.nodeType === 1) {
        const node = v as HTMLElement;
        if (node.nodeName.toLowerCase() == "video") {
            return true;
        }
    }
    return false;
}

export function inject(videoSelector: string) {
    const element = document.querySelector(videoSelector);
    if (isVideoElement(element)) {
        const observer = new VideoEventObserver(element);
        observer.onChange((key, event) => {
            console.groupCollapsed(key);
            console.log(event);
            console.groupEnd(key);
        });
        observer.start();
        return;
    }
    throw new Error(`This is not video element. selector${videoSelector}`);
}
