import { _decorator, Component, Label, Node } from "cc";
import { XUtils } from "../../comm/XUtils";
const { ccclass, property } = _decorator;

@ccclass('ViewZanting')
export default class ViewZanting extends Component {
    @property(Node)
    private btnQuit: Node;
    @property(Node)
    private btnPlay: Node;

    private _callback: Function;

    protected start(): void {
        XUtils.bindClick(this.btnQuit, this.onClickQuit, this);
        XUtils.bindClick(this.btnPlay, this.onClickPlay, this);
    }

    private onClickPlay() {
        this.node.active = false;
    }

    private onClickQuit() {
        this.node.active = false;
        this._callback && this._callback();
    }

    public show(callback: Function) {
        this.node.active = true;
        this._callback = callback;
    }

}