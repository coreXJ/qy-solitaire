import { _decorator, Component, Node } from 'cc';
import { ResKeeper } from './ResKeeper';
import { ResMgr } from '../manager/ResMgr';
import { SpriteFrame } from 'cc';
import { sp } from 'cc';
import { assetManager } from 'cc';
import { Sprite } from 'cc';
import { isValid } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 预加载界面的资源 目前支持spriteFrame sp.skeData
 */
@ccclass('UIViewLoader')
export class UIViewLoader extends ResKeeper {
    protected preLoadSpriteFrameList: string[] = [];
    protected preLoadSkeList: string[] = [];
    protected preLoadSpriteFrameDir: string = '';
    protected preLoadSkeDir: string = '';
    public _spriteFrameCache: Map<string, SpriteFrame> = new Map();
    public _skeCache: Map<string, sp.SkeletonData> = new Map();

    public preLoadRes(completeCallback: () => void): void {
        Promise.all([this.loadSpriteFrameList(), this.loadSkeList(),this.loadSpriteFrameDir(),this.loadSkeDir()]).then(completeCallback);  
    }

    private loadSpriteFrameList(){
        if(this.preLoadSpriteFrameList.length > 0){
            return ResMgr.instance.load<SpriteFrame>(this.preLoadSpriteFrameList, SpriteFrame, (err, asset: SpriteFrame[])=>{
                if(err)
                    return;
                for(let item of asset){
                    this._spriteFrameCache.set(item.name, item);
                    this.cacheAsset(item);
                }
            });
        }else{
            return Promise.resolve();
        }
    }

    private loadSkeList(){
        if(this.preLoadSkeList.length > 0){
            return ResMgr.instance.load<sp.SkeletonData>(this.preLoadSkeList, sp.SkeletonData, (err, asset: sp.SkeletonData[])=>{
                if(err)
                    return;
                for(let item of asset){
                    this._skeCache.set(item.name, item);
                    this.cacheAsset(item);
                }
            });
        }else{
            return Promise.resolve();
        }
    }

    private loadSpriteFrameDir(){
        if(this.preLoadSpriteFrameDir.length > 0){
            return ResMgr.instance.loadDir(this.preLoadSpriteFrameDir,  SpriteFrame, (err: Error, asset: SpriteFrame[])=>{
                if(err)
                    return;
                for(let item of asset){
                    this._spriteFrameCache.set(item.name, item);
                    this.cacheAsset(item);
                }
            });
        }else{
            return Promise.resolve();
        }
    }

    private loadSkeDir(){
        if(this.preLoadSkeDir.length > 0){
            return ResMgr.instance.loadDir<sp.SkeletonData>(this.preLoadSkeDir, sp.SkeletonData, (err, asset: sp.SkeletonData[])=>{
                if(err)
                    return;
                for(let item of asset){
                    this._skeCache.set(item.name, item);
                    this.cacheAsset(item);
                }
            });
        }else{
            return Promise.resolve();
        }
    }

    public setSpriteFrame(sprite: Sprite, key: string) {
        const frame = this._spriteFrameCache.get(key);
        if (isValid(frame)) {
            sprite.spriteFrame = frame;
        } 
    }


    public setAniData(ske: sp.Skeleton, key: string): boolean{
        let tarSkeData = this._skeCache.get(key);
        if(isValid(tarSkeData)){
            ske.skeletonData = tarSkeData;
            return true;
        }
        return false;
    }

    public playSkeAnimation(ske: sp.Skeleton, key: string, animation: string, loop: boolean = false, onComplete?: () => void, onEvent?:(x: sp.spine.TrackEntry, ev: sp.spine.Event)=>void) {
        if(this.setAniData(ske, key)){
            ske.animation = animation;
            ske.loop = loop;
            onComplete && ske.setCompleteListener(onComplete);
            onEvent && ske.setEventListener(onEvent);
        }

    }

    public onDestroy(): void {
        this._spriteFrameCache.clear();
        this._skeCache.clear();
    }
}


