import { _decorator } from "cc";
import { isFullScreen, UIView } from "../../base/UIView";
import { UIMgr } from "../../manager/UIMgr";
import { UIID } from "../../data/GameConfig";
const { ccclass, property } = _decorator;

@ccclass('UIHall')
@isFullScreen(true)
export default class UIHall extends UIView {

    public init(...args: any): void {
        console.log('hall init');
        
    }

    public onOpen(fromUI: number, ...args: any): void {
        // this.toGame();
    }

    public toGame() {
        UIMgr.instance.open(UIID.UIGame,{levelId: 0});
    }

}