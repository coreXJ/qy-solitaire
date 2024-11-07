import { _decorator, native, sys, game, isValid } from 'cc';
import { HotUpdateConfig } from '../data/HotUpdateConfig';
import { ToastCtrl } from '../ui/UIToast/ToastCtrl';
const { ccclass, property } = _decorator;

export enum HotUpdateType {
    NeedUpdate,             //版本更新
    NoNeedUpdate,           //不需要更新
}

@ccclass('HotUpdateMgr')
export default class HotUpdateMgr {
    /**@description 远程所有版本信息 */
    private remoteVersions: { [key: string]: VERSIONS } = {};
    /**@description 所有下载项 */
    private updateHandlers: HotUpdateHandler[] = [];
    //最大的下载数量
    private maxDownloadCount = 3;
    public static readonly instance: HotUpdateMgr = new HotUpdateMgr(); 

    constructor() {
        if (sys.isNative)
            setInterval(this.update.bind(this), 200);
    }

    public setRemoteVersion(remoteVersions: { [key: string]: VERSIONS }) {
        this.remoteVersions = remoteVersions;
        console.log("remoteVersions: ", this.remoteVersions)
    }
   
    //获取远程版本号
    private getRemoteVersion(bundle: string) {
        if (this.remoteVersions[bundle]) {
            return this.remoteVersions[bundle].ver;
        }
        return "1.0.0";
    }
    
    //获取bundle的版本信息
    public getLocalVersion(bundle: string = 'res'): string {
        // if (NativeApi.isIOS && GameConfig.IsGM) { // 测试代码
        //     return '99.0';
        // }
        if (sys.isNative) {
            let content = HotUpdateConfig.getPrjectManifest(bundle);
            if (content) {
                let obj = JSON.parse(content);
                console.log("getLocalVersion %s ", obj.version)
                return obj.version;
            }
            return "1.0.0";
        }
        return "1.0.0";
    }

    //返回更新类型
    public checkUpdate(bundle: string): boolean {
        if (!sys.isNative) {
            return false;
        }
        var remoteVersion = this.getRemoteVersion(bundle);
        var localVersion = this.getLocalVersion(bundle);
        if (!remoteVersion)
            return false;
        var updateType = this.versionCompareHandle(localVersion, remoteVersion)
        return updateType == HotUpdateType.NeedUpdate;
    }

    //更新assetbundle
    public doDownload(bundle: string): HotUpdateHandler {
        if (!sys.isNative)
            return null
        if (!this.checkUpdate(bundle)) {
            console.log("当前已经是最新的版本！！！")
            return;
        }

        for (let i = 0; i < this.updateHandlers.length; i++) {
            if (this.updateHandlers[i].bundle == bundle) {
                if (this.updateHandlers[i].isUpdating > UpdateStatus.Updateing) {
                    this.updateHandlers.splice(i, 1);
                    break;
                }
                else {
                    return this.updateHandlers[i]
                }
            }
        }

        var remoteVersion = this.remoteVersions[bundle]
        var handler = new HotUpdateHandler(bundle, remoteVersion)
        this.updateHandlers.push(handler);
        return handler;
    }

    //检查版本号
    public checkMainVersion() {
        if (!sys.isNative)
            return;
        let pVersion = "1.0"
        let lVersion = "1.0"

        let localPath = `${HotUpdateConfig.localResPath}project.manifest`;
        console.log("CheckMainVersion  " + localPath)
        if (native.fileUtils.isFileExist(localPath)) {
            var content = native.fileUtils.getStringFromFile(localPath);
            if (content) {
                pVersion = JSON.parse(content).version;
            }
        }
        else {
            console.log("never hot update ,so continue")
            return;
        }
        //获取包体内版本号
        if (native.fileUtils.isFileExist(native.fileUtils.getDefaultResourceRootPath() + "project.manifest")) {
            var content = native.fileUtils.getStringFromFile(native.fileUtils.getDefaultResourceRootPath() + "project.manifest");
            if (content) {
                lVersion = JSON.parse(content).version;
            }
        }
        //如果包体里面的版本号要高于缓存的版本号 需要删掉缓存重启
        if (this.versionCompareHandle(pVersion, lVersion) == HotUpdateType.NeedUpdate) {
            this.RemoveLocalRes();
        }
    }

    //清理缓存
    public RemoveLocalRes() {
        console.log("删除本地所有版本文件")
        if (sys.isNative && native.fileUtils.isDirectoryExist(HotUpdateConfig.localResPath)) {
            native.fileUtils.removeDirectory(HotUpdateConfig.localResPath)
            setTimeout(game.restart, 1000);
        }
    }

    //版本比较
    private versionCompareHandle(versionA: string, versionB: string) {
        console.log("Version Compare: version A is " + versionA + ', version B is ' + versionB);
        var vA = versionA.split('.');
        var vB = versionB.split('.');
        let compare = (a: number, b: number) => {
            if (a === b)
                return 0;
            return a - b
        }
        for (var i = 0; i < vA.length; ++i) {
            var a = parseInt(vA[i]);
            var b = parseInt(vB[i] || '0');
            let type = compare(a, b)
            if (type < 0)
                return HotUpdateType.NeedUpdate;
            if (type > 0) {
                return HotUpdateType.NoNeedUpdate;
            }
        }
        return HotUpdateType.NoNeedUpdate;
    }
    
    /**
     * 请求热更配置后 检测服务下发模块是否需要静默
     * @param bundle 名称 
     * @returns 
     */
    public checkSilent(bundle:string) {
        let silent = false;
        if (this.remoteVersions[bundle]) {
            silent= this.remoteVersions[bundle].silent;
        }
        return silent;
    }

    private update() {
        if (!sys.isNative || this.updateHandlers.length <= 0)
            return;
        var count = 0;
        for (let i = this.updateHandlers.length - 1; i >= 0; i--) {
            var handler = this.updateHandlers[i]
            if (handler.isUpdating > UpdateStatus.Updateing) {
                this.updateHandlers.splice(i, 1)
            }
            else if (handler.isUpdating == UpdateStatus.Updateing) {
                count++
            }
        }
        if (count < this.maxDownloadCount && this.updateHandlers.length > count) {
            for (let i = 0; i < this.updateHandlers.length; i++) {
                var handler = this.updateHandlers[i]
                if (handler.isUpdating == UpdateStatus.None) {
                    handler.doUpdate();
                    if (++count > this.maxDownloadCount)
                        break;
                }
            }
        }
    }
}

interface VERSIONS {
    ver: string,
    addr: string,
    /**@description 是否静默更新 */
    silent?:boolean,
}

enum UpdateStatus {
    None,
    Updateing,
    Failed,
    Success,
}

abstract class DownloadHanler {
    onProgress: (precent: number, bundle: string) => void;
    onSuccess: (bundle: string) => void;
    onFailed: (msg: string, bundle: string) => void;
}

class HotUpdateHandler extends DownloadHanler {
    /**@description 将要更新的版本号 */
    version: string = "";
    /**@description 更新项bundle名 */
    public readonly bundle: string = "";
    /**@description 是否正在下载或正在检测更新 */
    isUpdating = UpdateStatus.None;
    /**@description 热更路径 */
    getHotUpdateUrl: string;
    /**@description 本地资源路径 */
    private _storagePath: string = '';
    /**@description 下载管理器，请不要从外面进行设置,管理器专用 */
    private _am: native.AssetsManager = null!;
    /**@description 最大重新更新次数 */
    private _maxRetry = 3;


    constructor(bundle: string, ver: VERSIONS) {
        super();
        this.version = ver.ver;
        this.getHotUpdateUrl = ver.addr;
        this.bundle = bundle;
        this._storagePath = HotUpdateConfig.localResPath + (this.bundle == "res" ? "" : `assets/${this.bundle}`);
    }

    /**@description 是否当前最后下载项 */
    private _last:boolean =false;
    public setLast(last:boolean){
        this._last = last;
    }
    public getLast(){
        return this._last;
    }

    checkCb(event: any) {
        let failed = false;
        let msg = '';
        console.log('HotUpdateMgr checkCb Code: ' + event.getEventCode());
        switch (event.getEventCode()) {
            case native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                failed = true;
                msg = 'No local manifest file found, hot update skipped.';
                console.log('HotUpdateMgr No local manifest file found, hot update skipped.');
                break;
            case native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case native.EventAssetsManager.ERROR_PARSE_MANIFEST:
                failed = true;
                msg = 'Fail to download manifest file, hot update skipped.';
                console.log('HotUpdateMgr Fail to download manifest file, hot update skipped.');
                break;
            case native.EventAssetsManager.ALREADY_UP_TO_DATE:
                console.log('HotUpdateMgr Already up to date with the latest remote version.');
                break;
            case native.EventAssetsManager.NEW_VERSION_FOUND:
                console.log('HotUpdateMgr New version found, please try to update. (' + Math.ceil(this._am.getTotalBytes() / 1024) + 'kb)');
                if (this._am.getTotalBytes() == 0) {
                    console.log('HotUpdateMgr HotUpdateMgr onDownloadSuccess');
                    this.onDownloadSuccess();    
                }
                else {
                    console.log('HotUpdateMgr HotUpdateMgr hotUpdate');
                    this.hotUpdate();
                }
                break;
            default:
                return;
        }
        if(failed){
            this.onDownloadFailed(msg);
        }
    }
    
    updateCb(event: any) {
        let failed = false;
        let msg = '';
        console.log('HotUpdateMgr updateCb Code: ' + event.getEventCode());
        switch (event.getEventCode()) {
            case native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                msg = 'No local manifest file found, hot update skipped.';
                console.log('HotUpdateMgr No local manifest file found, hot update skipped.');
                failed = true;
                break;
            case native.EventAssetsManager.UPDATE_PROGRESSION:
                // event.getPercent();
                // event.getPercentByFile()
                // event.getDownloadedFiles()
                // event.getTotalFiles()
                // event.getMessage()
                if (this.onProgress) {
                    var precent = event.getPercent()
                    precent = precent < 0 ? 0 : precent;
                    precent = precent > 1 ? 1 : precent;
                    this.onProgress(precent, this.bundle);
                }
                break;
            case native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case native.EventAssetsManager.ERROR_PARSE_MANIFEST:
                console.log('HotUpdateMgr Fail to download manifest file, hot update skipped.');
                msg = 'HotUpdateMgr Fail to download manifest file, hot update skipped.';
                failed = true;
                break;
            case native.EventAssetsManager.ALREADY_UP_TO_DATE:
                console.log('HotUpdateMgr Already up to date with the latest remote version.');
                break;
            case native.EventAssetsManager.UPDATE_FINISHED:
                console.log('HotUpdateMgr Update finished. ' + event.getMessage());
                this.onDownloadSuccess();
                break;
            case native.EventAssetsManager.UPDATE_FAILED:
                if (this._maxRetry > 0) {
                    this.retry();
                }
                else {
                    failed = true;
                }
                break;
            case native.EventAssetsManager.ERROR_UPDATING:
                console.log('HotUpdateMgr Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                break;
            case native.EventAssetsManager.ERROR_DECOMPRESS:
                console.log('HotUpdateMgr ' + event.getMessage());
                break;
            default:
                break;
        }

        if (failed) {
            this.onDownloadFailed();
        }
    }

    retry() {
        this._maxRetry--;
        this._am.downloadFailedAssets();
    }
    
    hotUpdate() {
        if (isValid(this._am) && this.isUpdating == UpdateStatus.Updateing) {
            if (this._am.getState() === native.AssetsManager.State.UNINITED) {
                return;
            }
            this._am.setEventCallback(this.updateCb.bind(this))
            this._am.update();
        }
        else {
            this.onDownloadFailed();
        }
    }

    onDownloadFailed(msg?: string){
        console.log("update assetbundle failed  " + this.bundle);
        this.isUpdating = UpdateStatus.Failed;
        this._am.setEventCallback(null!);
        this.onFailed && this.onFailed(msg, this.bundle);
    }

    onDownloadSuccess() {
        //下载完成,需要重新设置搜索路径，添加下载路径
        var searchPaths: string[] = native.fileUtils.getSearchPaths();
        var newPaths: string[] = this._am.getLocalManifest().getSearchPaths();
        console.log('HotUpdateMgr newpaths ' +  JSON.stringify(newPaths));
        newPaths.push(this._storagePath);
        Array.prototype.unshift.apply(searchPaths, newPaths);
        // This value will be retrieved and appended to the default search path during game startup,
        // please refer to samples/js-tests/main.js for detailed usage.
        // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
        //这里做一个搜索路径去重处理
        let obj: any = {};
        for (let i = 0; i < searchPaths.length; i++) {
            obj[searchPaths[i]] = true;
        }
        searchPaths = Object.keys(obj);
        sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
        console.log("HotUpdateMgr searchPaths ", searchPaths)
        native.fileUtils.setSearchPaths(searchPaths);
        this.isUpdating = UpdateStatus.Success;
        this._am.setEventCallback(null!);

        if (this.onProgress) {
            this.onProgress(1, this.bundle)
        }
        if (this.onSuccess) {
            this.onSuccess(this.bundle);
        }
        // restart game.
        // setTimeout(() => {
        //     game.restart();
        // }, 1000)
    }

    doUpdate() {
        if (this.loadLocalMainfest()) {
            this.isUpdating = UpdateStatus.Updateing;
            this._am.setEventCallback(this.checkCb.bind(this))
            this._am.checkUpdate();
        }
        else {
            this.onDownloadFailed();
        }
    }

    private verify(path: string, asset: native.ManifestAsset) {
        // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
        var compressed = asset.compressed;
        // Retrieve the correct md5 value.
        var expectedMD5 = asset.md5;
        // asset.path is relative path and path is absolute.
        var relativePath = asset.path;
        // The size of asset file, but this value could be absent.
        var size = asset.size;
        if (native.fileUtils.isFileExist(path) && native.fileUtils.getDataFromFile(path).byteLength === size) {
            console.log("HotUpdateMgr 资源更新校验成功 :  %s", asset.path)
            return true;
        }
        else {
            console.error("HotUpdateMgr 资源更新校验失败 : " + asset.path  + " asset downsize ===" + native.fileUtils.getDataFromFile(path).byteLength + " size ==   " + size)
            return false;
        }
    }

    private versionCompareHandle(versionA: string, versionB: string){
        var vA = versionA.split('.');
        var vB = versionB.split('.');
        for (var i = 0; i < vA.length; ++i) {
            var a = parseInt(vA[i]);
            var b = parseInt(vB[i] || '0');
            if (a === b) {
                continue;
            }
            else {
                return a - b;
            }
        }
        if (vB.length > vA.length) {
            return -1;
        }
        else {
            return 0;
        }
    }

    private loadLocalMainfest() {
        this._am = new native.AssetsManager("", this._storagePath);
        this._am.setVerifyCallback(this.verify.bind(this))
        this._am.setVersionCompareHandle(this.versionCompareHandle.bind(this));
        let content = JSON.stringify({
            "packageUrl": this.getHotUpdateUrl,
            "remoteManifestUrl": `${this.getHotUpdateUrl}project.manifest`,
            "remoteVersionUrl": `${this.getHotUpdateUrl}version.manifest`,
            "version": HotUpdateMgr.instance.getLocalVersion(this.bundle)
        });
        let localManifestContent = HotUpdateConfig.getPrjectManifest(this.bundle);
        console.log('##### Hotupdate localManifestContent ',localManifestContent);
        console.log('##### Hotupdate content ',content);
        if (!localManifestContent) {
            localManifestContent = content;
        }
        let localMainfest = new native.Manifest(localManifestContent, this._storagePath);
        this._am.loadLocalManifest(localMainfest, this._storagePath);

        let manifest = this._am.getLocalManifest();
        manifest.parseJSONString(content, this._storagePath)
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            console.log(`${this.bundle} Failed to load local manifest ....`);
            ToastCtrl.showToast('Failed to load local manifest ....');
            return false;
        }
        console.log(`${this.bundle} load local manifest success ....`);
        console.log("##### Hotupdate 获取远程资源配置文件地址=========111 : " + this._am.getLocalManifest().getPackageUrl());
        console.log("##### Hotupdate 获取远程资源配置文件地址=========222 : " + this._am.getLocalManifest().getManifestFileUrl());
        console.log("##### Hotupdate 获取远程资源配置文件地址=========333 : " + this._am.getLocalManifest().getVersionFileUrl() );
        console.log("##### Hotupdate 获取远程资源配置文件地址=========444 : " + this._am.getLocalManifest().getVersion());
        return true
    }
}



