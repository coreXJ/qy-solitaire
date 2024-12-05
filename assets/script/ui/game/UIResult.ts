import { _decorator, Label, Node } from "cc";
import { isFullScreen, UIView } from "../../base/UIView";
import { XUtils } from "../../comm/XUtils";
import { UIMgr } from "../../manager/UIMgr";
import { UIID } from "../../data/GameConfig";
const { ccclass, property } = _decorator;

@ccclass('UIResult')
export default class UIResult extends UIView {
    @property(Label)
    private lbGold: Label;
    private isEditor: boolean;
    public init(params: IOpenParams): void {
        console.log('UIResult init',params);
        this.lbGold.string = XUtils.formatGold(params.gold);
        this.isEditor = params.isEditor;
        XUtils.bindClick(this.node, this.close.bind(this))
    }

    public close() {
        UIMgr.instance.close(UIID.UIGame)
        if (this.isEditor) {
            UIMgr.instance.replace(UIID.UIEditor);
        } else {
            UIMgr.instance.replace(UIID.UIHall)
        }
    }

}

interface IOpenParams {
    bWin: boolean,
    isEditor: boolean,
    gold: number
}