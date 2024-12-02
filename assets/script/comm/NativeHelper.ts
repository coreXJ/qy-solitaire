import { game, sys } from "cc";


export default class NativeHelper {

    private static isNative: boolean = sys.isNative;
    private static isIOS: boolean = sys.Platform.IOS === sys.platform;
    private static isAndroid: boolean = sys.Platform.ANDROID === sys.platform;

    constructor() {
        
    }

    public static restart() {
        if (this.isNative) {
            game.restart();
        } else {
            location.reload();
        }
    }

}