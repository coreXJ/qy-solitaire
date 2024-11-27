import { Component, director, instantiate, Label, Prefab, SpriteFrame } from "cc";
import { _decorator, Node } from "cc";
import { ResMgr } from "../manager/ResMgr";
import { XUtils } from "../comm/XUtils";

const { ccclass, property } = _decorator;

const SEC_SHORT = 1.5;
const SEC_LONG = 3;
/**
 * 公用吐司
 */
@ccclass("Dialog")
export class Dialog extends Component {
    private static _instance: Dialog;
    public static async init() {
        let prefab = await ResMgr.instance.load("prefab/comm/Dialog", Prefab);
        let node = instantiate(prefab);
        node.parent = director.getScene()!.getChildByPath('Canvas/Mid');
        node.active = false;
        this._instance = node.getComponent(Dialog);
    }
    public static show(params:IDialogParams) {
        this._instance.show(params);
    }

    @property(Label)
    private label: Label;
    @property(Node)
    private btnConfirm: Node;
    @property(Node)
    private btnCancel: Node;
    private _confirmCallback: Function;
    private _cancelCallback: Function;

    protected start(): void {
        XUtils.bindClick(this.btnConfirm, this.onClickConfirm, this);
        XUtils.bindClick(this.btnCancel, this.onClickCancel, this);
        this.node.setSiblingIndex(999);
    }

    private onClickConfirm() {
        if (this._confirmCallback && this._confirmCallback()) {
            return;
        }
        this.node.active = false;
    }
    private onClickCancel() {
        if (this._cancelCallback && this._cancelCallback()) {
            return;
        }
        this.node.active = false;
    }
    private show(params:IDialogParams) {
        this._confirmCallback = params.onConfirm;
        this._cancelCallback = params.onCancel;
        this.label.string = params.content;
        this.node.active = true;
    }
    
}

interface IDialogParams {
    content: string;
    title?: string;
    onConfirm?: Function;
    onCancel?: Function;
}