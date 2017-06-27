// MIT © 2017 azu
import { EventEmitter } from "events";

export const VideoEventTypes = {
    loadstart: "loadstart",
    progress: "progress",
    suspend: "suspend",
    abort: "abort",
    error: "error",
    emptied: "emptied",
    stalled: "stalled",
    loadedmetadata: "loadedmetadata",
    loadeddata: "loadeddata",
    canplay: "canplay",
    canplaythrough: "canplaythrough",
    playing: "playing",
    waiting: "waiting",
    seeking: "seeking",
    seeked: "seeked",
    ended: "ended",
    durationchange: "durationchange",
    timeupdate: "timeupdate",
    play: "play",
    pause: "pause",
    ratechange: "ratechange",
    resize: "resize",
    volumechange: "volumechange",
};

export type VideoEventObserverRecord = {
    // Event : count
    [EventName in keyof typeof VideoEventTypes]: number;
    }

export class VideoEventObserver extends EventEmitter {
    private record: VideoEventObserverRecord;

    constructor(public videoElement: HTMLVideoElement) {
        super();
        this.record = this.createInitialRecord();
    }

    private createInitialRecord = (): VideoEventObserverRecord => {
        const initialCount = 0;
        const keys = Object.keys(VideoEventTypes);
        const result = {};
        keys.forEach(key => {
            result[key] = initialCount;
        });
        return result as VideoEventObserverRecord;
    };

    private onHandler = (keyName: string, event: Event) => {
        this.record[keyName]++;
        this.emit("__VideoEventObserver__CHANGE__", keyName, event);
    };

    onChange(handler: (key: string, event: Event) => void): () => void {
        this.on("__VideoEventObserver__CHANGE__", handler);
        return () => {
            this.removeListener("__VideoEventObserver__CHANGE__", handler);
        }
    }

    start() {
        Object.keys(VideoEventTypes).forEach(keyName => {
            const eventHandler = (event: Event) => {
                this.onHandler(keyName, event);
            };
            this.videoElement.addEventListener(keyName, eventHandler);
        });
    }

    stop() {
        // NOT Implement
    }

    clear() {
        this.record = this.createInitialRecord();
    }
}