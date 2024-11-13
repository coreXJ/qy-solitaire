import { _decorator, Node, Label } from "cc";
import { isFullScreen, UIView } from "../../base/UIView";
import { UIMgr } from "../../manager/UIMgr";
import { UIID } from "../../data/GameConfig";
import GameData from "../../data/GameData";
import { XUtils } from "../../comm/XUtils";
import { Level } from "../../data/GameObjects";
const { ccclass, property } = _decorator;

@ccclass('UIHall')
@isFullScreen(true)
export default class UIHall extends UIView {

    @property(Node)
    btnStart: Node = null;
    private level: Level;
    public init(...args: any): void {
        console.log('UIHall init');
        XUtils.bindClick(this.btnStart, this.toGame, this);
    }

    public onOpen(fromUI: number, ...args: any): void {
        
    }
    protected onEnable(): void {
        this.level = GameData.getLevel();
        this.node.getChildByName('lbLevel').getComponent(Label).string = '' + this.level.name;
    }
    public toGame() {
        UIMgr.instance.open(UIID.UIGame,{level: this.level});
    }
    public toEditor() {
        UIMgr.instance.open(UIID.UIEditor);
    }
}