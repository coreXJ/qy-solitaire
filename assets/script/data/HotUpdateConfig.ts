
import { _decorator, native } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HotUpdateConfig')
export class HotUpdateConfig {
    public static hotUpateUrl: string = '';

    public static get localResPath() {
        return ((native.fileUtils ? native.fileUtils.getWritablePath() : '/') + 'remoteAssets/')
    }

    //读取project.manifest
    public static getPrjectManifest(bundle: string) {
        let path;
        if (bundle == "res") {
            path = "project.manifest"
        }
        else {
            path = `assets/${bundle}/project.manifest`
        }
        let cachedPath = `${HotUpdateConfig.localResPath}${path}`;
        if (native.fileUtils.isFileExist(cachedPath)) {
            console.log("本地缓存资源路径 " + cachedPath)
            return native.fileUtils.getStringFromFile(cachedPath);
        }
        else {
            let packagePath = native.fileUtils.getDefaultResourceRootPath() + path
            console.log("包体内资源路径 " + packagePath)
            if (native.fileUtils.isFileExist(packagePath)) {
                return native.fileUtils.getStringFromFile(packagePath);
            } else {
                return undefined;
            }
        }
    }
}
