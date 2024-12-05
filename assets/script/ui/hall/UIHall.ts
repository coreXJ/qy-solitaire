import { _decorator, Node, Label, instantiate, Sprite, view, tween, v3, UITransform } from "cc";
import { isFullScreen, UIView } from "../../base/UIView";
import { UIMgr } from "../../manager/UIMgr";
import { UIID } from "../../data/GameConfig";
import GameData from "../../game/GameData";
import { XUtils } from "../../comm/XUtils";
import { BoosterID, Level } from "../../data/GameObjects";
import UserModel from "../../data/UserModel";
import BoosterView from "./BoosterView";
import { EventMgr, EventName } from "../../manager/EventMgr";
import GameCtrl from "../../game/GameCtrl";
import { MySprite } from "../../components/MySprite";
import GMCtrl from "../../GM/GMCtrl";
const { ccclass, property } = _decorator;

@ccclass('UIHall')
@isFullScreen(true)
export default class UIHall extends UIView {
    @property(Node)
    private ndTop: Node = null;
    @property(Node)
    private ndBottom: Node = null;
    
    @property(Node)
    private btnStart: Node = null;
    @property(Node)
    private ndBoosters: Node = null;

    @property(MySprite)
    private mspWinAwards: MySprite = null;

    @property(Label)
    private lbGold: Label = null;
    
    private level: Level;
    // public init(...args: any): void {
    //     console.log('UIHall init');
    // }
    protected onLoad(): void {
        console.log('UIHall onLoad');
        this.initBooster();
        XUtils.bindButton(this.btnStart, this.toGame, this);
    }
    private listenEvent(bool: boolean) {
        const func = bool ? 'on' : 'off';
        EventMgr[func](EventName.onBoosterChange, this.updateBooster, this);
        EventMgr[func](EventName.onGoldChange,  this.updateGold, this);
        EventMgr[func](EventName.onCurLevelChange,  this.fullLevel, this);
        EventMgr[func](EventName.onWinTimesChange,  this.fullBtnStart, this);
    }
    public onOpen(fromUI: number, ...args: any): void {
        GMCtrl.init();
    }
    protected onEnable(): void {
        console.log('UIHall onEnable');
        this.fullLevel();
        this.listenEvent(true);
        this.updateBooster();
        this.compBoosters.forEach(e => {
            e.isChecked = false;
        });
        this.fullBtnStart();
        this.updateGold();
        this.playAnimEnter();
    }
    protected onDisable(): void {
        this.listenEvent(false);
    }
    private playAnimEnter() {
        // 1.top往下进入、play和booster往上进入
        // 2.左边右边进入
        const height = view.getVisibleSize().height;
        const topY = height / 2;
        const bottomY = -height / 2;
        const topHeight = this.ndTop.getComponent(UITransform).height;
        const bottomHeight = this.ndBottom.getComponent(UITransform).height;
        tween(this.ndTop).set({position: v3(0,topY + topHeight)})
            .to(0.3, {position: v3(0,topY)})
            .start();
        tween(this.ndBottom).set({position: v3(0,bottomY - bottomHeight)})
            .to(0.5, {position: v3(0, bottomY)})
            .start();
    }
    private playAnimExit() {
        return new Promise<void>(resolve => {
            const height = view.getVisibleSize().height;
            const topY = height / 2;
            const bottomY = -height / 2;
            const topHeight = this.ndTop.getComponent(UITransform).height;
            const bottomHeight = this.ndBottom.getComponent(UITransform).height;
            tween(this.ndTop).set({position: v3(0,topY)})
                .to(0.3, {position: v3(0,topY + topHeight)})
                .start();
            tween(this.ndBottom).set({position: v3(0,bottomY)})
                .to(0.5, {position: v3(0, bottomY - bottomHeight)})
                .call(()=>resolve())
                .start();
        });
    }
    public toGame() {
        const useBoosters: BoosterID[] = [];
        for (const e of this.compBoosters) {
            if (e.isChecked) {
                useBoosters.push(e.dataID);
            }
        }
        this.playAnimExit().then(()=>{
            GameCtrl.openGame({
                level: this.level,
                useBoosters
            });
        });
    }
    public toEditor() {
        UIMgr.instance.open(UIID.UIEditor);
    }
    //---------Booster相关---------
    private compBoosters: BoosterView[] = [];
    private boosterIDs: BoosterID[] = [BoosterID.hook, BoosterID.blow, BoosterID.joker];
    private initBooster() {
        const posX = 185;
        let startX = -posX;
        const ndContainer = this.ndBoosters.getChildByName('container');
        const item0 = ndContainer.children[0];
        for (let i = 0; i < 3; i++) {
            let nd = ndContainer.children[i];
            if (!nd) {
                nd = instantiate(item0);
                nd.parent = ndContainer;
            }
            const comp = nd.getComponent(BoosterView);
            this.compBoosters[i] = comp;
            nd.setPosition(startX + (posX * i), 0);
        }
    }
    private updateBooster() {
        for (let i = 0; i < this.boosterIDs.length; i++) {
            const id = this.boosterIDs[i];
            const data = UserModel.getBooster(id);
            this.compBoosters[i].setData(data);
        }
    }
    //-------------end-------------
    private fullBtnStart() {
        // console.log('fullBtnStart',UserModel.winTimes);
        this.mspWinAwards.spriteFrameIdx = Math.min(3,UserModel.winCombo) - 1;
        const spWinTimes = this.btnStart.getChildByName('winbar').getComponent(Sprite);
        spWinTimes.fillRange = UserModel.winCombo / 3;
    }
    private updateGold() {
        // this.view.top.setGold(UserModel.gold);
        this.lbGold.string = XUtils.formatGold(UserModel.gold);
    }
    private fullLevel() {
        this.level = GameData.getLevel(UserModel.curLevelId);
        this.node.getChildByName('lbLevel').getComponent(Label).string = '' + this.level.name;
    }
}