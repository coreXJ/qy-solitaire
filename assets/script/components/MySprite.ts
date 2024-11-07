import { SpriteFrame } from "cc";
import { CCInteger } from "cc";
import { _decorator, Sprite } from "cc";

const { ccclass, property } = _decorator;
/**
 * 目前支持功能：
 * 1.可以持有多个SpriteFrame，通过设置idx切换
 */
@ccclass("MySprite")
export class MySprite extends Sprite {
    @property
    private _spriteFrameList: SpriteFrame[] = [];
    @property(CCInteger)
    private _spriteFrameIdx = 0;

    @property(CCInteger)
    public set spriteFrameIdx(value: number) {
        this._spriteFrameIdx = value;
        this.spriteFrame = this.spriteFrameList[value];
    }
    public get spriteFrameIdx() {
        return this._spriteFrameIdx;
    }
    @property([SpriteFrame])
    public set spriteFrameList(value: SpriteFrame[]) {
        this._spriteFrameList = value;
        this.spriteFrameIdx = this.spriteFrameIdx;
    }
    public get spriteFrameList() {
        return this._spriteFrameList;
    }
}