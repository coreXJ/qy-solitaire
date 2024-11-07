import { _decorator, assetManager, AssetManager, Asset, __private, Constructor, js, isValid, resources } from 'cc';
import { Prefab } from 'cc';
const { ccclass, property } = _decorator;

export type ProgressCallback =  (finished: number, total: number, item: AssetManager.RequestItem) => void;
export type CompleteCallback<T = any> = (err: Error | null, data: T | AssetManager.RequestItem[] | T[]) => void
export type IRemoteOptions = {[k: string]: any; ext?: string;} | null;
export type AssetType<T = Asset> = Constructor<T>;

interface ILoadResArgs<T extends Asset> {
    bundle?: string;
    dir?: string;
    paths: string | string[];
    type: AssetType<T> | null;
    onProgress: ProgressCallback | null;
    onComplete: CompleteCallback<T> | null;
}

@ccclass('ResMgr')
export class ResMgr {
    public static readonly instance: ResMgr = new ResMgr();
    //本地prefab预加载列表
    public PrefabList: Map<string, any> = new Map();
    private getPrefab(path: string) {
        if (typeof path != 'string')
            return;
        let prefabName = path.slice(path.lastIndexOf('/') + 1);
        return this.PrefabList.get(prefabName);
    }

    public parseLoadResArgs<T extends Asset>(
        paths: string | string[],
        type?: AssetType<T> | ProgressCallback | CompleteCallback | null,
        onProgress?: AssetType<T> | ProgressCallback | CompleteCallback | null,
        onComplete?: ProgressCallback | CompleteCallback | null
    ) {
        let pathsOut: any = paths;
        let typeOut: any = type;
        let onProgressOut: any = onProgress;
        let onCompleteOut: any = onComplete;
        if (onComplete === undefined) {
            const isValidType = js.isChildClassOf(type as AssetType, Asset);
            if (onProgress) {
                onCompleteOut = onProgress as CompleteCallback;
                if (isValidType) {
                    onProgressOut = null;
                }
            } else if (onProgress === undefined && !isValidType) {
                onCompleteOut = type as CompleteCallback;
                onProgressOut = null;
                typeOut = null;
            }
            if (onProgress !== undefined && !isValidType) {
                onProgressOut = type as ProgressCallback;
                typeOut = null;
            }
        }
        return { paths: pathsOut, type: typeOut, onProgress: onProgressOut, onComplete: onCompleteOut };
    }

    private loadByBundleAndArgs<T extends Asset>(args: ILoadResArgs<T>) {
        return new Promise((resolve, reject) => {
            if (args.bundle) {
                if (assetManager.bundles.has(args.bundle)) {
                    let bundle = assetManager.bundles.get(args.bundle);
                    resolve(bundle);
                } else {
                    // 自动加载bundle
                    assetManager.loadBundle(args.bundle, (err, bundle) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(bundle);
                    })
                }
            } else {
                resolve(resources);
            }
        })
    }

    private loadByArgs<T extends Asset>(args: ILoadResArgs<T>) {
        return new Promise((resolve, reject)=>{
            this.loadByBundleAndArgs(args).then((bundle: AssetManager.Bundle) => {
                let completeCallback = (err, asset)=>{
                    args.onComplete && args.onComplete(err,asset);
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(asset);
                }
                if (args.dir) {
                    bundle.loadDir(args.paths as string, args.type, args.onProgress, completeCallback);
                } else {
                    if (typeof args.paths == 'string') {
                        bundle.load(args.paths, args.type, args.onProgress, completeCallback);
                    } else {
                        bundle.load(args.paths, args.type, args.onProgress, completeCallback);
                    }    
                }
            }, (err: any) => {
                reject(err)
            })
        });
    }

    private preloadByArgs<T extends Asset>(args: ILoadResArgs<T>) {
        return new Promise((resolve, reject)=>{
            this.loadByBundleAndArgs(args).then((bundle: AssetManager.Bundle) => {
                let completeCallback = (err, asset)=>{
                    args.onComplete && args.onComplete(err,asset);
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(asset);
                }
                if (args.dir) {
                    bundle.preloadDir(args.paths as string, args.type, args.onProgress, completeCallback);
                } else {
                    if (typeof args.paths == 'string') {
                        bundle.preload(args.paths, args.type, args.onProgress, completeCallback);
                    } else {
                        bundle.preload(args.paths, args.type, args.onProgress, completeCallback);
                    }    
                }
            }, (err: any) => {
                reject(err)
            })
        });
    }

    public load<T extends Asset>(bundleName: string, paths: string | string[], type: AssetType<T> | null, onProgress: ProgressCallback | null, onComplete: CompleteCallback<T> | null): Promise<T>;
    public load<T extends Asset>(bundleName: string, paths: string | string[], onProgress: ProgressCallback | null, onComplete: CompleteCallback<T> | null): Promise<T>;
    public load<T extends Asset>(bundleName: string, paths: string | string[], onComplete?: CompleteCallback<T> | null): Promise<T>;
    public load<T extends Asset>(bundleName: string, paths: string | string[], type: AssetType<T> | null, onComplete?: CompleteCallback<T> | null): Promise<T>;
    public load<T extends Asset>(paths: string | string[], type: AssetType<T> | null, onProgress: ProgressCallback | null, onComplete: CompleteCallback<T> | null): Promise<T>;
    public load<T extends Asset>(paths: string | string[], onProgress: ProgressCallback | null, onComplete: CompleteCallback<T> | null): Promise<T>;
    public load<T extends Asset>(paths: string | string[], onComplete?: CompleteCallback<T> | null): Promise<T>;
    public load<T extends Asset>(paths: string | string[], type: AssetType<T> | null, onComplete?: CompleteCallback<T> | null): Promise<T>;
    public async load<T extends Asset>(
        bundleName: string,
        paths?: string | string[] | AssetType<T> | ProgressCallback | CompleteCallback | null,
        type?: AssetType<T> | ProgressCallback | CompleteCallback | null,
        onProgress?: ProgressCallback | CompleteCallback | null,
        onComplete?: CompleteCallback | null,
    ) {
        let args: ILoadResArgs<T> | null = null;
        if (typeof paths === "string" || paths instanceof Array) {
            args = this.parseLoadResArgs(paths, type, onProgress, onComplete);
            args.bundle = bundleName;
        } else {
            args = this.parseLoadResArgs(bundleName, paths, type, onProgress);
            args.bundle = 'res';
        }
        let asset = this.getPrefab(args.paths as string);
        if(!isValid(asset)){
            try{
                asset = await this.loadByArgs(args);
            }catch(error){
                console.error('资源加载失败 error:', JSON.stringify(error), "| asset: ", asset, " | args: ", args);
            }
        }else{
            args.onComplete && args.onComplete(null,asset);
        }
        return Promise.resolve(asset);
    }

    public loadDir<T extends Asset>(bundleName: string, dir: string, type: AssetType<T> | null, onProgress: ProgressCallback | null, onComplete: CompleteCallback<T[]> | null): Promise<T>;
    public loadDir<T extends Asset>(bundleName: string, dir: string, onProgress: ProgressCallback | null, onComplete: CompleteCallback<T[]> | null): Promise<T>;
    public loadDir<T extends Asset>(bundleName: string, dir: string, onComplete?: CompleteCallback<T[]> | null): Promise<T>;
    public loadDir<T extends Asset>(bundleName: string, dir: string, type: AssetType<T> | null, onComplete?: CompleteCallback<T[]> | null): Promise<T>;
    public loadDir<T extends Asset>(dir: string, type: AssetType<T> | null, onProgress: ProgressCallback | null, onComplete: CompleteCallback<T[]> | null): Promise<T>;
    public loadDir<T extends Asset>(dir: string, onProgress: ProgressCallback | null, onComplete: CompleteCallback<T[]> | null): Promise<T>;
    public loadDir<T extends Asset>(dir: string, onComplete?: CompleteCallback<T[]> | null): Promise<T>;
    public loadDir<T extends Asset>(dir: string, type: AssetType<T> | null, onComplete?: CompleteCallback<T[]> | null): Promise<T>;
    public async loadDir<T extends Asset>(
        bundleName: string,
        dir?: string | AssetType<T> | ProgressCallback | CompleteCallback | null,
        type?: AssetType<T> | ProgressCallback | CompleteCallback | null,
        onProgress?: ProgressCallback | CompleteCallback | null,
        onComplete?: CompleteCallback | null,
    ) {
        let args: ILoadResArgs<T> | null = null;
        if (typeof dir === "string") {
            args = this.parseLoadResArgs(dir, type, onProgress, onComplete);
            args.bundle = bundleName;
        } else {
            args = this.parseLoadResArgs(bundleName, dir, type, onProgress);
            args.bundle = 'res';
        }
        args.dir = args.paths as string;
        let assets = null;
        try{
            assets = await this.loadByArgs(args); 
        }catch(error){
            console.log('资源文件夹加载失败 ' , error, args)
        }
        return Promise.resolve(assets);
    }


    public preload<T extends Asset>(bundleName: string, paths: string | string[], type: AssetType<T> | null, onProgress: ProgressCallback | null, onComplete: CompleteCallback<T> | null): void;
    public preload<T extends Asset>(bundleName: string, paths: string | string[], onProgress: ProgressCallback | null, onComplete: CompleteCallback<T> | null): void;
    public preload<T extends Asset>(bundleName: string, paths: string | string[], onComplete?: CompleteCallback<T> | null): void;
    public preload<T extends Asset>(bundleName: string, paths: string | string[], type: AssetType<T> | null, onComplete?: CompleteCallback<T> | null): void;
    public preload<T extends Asset>(paths: string | string[], type: AssetType<T> | null, onProgress: ProgressCallback | null, onComplete: CompleteCallback<T> | null): void;
    public preload<T extends Asset>(paths: string | string[], onProgress: ProgressCallback | null, onComplete: CompleteCallback<T> | null): void;
    public preload<T extends Asset>(paths: string | string[], onComplete?: CompleteCallback<T> | null): void;
    public preload<T extends Asset>(paths: string | string[], type: AssetType<T> | null, onComplete?: CompleteCallback<T> | null): void;
    public async preload<T extends Asset>(
        bundleName: string,
        paths?: string | string[] | AssetType<T> | ProgressCallback | CompleteCallback | null,
        type?: AssetType<T> | ProgressCallback | CompleteCallback | null,
        onProgress?: ProgressCallback | CompleteCallback | null,
        onComplete?: CompleteCallback | null,
    ) {
        let args: ILoadResArgs<T> | null = null;
        if (typeof paths === "string" || paths instanceof Array) {
            args = this.parseLoadResArgs(paths, type, onProgress, onComplete);
            args.bundle = bundleName;
        } else {
            args = this.parseLoadResArgs(bundleName, paths, type, onProgress);
            args.bundle = 'res';
        }
        let asset = null;
        try{
            asset = await this.preloadByArgs(args);;
        }catch(error){
            console.log('资源预加载失败 ' , error, args)
        }
        return Promise.resolve(asset);
    }

    public preloadDir<T extends Asset>(bundleName: string, dir: string, type: AssetType<T> | null, onProgress: ProgressCallback | null, onComplete: CompleteCallback<T[]> | null): void;
    public preloadDir<T extends Asset>(bundleName: string, dir: string, onProgress: ProgressCallback | null, onComplete: CompleteCallback<T[]> | null): void;
    public preloadDir<T extends Asset>(bundleName: string, dir: string, onComplete?: CompleteCallback<T[]> | null): void;
    public preloadDir<T extends Asset>(bundleName: string, dir: string, type: AssetType<T> | null, onComplete?: CompleteCallback<T[]> | null): void;
    public preloadDir<T extends Asset>(dir: string, type: AssetType<T> | null, onProgress: ProgressCallback | null, onComplete: CompleteCallback<T[]> | null): void;
    public preloadDir<T extends Asset>(dir: string, onProgress: ProgressCallback | null, onComplete: CompleteCallback<T[]> | null): void;
    public preloadDir<T extends Asset>(dir: string, onComplete?: CompleteCallback<T[]> | null): void;
    public preloadDir<T extends Asset>(dir: string, type: AssetType<T> | null, onComplete?: CompleteCallback<T[]> | null): void;
    public async preloadDir<T extends Asset>(
        bundleName: string,
        dir?: string | AssetType<T> | ProgressCallback | CompleteCallback | null,
        type?: AssetType<T> | ProgressCallback | CompleteCallback | null,
        onProgress?: ProgressCallback | CompleteCallback | null,
        onComplete?: CompleteCallback | null,
    ) {
        let args: ILoadResArgs<T> | null = null;
        if (typeof dir === "string") {
            args = this.parseLoadResArgs(dir, type, onProgress, onComplete);
            args.bundle = bundleName;
        } else {
            args = this.parseLoadResArgs(bundleName, dir, type, onProgress);
            args.bundle = 'res';
        }
        args.dir = args.paths as string;
        let assets = null;
        try{
            assets = await this.preloadByArgs(args); 
        }catch(error){
            console.log('资源文件夹预加载失败 ' , error, args)
        }
        return Promise.resolve(assets);
    }

    public loadRemote<T extends Asset>(url: string, options: IRemoteOptions | null, onComplete?: CompleteCallback<T> | null): void;
    public loadRemote<T extends Asset>(url: string, onComplete?: CompleteCallback<T> | null): void;
    public loadRemote(url: string, ...args: any): void {
        assetManager.loadRemote(url, ...args);
    }

    public get<T extends Asset>(path: string, type?: AssetType<T> | null, bundleName: string = 'res'): T | null {
        var bundle: AssetManager.Bundle | null = assetManager.getBundle(bundleName);
        return bundle!.get(path, type);
    }

    public releaseBundle(bundleName) {
        console.warn("remove bundle name:" + bundleName)
        let bundle: AssetManager.Bundle = assetManager.getBundle(bundleName);
        if (bundle) {
            bundle.releaseAll();
            assetManager.removeBundle(bundle);
        }
    }
    
}


