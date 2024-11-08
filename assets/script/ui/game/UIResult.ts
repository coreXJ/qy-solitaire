import { _decorator, Node } from "cc";
import { isFullScreen, UIView } from "../../base/UIView";
import { XUtils } from "../../comm/XUtils";
import { UIMgr } from "../../manager/UIMgr";
import { UIID } from "../../data/GameConfig";
const { ccclass, property } = _decorator;

@ccclass('UIResult')
export default class UIResult extends UIView {

    public init(params: IOpenParams): void {
        console.log('UIResult init',params);
        XUtils.bindClick(this.node, this.close.bind(this))
    }

    public close() {
        UIMgr.instance.close(UIID.UIGame)
        UIMgr.instance.replace(UIID.UIHall)
    }

}

interface IOpenParams {
    bWin: boolean,
}