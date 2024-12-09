import { game, native, sys } from "cc";


export default class NativeHelper {

    private static _adjustAdid = '';
    public static get adjustAdid() {
        return this._adjustAdid;
    }
    private static _deviceId = '';
    public static get deviceId() {
        return this._deviceId;
    }

    private static isNative: boolean = sys.isNative;
    private static isIOS: boolean = sys.Platform.IOS === sys.platform;
    private static isAndroid: boolean = sys.Platform.ANDROID === sys.platform;

    public static init() {
        console.log('NativeHelper.init');
        this.emit('init');
        this.on(NativeEvent.respAdjustAdid, this.onAdjustAdid);
        this.on(NativeEvent.respDeviceId, this.onDeviceId);
        if (!this.isNative) {
            this._adjustAdid = 'testAdjustAdid';
            this._deviceId = 'testDeviceId';
        }
    }

    public static restart() {
        if (this.isNative) {
            game.restart();
        } else {
            location.reload();
        }
    }

    public static emit(event: string, arg?: string) {
        if (NativeHelper.isNative) {
            native.jsbBridgeWrapper.dispatchEventToNative(event,arg);
        }
    }

    public static on(event: string, callback: (arg: string) => void) {
        if (NativeHelper.isNative) {
            native.jsbBridgeWrapper.addNativeEventListener(event, callback)
        }
    }

    private static onAdjustAdid(adjustAdid: string) {
        console.log("onAdjustAdid", adjustAdid)
        NativeHelper._adjustAdid = adjustAdid||'';
    }

    private static onDeviceId(deviceId: string) {
        console.log("onDeviceId", deviceId)
        NativeHelper._deviceId = deviceId||'';
    }
}

export enum NativeEvent {
    respAdjustAdid = "respAdjustAdid",
    respDeviceId = "respDeviceId",
}