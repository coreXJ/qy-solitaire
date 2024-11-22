

class NativeHelper {
  public static getInstance() {
    return NativeHelper._instance;
  }

  private static _instance: NativeHelper = new NativeHelper();

  private _isNative: boolean = false;
  private _isIOS: boolean = false;
  private _isAndroid: boolean = false;
}