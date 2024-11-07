import { _decorator } from "cc";
import { isFullScreen, UIView } from "../../base/UIView";
import { UIMgr } from "../../manager/UIMgr";
import { UIID } from "../../data/GameConfig";
const { ccclass, property } = _decorator;

@ccclass('UIGame')
@isFullScreen(true)
export default class UIGame extends UIView {

    public init(...args: any): void {
        console.log('UIGame init');
    }


}