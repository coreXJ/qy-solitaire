import { game } from "cc";


export default class NativeHelper {

    private static _isNative: boolean = false;
    private static _isIOS: boolean = false;
    private static _isAndroid: boolean = false;

    public static restart() {
        if (this._isNative) {
            game.restart();
        } else {
            location.reload();
        }
    }

}