import { _decorator, Node, Label, instantiate, Sprite, tween, v3 } from "cc";
import { isFullScreen, UIView } from "../../base/UIView";
import { UIMgr } from "../../manager/UIMgr";
import { LoginTypeID, UIID } from "../../data/GameConfig";
import GameData from "../../game/GameData";
import { XUtils } from "../../comm/XUtils";
import { BoosterID, Level } from "../../data/GameObjects";
import UserModel from "../../data/UserModel";
import BoosterView from "./BoosterView";
import { EventMgr, EventName } from "../../manager/EventMgr";
import GameCtrl from "../../game/GameCtrl";
import { MySprite } from "../../components/MySprite";
import GMCtrl from "../../GM/GMCtrl";
import GameLoader from "../../game/GameLoader";
import CardView from "../game/CardView";
const { ccclass, property } = _decorator;

@ccclass('UIHall')
@isFullScreen(true)
export default class UIHall extends UIView {

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
        XUtils.bindClick(this.btnStart, this.toGame, this);
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

        let nd = GameLoader.addCard(this.node);
        let cardView = nd.getComponent(CardView);
        nd.setPosition(90,20)
        nd = GameLoader.addCard(this.node);
        cardView = nd.getComponent(CardView);
        tween(cardView).to(3, {
            vPosition: v3(0, 0, 0.2),
            vAngle: -45,
        }).start();
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
    }
    protected onDisable(): void {
        this.listenEvent(false);
    }
    public toGame() {
        const useBoosters: BoosterID[] = [];
        for (const e of this.compBoosters) {
            if (e.isChecked) {
                useBoosters.push(e.dataID);
            }
        }
        GameCtrl.openGame({
            level: this.level,
            useBoosters
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
        this.mspWinAwards.spriteFrameIdx = Math.min(3,UserModel.winTimes) - 1;
        const spWinTimes = this.btnStart.getChildByName('winbar').getComponent(Sprite);
        spWinTimes.fillRange = UserModel.winTimes / 3;
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