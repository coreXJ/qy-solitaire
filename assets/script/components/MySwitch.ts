import { CCBoolean, Component, Label, SpriteFrame, Node } from "cc";
import { _decorator, Sprite } from "cc";
import { MySprite } from "./MySprite";
import { XUtils } from "../comm/XUtils";

const { ccclass, property } = _decorator;

const LABEL_X = 30;
const BTN_X = -51;

/**
 * 设置界面的开关
 */
@ccclass("MySwitch")
export class MySwitch extends Component {
    @property(MySprite)
    private bg: MySprite;
    @property(Label)
    private label: Label;
    @property(Node)
    private btn: Node;

    private _bChecked: boolean = false;
    @property(CCBoolean)
    public set isChecked(value: boolean) {
        this._bChecked = value;
        this.bg.spriteFrameIdx = value ? 1 : 0;
        this.label.string = value ? 'ON' : 'OFF';
        this.label.node.setPosition(value ? -LABEL_X: LABEL_X, 2);
        this.btn.setPosition(value ? -BTN_X: BTN_X, -1);
        if (this._callback) {
            this._callback(value);
        }
    }
    public get isChecked(): boolean {
        return this._bChecked;
    }

    private _callback: Function;

    protected onLoad(): void {
        XUtils.bindButton(this.node, this.onClick, this);
    }
    private onClick() {
        this.isChecked = !this.isChecked;
    }

    public setOnChange(callback: Function) {
        this._callback = callback;
    }
}