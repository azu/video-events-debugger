// MIT © 2017 azu
"use strict";
import { EventEmitter } from "events";

/**
 * HTMLVideoElement event list
 * https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
 */
export const VideoEventTypes = {
    abort: "abort",
    canplay: "canplay",
    canplaythrough: "canplaythrough",
    durationchange: "durationchange",
    emptied: "emptied",
    encrypted: "encrypted",
    ended: "ended",
    error: "error",
    interruptbegin: "interruptbegin",
    interruptend: "interruptend",
    loadeddata: "loadeddata",
    loadedmetadata: "loadedmetadata",
    loadstart: "loadstart",
    mozaudioavailable: "mozaudioavailable",
    pause: "pause",
    play: "play",
    playing: "playing",
    progress: "progress",
    ratechange: "ratechange",
    seeked: "seeked",
    seeking: "seeking",
    stalled: "stalled",
    suspend: "suspend",
    timeupdate: "timeupdate",
    volumechange: "volumechange",
    waiting: "waiting",
    resize: "resize", // inspiered by https://www.w3.org/2010/05/video/mediaevents.html
    // ms-extension from lib.d.ts
    msneedkey: "msneedkey"
};

export const MediaProperties = {
    /**
     * Returns an AudioTrackList object with the audio tracks for a given video element.
     */
    audioTracks: "audioTracks",
    /**
     * Gets or sets a value that indicates whether to start playing the media automatically.
     */
    autoplay: "autoplay",
    /**
     * Gets a collection of buffered time ranges.
     */
    buffered: "buffered",
    /**
     * Gets or sets a flag that indicates whether the client provides a set of controls for the media (in case the developer does not include controls for the player).
     */
    controls: "controls",
    crossOrigin: "crossOrigin",
    /**
     * Gets the address or URL of the current media resource that is selected by IHTMLMediaElement.
     */
    currentSrc: "currentSrc",
    /**
     * Gets or sets the current playback position, in seconds.
     */
    currentTime: "currentTime",
    defaultMuted: "defaultMuted",
    /**
     * Gets or sets the default playback rate when the user is not using fast forward or reverse for a video or audio resource.
     */
    defaultPlaybackRate: "defaultPlaybackRate",
    /**
     * Returns the duration in seconds of the current media resource. A NaN value is returned if duration is not available, or Infinity if the media resource is streaming.
     */
    duration: "duration",
    /**
     * Gets information about whether the playback has ended or not.
     */
    ended: "ended",
    /**
     * Returns an object representing the current error state of the audio or video element.
     */
    error: "error",
    /**
     * Gets or sets a flag to specify whether playback should restart after it completes.
     */
    boolean: "boolean",
    mediaKeys: "mediaKeys",
    /**
     * Specifies the purpose of the audio or video media, such as background audio or alerts.
     */
    msAudioCategory: "msAudioCategory",
    /**
     * Specifies the output device id that the audio will be sent to.
     */
    msAudioDeviceType: "msAudioDeviceType",
    msGraphicsTrustStatus: "msGraphicsTrustStatus",
    /**
     * Gets the MSMediaKeys object, which is used for decrypting media data, that is associated with this media element.
     */
    msKeys: "msKeys",
    /**
     * Gets or sets whether the DLNA PlayTo device is available.
     */
    msPlayToDisabled: "msPlayToDisabled",
    /**
     * Gets or sets the path to the preferred media source. This enables the Play To target device to stream the media content, which can be DRM protected, from a different location, such as a cloud media server.
     */
    msPlayToPreferredSourceUri: "msPlayToPreferredSourceUri",
    /**
     * Gets or sets the primary DLNA PlayTo device.
     */
    msPlayToPrimary: "msPlayToPrimary",
    /**
     * Gets the source associated with the media element for use by the PlayToManager.
     */
    msPlayToSource: "msPlayToSource",
    /**
     * Specifies whether or not to enable low-latency playback on the media element.
     */
    msRealTime: "msRealTime",
    /**
     * Gets or sets a flag that indicates whether the audio (either audio or the audio track on video media) is muted.
     */
    muted: "muted",
    /**
     * Gets the current network activity for the element.
     */
    networkState: "networkState",
    /**
     * Gets a flag that specifies whether playback is paused.
     */
    paused: "paused",
    /**
     * Gets or sets the current rate of speed for the media resource to play. This speed is expressed as a multiple of the normal speed of the media resource.
     */
    number: "number",
    /**
     * Gets TimeRanges for the current media resource that has been played.
     */
    played: "played",
    /**
     * Gets or sets the current playback position, in seconds.
     */
    preload: "preload",
    readyState: "readyState",
    /**
     * Returns a TimeRanges object that represents the ranges of the current media resource that can be seeked.
     */
    seekable: "seekable",
    /**
     * Gets a flag that indicates whether the the client is currently moving to a new playback position in the media resource.
     */
    seeking: "seeking",
    /**
     * The address or URL of the a media resource that is to be considered.
     */
    src: "src",
    srcObject: "srcObject",
    textTracks: "textTracks",
    videoTracks: "videoTracks",
    /**
     * Gets or sets the volume level for audio portions of the media element.
     */
    volume: "volume",
    width: "width",
    height: "height",
    videoWidth: "videoWidth",
    videoHeight: "videoHeight",
    poster: "poster"
};

export type VideoEventObserverRecord = {
    [// Event : count
    EventName in keyof typeof VideoEventTypes]: number
};
export type VideoPropertyRecord = { [EventName in keyof typeof MediaProperties]: any };

export class VideoEventObserver extends EventEmitter {
    private record: VideoEventObserverRecord;

    constructor(public videoElement: HTMLVideoElement) {
        super();
        this.record = this.createInitialRecord();
    }

    private createInitialRecord = (): VideoEventObserverRecord => {
        const initialCount = 0;
        const keys = Object.keys(VideoEventTypes);
        const result: any = {};
        keys.forEach(key => {
            result[key] = initialCount;
        });
        return result as VideoEventObserverRecord;
    };

    private onHandler = (keyName: keyof typeof VideoEventTypes, event: Event) => {
        this.record[keyName]++;
        this.emit("__VideoEventObserver__CHANGE__", keyName, event);
    };

    private createMediaProperties = (video: HTMLVideoElement): VideoPropertyRecord => {
        const keys = Object.keys(MediaProperties);
        const result: any = {};
        keys.forEach((key: keyof typeof MediaProperties) => {
            try {
                result[key] = (video as any)[key];
            } catch (error) {
                result[key] = "<NOT ACCESSABLE>";
            }
        });
        return result as VideoPropertyRecord;
    };

    getRecord(): VideoEventObserverRecord {
        return this.record;
    }

    getMediaProperties(): VideoPropertyRecord {
        return this.createMediaProperties(this.videoElement);
    }

    onChange(handler: (key: string, event: Event) => void): () => void {
        this.on("__VideoEventObserver__CHANGE__", handler);
        return () => {
            this.removeListener("__VideoEventObserver__CHANGE__", handler);
        };
    }

    start() {
        Object.keys(VideoEventTypes).forEach((keyName: keyof typeof VideoEventTypes) => {
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
