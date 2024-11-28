import { _decorator, instantiate, Node, tween, v3 } from "cc";
import { isFullScreen, UIView } from "../../base/UIView";
import ViewTable from "./ViewTable";
import ViewHand from "./ViewHand";
import GameCtrl from "../../game/GameCtrl";
import ViewTop from "./ViewTop";
import { BoosterID, Card, Level } from "../../data/GameObjects";
import CardView from "./CardView";
import GameLogic from "../../game/GameLogic";
import { CardBlow } from "../../data/GameConfig";
import { XUtils } from "../../comm/XUtils";
import ViewZanting from "./ViewZanting";
const { ccclass, property } = _decorator;

@ccclass('UIGame')
@isFullScreen(true)
export default class UIGame extends UIView {
    private content: Node;
    public top: ViewTop;
    public table: ViewTable;
    public hand: ViewHand;
    public zanting: ViewZanting;

    public isStarted: boolean = false;
    // public isAniming: boolean = false;
    private _canTouchTime = 0;
    public blockTouch(sec: number) {
        let time = (sec * 1000) + Date.now();
        if (time > this._canTouchTime) {
            this._canTouchTime = time;
        }
    }
    public get isCanTouch() {
        return this.isStarted && Date.now() > this._canTouchTime;
    }
    public init(): void {
        console.log('UIGame init');
        // bind nodes
        this.bindNodes();
        GameCtrl.bind(this);
    }
    public bindClick(node: Node, listener: Function, target?:any, ...args:any[]) {
        XUtils.bindClick(node, ()=>{
            if (this.isCanTouch) {
                listener.apply(target, args)
            }
        }, target, ...args);
    }
    private bindNodes() {
        this.content = this.node.getChildByName('content');
        this.table = this.content.getComponentInChildren(ViewTable);
        this.hand = this.content.getComponentInChildren(ViewHand);
        this.top = this.content.getComponentInChildren(ViewTop);
        this.zanting = this.getComponentInChildren(ViewZanting);
        this.table.view = this;
        this.hand.view = this;
        this.top.view = this;
    }

    /**
     * 游戏开局
     * @param level 关卡数据
     * @param winPoolCards 连胜奖励储备牌
     * @param boosterIDs 场外道具
     */
    public async startGame(level: Level,winPoolCards: number[],boosterIDs: BoosterID[]) {
        this.isStarted = false;
        // 1.发桌牌
        this.table.dealCards(level.tableCards);
        // 2.发储备牌
        await this.hand.dealCards(level.poolCount);
        for (const id of boosterIDs) {
            if (id == BoosterID.hook) {
                // 3.场外钩子
                await this.playBooster1();
            } else if (id == BoosterID.blow) {
                // 4.场外风扇
                await this.playBooster2();
            } else if (id == BoosterID.joker) {
                // 5.场外赖子
                await this.playBooster3();
            }
        }
        // 6.插入连胜奖励牌
        if (winPoolCards.length) {
            const idxs = GameLogic.randomInsertPoolCardIdxs(this.hand.poolCardCount-1, winPoolCards.length);
            await this.hand.insertWinPoolCards(winPoolCards, idxs);
        }
        // 7.摸起始牌
        let handCardValue = level.handCardValue || GameCtrl.getFirstCardValue();
        this.hand.drawPoolCard(handCardValue);
        this.isStarted = true;
    }

    private async playBooster1() {
        console.log('playBooster1');
        // 展示一下，boosterHook
        await new Promise((resolve, reject) => {
            const nd = this.node.getChildByPath('anims/booster1');
            nd.active = true;
            nd.scale = v3(0.2,0.2,1);
            tween(nd).to(0.2, { scale: v3(1.2,1.2,1)})
                .delay(0.3)
                .hide()
                .delay(0.1)
                .call(()=>{
                    nd.active = false;
                    resolve(null);
                }).start();
        });
        for (let i = 0; i < 3; i++) {//读配置（次数）
            await this.table.hookTopCard();
        }
    }

    private async playBooster2() {
        console.log('playBooster2');
        const idxs = GameLogic.randomInsertPoolCardIdxs(this.hand.poolCardCount-1, 1);
        await this.hand.insertBlowPoolCards([CardBlow], idxs);
    }

    private async playBooster3() {
        console.log('playBooster3');
        await this.table.insertBoosterJoker(3); //读配置
    }
    public async undoDrawBlowCard(blowCards: Card[]) {
        this.blockTouch(1.3);
        // 撤回吹风卡
        // 1.table把吹走的卡恢复
        await this.table.undoBlowCards(blowCards);
        // 2.hand把吹风卡恢复
        this.hand.undoDrawPoolBlowCard();
    }
    public linkTableCard(cardView: CardView) {
        const wpos = v3(cardView.vWorldPosition);
        const bSuccess = this.table.removeCard(cardView);
        if (bSuccess) {
            this.hand.linkTableCard(cardView, wpos);
            this.table.checkTopJoker();
        }
    }
    public undoLinkTable(idxs: number[]) {
        // console.log('undoLinkTable',idxs);
        this.blockTouch(0.3);
        const cardView = this.hand.popHandCard();
        if (cardView) {
            this.table.undoCard(cardView);
            cardView.vWorldPosition = this.hand.ndHandRoot.worldPosition;
            if (idxs?.length > 0) {
                this.hand.undoTaskAwardCards(idxs);
            }
        }
        return new Promise<void>(resolve => {
            this.scheduleOnce(()=>{
                resolve();
            }, 0.3);
        });
    }

    public onClose() {
        GameCtrl.unbind();
    }

    public showZanting() {
        this.zanting.show(()=>{
            GameCtrl.onGameEnd(false);
        });
    }

    public reset() {
        this.isStarted = false;
        this.top.reset();
        this.hand.reset();
        this.table.reset();
    }
}
