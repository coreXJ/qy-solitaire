import { Component, director, instantiate, Label, Prefab, SpriteFrame } from "cc";
import { _decorator } from "cc";
import { ResMgr } from "../manager/ResMgr";

const { ccclass, property } = _decorator;

const SEC_SHORT = 1.5;
const SEC_LONG = 3;
/**
 * 公用吐司
 */
@ccclass("Toast")
export class Toast extends Component {
    private static _instance: Toast;
    public static async init() {
        let prefab = await ResMgr.instance.load("prefab/comm/Toast", Prefab);
        let node = instantiate(prefab);
        node.parent = director.getScene()!.getChildByPath('Canvas/Max');
        node.active = false;
        this._instance = node.getComponent(Toast);
    }
    public static show(msg: string, sec: number = SEC_SHORT) {
        this._instance.show(msg, sec);
    }
    public static showLong(msg: string) {
        this.show(msg, SEC_LONG);
    }

    @property(Label)
    private label: Label;

    private show(msg: string, sec: number = SEC_SHORT) {
        this.label.string = msg;
        this.node.active = true;
        this.unscheduleAllCallbacks();
        this.scheduleOnce(() => {
            this.node.active = false;
        }, sec);
    }
    
}