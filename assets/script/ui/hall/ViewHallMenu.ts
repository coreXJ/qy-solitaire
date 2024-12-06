import { CCBoolean, Component, Label, SpriteFrame, Node, tween, v3, Tween } from "cc";
import { _decorator, Sprite } from "cc";
import { MySprite } from "../../components/MySprite";
import LocalValues from "../../data/LocalValues";
import { XUtils } from "../../comm/XUtils";
import UIGame from "../game/UIGame";
import { CardTweens } from "../../game/CardTweens";
import { CommTweens } from "../../comm/CommTweens";

const { ccclass, property } = _decorator;

/**
 * 游戏设置
 */
@ccclass("ViewHallMenu")
export class ViewHallMenu extends Component {
    public view: UIGame;
    @property(Node)
    private mask: Node = null;
    @property(Node)
    private ndBtns: Node = null;
    @property(MySprite)
    private btnShake: MySprite = null;
    @property(MySprite)
    private btnMusic: MySprite = null;
    @property(MySprite)
    private btnSound: MySprite = null;
    @property(Node)
    private btnOff: Node = null;

    private _bShowing = false;

    protected start(): void {
        this.bindClick(this.node, this.hide, this);
        this.bindClick(this.btnOff, this.onOff, this);
        this.bindClick(this.btnMusic.node, () => {
            let bool = !this.btnMusic.spriteFrameIdx;
            this.btnMusic.spriteFrameIdx = bool ? 1 : 0;
            LocalValues.setMusic(bool);
        });
        this.bindClick(this.btnShake.node, () => {
            let bool = !this.btnShake.spriteFrameIdx;
            this.btnShake.spriteFrameIdx = bool ? 1 : 0;
            LocalValues.setShake(bool);
        });
        this.bindClick(this.btnSound.node, () => {
            let bool = !this.btnSound.spriteFrameIdx;
            this.btnSound.spriteFrameIdx = bool ? 1 : 0;
            LocalValues.setSound(bool);
        });
        this.refreshSwitchs();
    }

    private bindClick(node: Node, listener: Function, target?:any, ...args:any[]) {
        XUtils.bindClick(node, ()=>{
            if (this._bShowing) {
                listener.apply(target, args);
            }
        });
    }

    public show() {
        CommTweens.fadeIn(this.mask, 0.3).start();
        this.node.active = true;
        this.enterAnim().then(()=>{
            this._bShowing = true;
        });
    }
    public async hide() {
        CommTweens.fadeOut(this.mask, 0.3).start();
        this._bShowing = false;
        await this.exitAnim();
        this.node.active = false;
    }
    private async onOff() {
        await this.hide();
        this.view.showZanting();
    }

    private enterAnim() {
        return new Promise<void>((resolve)=>{
            const offsetY = -85;
            const tws: Tween[] = [];
            const count = 4;
            for (let i = 0; i < count; i++) {
                const nd = this.ndBtns.children[i];
                tws[i] = tween(nd).set({position: v3(0,0,0)})
                    .to(0.3, {position: v3(0, offsetY * (i + 1))}, {easing: 'backOut'});
            }
            tws[count - 1].call(()=>{
                resolve();
            });
            for (const tw of tws) {
                tw.start();
            }
        });
    }
    private exitAnim() {
        return new Promise<void>((resolve)=>{
            const offsetY = -85;
            const tws: Tween[] = [];
            const count = 4;
            for (let i = 0; i < count; i++) {
                const nd = this.ndBtns.children[i];
                tws[i] = tween(nd).set({position: v3(0, offsetY * (i + 1))})
                    .to(0.3, {position: v3(0,0)}, {easing: 'backIn'});
            }
            tws[count - 1].call(()=>{
                resolve();
            });
            for (const tw of tws) {
                tw.start();
            }
        });
    }

    private refreshSwitchs() {
        this.btnShake.spriteFrameIdx = LocalValues.getShake() ? 1 : 0;
        this.btnMusic.spriteFrameIdx = LocalValues.getMusic() ? 1 : 0;
        this.btnSound.spriteFrameIdx = LocalValues.getSound() ? 1 : 0;
    }

}