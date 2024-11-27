import { _decorator, Component, Label, Node, tween, Tween, v3, Vec3 } from "cc";
import GameLoader from "../../game/GameLoader";
import { Card, CardType, PropID } from "../../data/GameObjects";
import CardView from "./CardView";
import UIGame from "./UIGame";
import { XUtils } from "../../comm/XUtils";
import GameCtrl from "../../game/GameCtrl";
import { CardBlow, CardJoker } from "../../data/GameConfig";
import GameData from "../../game/GameData";
import UserModel from "../../data/UserModel";
const { ccclass, property } = _decorator;

const POOL_VISIBLE_CARD_COUNT = 9;
const POOL_OFFSET_X = -22;

@ccclass('ViewHand')
export default class ViewHand extends Component {
    @property(Node)
    btnEndGame: Node = null;
    @property(Node)
    ndPoolRoot: Node = null;
    @property(Node)
    ndHandRoot: Node = null;
    @property(Node)
    ndPropAdd: Node = null;
    @property(Node)
    ndPropUndo: Node = null;
    @property(Node)
    ndPropJoker: Node = null;
    @property(Node)
    ndExtraNum: Node = null;
    
    public view: UIGame = null;
    private poolCards: CardView[] = [];
    private handCards: CardView[] = [];
    
    private _canDrawPoolTime: number;

    //==viewmodel start==
    public get poolCardValues(): number[] {
        return this.poolCards.map(cardView => cardView.cardValue);
    }
    public get poolCardCount(): number {
        return this.poolCards.length;
    }
    public get handCardValues(): number[] {
        return this.handCards.map(cardView => cardView.cardValue);
    }
    //==viewmodel end==

    protected onLoad(): void {
        this.btnEndGame.active = false;
        this.ndPropAdd.active = false;
    }

    protected start(): void {
        console.log('ViewHand start');
        this.view.bindClick(this.btnEndGame, this.onClickEndGame, this);
        this.view.bindClick(this.ndPropAdd, this.onClickProp, this, PropID.PropAdd);
        this.view.bindClick(this.ndPropJoker, this.onClickProp, this, PropID.PropJoker);
        this.view.bindClick(this.ndPropUndo, this.onClickProp, this, PropID.PropUndo);
        this.refreshProp();
    }

    public get topHandCardValue() {
        return this.handCards[this.handCards.length-1]?.cardValue || 0;
    }
    public get topPoolCardValue() {
        return this.topPoolCard?.cardValue || 0;
    }
    
    public dealCards(poolCount: number) {
        console.log('ViewHand dealCards', poolCount);
        return new Promise<void>(resolve => {
            // 先发pool牌 
            for (let i = 0; i < poolCount + 1; i++) {
                this.addPoolCardView();
            }
            // 再翻一张hand牌
            this.scheduleOnce(() => {
                resolve();
            }, 0.7);
        });
    }
    public insertWinPoolCards(cardValues: number[],idxs: number[]) {
        const count = cardValues.length;
        const y = 300;
        const offsetX = 50;
        const startX = -(count - 1) / 2 * offsetX;
        for (let i = 0; i < cardValues.length; i++) {
            const value = cardValues[i];
            const nd = GameLoader.addCard();
            nd.parent = this.ndPoolRoot;
            const cardView = nd.getComponent(CardView);
            cardView.cardValue = value;
            this.poolCards.splice(idxs[i], 0, cardView);
            this.view.bindClick(nd, this.onClickPoolCard, this, cardView);
            const pos = this.node.getWorldPosition();
            pos.add(v3(startX + i * offsetX, y, 0));
            cardView.node.worldPosition = pos;
            tween(nd).set({scale: v3(0.2,0.2,1)})
                .to(0.3,{scale: v3(1,1,1)},{easing:'backOut'}).start();
        }
        return new Promise<void>(resolve => {
            this.scheduleOnce(async ()=>{
                await this.tweenMovePoolCards();
                resolve();
            },0.5);
        });
    }
    public insertBlowPoolCards(cardValues: number[],idxs: number[]) {
        console.log('insertBlowPoolCards',cardValues);
        for (let i = 0; i < cardValues.length; i++) {
            const value = cardValues[i];
            const nd = GameLoader.addCard();
            nd.parent = this.ndPoolRoot;
            const cardView = nd.getComponent(CardView);
            cardView.cardValue = value;
            this.poolCards.splice(idxs[i], 0, cardView);
            this.view.bindClick(nd, this.onClickPoolCard, this, cardView);
            cardView.node.worldPosition = this.view.table.node.worldPosition;
            tween(nd).set({scale: v3(0.2,0.2,1)})
                .to(0.3,{scale: v3(1.2,1.2,1)},{easing:'backOut'}).start();
        }
        return new Promise<void>(resolve => {
            this.scheduleOnce(async ()=>{
                await this.tweenMovePoolCards();
                resolve();
            },0.5);
        });
    }
    /**
     * 往抽牌池插入牌，有几种业务情况
     */
    public insertTaskAwardCard(cardValues: number[],idxs: number[]) {
        for (let i = 0; i < cardValues.length; i++) {
            const value = cardValues[i];
            const nd = GameLoader.addCard();
            nd.parent = this.ndPoolRoot;
            const cardView = nd.getComponent(CardView);
            cardView.cardValue = value;
            this.poolCards.splice(idxs[i], 0, cardView);
            this.view.bindClick(nd, this.onClickPoolCard, this, cardView);
            const pos = this.view.top.getTaskCardWorldPosition();
            cardView.node.worldPosition = pos;
            tween(nd).set({scale: v3(0.2,0.2,1)})
                .to(0.3,{scale: v3(1,1,1)},{easing:'backOut'}).start();
        }
        this.scheduleOnce(()=>{
            this.tweenMovePoolCards();
        },0.5);
    }
    public undoTaskAwardCards(idxs: number[]) {
        idxs.sort((id0,id1)=>id1-id0); // 从大到小排序
        for (const idx of idxs) {
            const cardView = this.poolCards.splice(idx, 1)[0];
            if (cardView) {
                const worldPosition = cardView.node.worldPosition;
                cardView.node.parent = this.node;
                tween(cardView.node).set({
                    scale: v3(1,1,1),
                    worldPosition
                }).delay(0.2).to(0.5, {
                    scale: v3(0.5,0.5,1),
                    worldPosition: this.view.top.getTaskCardWorldPosition()
                },{easing: 'quadOut'}).call(()=>{
                    GameLoader.removeCard(cardView.node);
                }).start();
            }
        }
        this.tweenMovePoolCards();
    }
    public addPropAddCards(count: number) {
        for (let i = 0; i < count; i++) {
            const nd = GameLoader.addCard();
            nd.parent = this.ndPoolRoot;
            const cardView = nd.getComponent(CardView);
            cardView.cardValue = 0;
            this.poolCards.push(cardView);
            this.view.bindClick(nd, this.onClickPoolCard, this, cardView);
        }
        this.tweenMovePoolCards();
    }
    public addPropJokerCard() {
        const nd = GameLoader.addCard();
        nd.parent = this.node;
        const cardView = nd.getComponent(CardView);
        cardView.cardValue = CardJoker;
        // this.poolCards.push(cardView);
        nd.worldPosition = this.propJokerWorldPosition;
        tween(nd).set({scale: v3(0.2,0.2,1)})
            .to(0.3,{scale: v3(1,1,1)},{easing:'backOut'}).start();
        this.scheduleOnce(()=>{
            this.addHandCard(cardView, this.propJokerWorldPosition);
            // this.tweenMovePoolCards();
        },0.5);
    }
    private get propJokerWorldPosition() {
        const pos = v3(this.ndPropJoker.worldPosition);
        pos.y += 15;
        return pos;
    }
    public undoPropJokerCard() {
        const cardView = this.popHandCard();
        cardView.node.parent = this.node;
        tween(cardView.node).to(0.3, {
            worldPosition: this.propJokerWorldPosition
        },{ easing: 'quadOut' }).call(()=>{
            GameLoader.removeCard(cardView.node);
        }).start();
    }
    // // * @param type 0task 1prodAdd 2blowCard
    // // * @param cardValues 
    // public insertPoolCards(type:0|1|2, ...cardValues: number[]) {
    //     for (let i = 0; i < cardValues.length; i++) {
    //         const value = cardValues[i];
    //         const nd = GameLoader.addCard(this.ndPoolRoot);
    //         const cardView = nd.getComponent(CardView);
    //         cardView.data.value = value;
    //         this.poolCards.push(cardView);
    //         XUtils.bindClick(cardView.node, this.onClickPoolCard, this, cardView);
    //         if (type == 0) { // task
    //             const pos = this.view.top.getTaskCardWorldPosition();
    //             cardView.node.worldPosition = pos;
    //         }
    //     }
    //     this.tweenMovePoolCards();
    // }

    public addPoolCardView(cardView?: CardView) {
        // const len = this.poolCards.length;
        if (!cardView) {
            const nd = GameLoader.addCard();
            cardView = nd.getComponent(CardView);
        }
        cardView.node.parent = this.ndPoolRoot;
        this.poolCards.push(cardView);
        this.tweenMovePoolCards();
        this.view.bindClick(cardView.node, this.onClickPoolCard, this, cardView);
    }

    public drawPoolCard(cardValue?: number) {
        if (this.poolCards.length > 0) {
            const cardView = this.topPoolCard;
            const wpos = v3(cardView.node.worldPosition);
            this.popPoolCard();
            cardView.data = cardView.data || new Card();
            cardView.data.type = CardType.hand;
            if (cardValue) {
                cardView.data.value = cardValue;
            }
            if (cardView.cardValue == CardBlow) {
                this.playBlowCardEffect(cardView, wpos);
            } else {
                this.addHandCard(cardView, wpos);
            }
            return cardView.data;
        }
    }
    private playBlowCardEffect(cardView: CardView, wpos: Vec3) {
        console.log('playBlowCardEffect');
        this.view.blockTouch(1);
        const pos = v3(this.node.worldPosition);
        pos.y += 250;
        cardView.node.parent = this.node;
        cardView.node.worldPosition = wpos;
        tween(cardView.node).to(0.4, {
            worldPosition: pos,
            scale: v3(1.2,1.2,1)
        }, { easing: 'quadOut' }).delay(0.2).call(()=>{
            console.log('吹走所有顶部牌');
            this.view.table.blowTopCards();
            this.scheduleOnce(()=>{
                GameLoader.removeCard(cardView.node);
            },0.4);
        }).start();
    }
    public undoDrawPoolBlowCard() {
        // 撤回吹风卡
        const nd = GameLoader.addCard();
        nd.parent = this.ndPoolRoot;
        nd.setPosition(0, -400);
        const cardView = nd.getComponent(CardView);
        cardView.cardValue = CardBlow;
        this.poolCards.push(cardView);
        this.view.bindClick(nd, this.onClickPoolCard, this, cardView);
        cardView.node.worldPosition = this.view.table.node.worldPosition;
        tween(nd).set({scale: v3(0.2,0.2,1)})
            .to(0.3,{scale: v3(1.2,1.2,1)},{easing:'backOut'}).start();
        return new Promise<void>(resolve => {
            this.scheduleOnce(async ()=>{
                await this.tweenMovePoolCards();
                resolve();
            },0.5);
        });
    }
    public undoDrawPoolCard() {
        const cardView = this.popHandCard();
        cardView.isFront = false;
        this.addPoolCardView(cardView);
    }

    public addHandCard(cardView: CardView, fromWorldPosition?: Vec3) {
        cardView.node.parent = this.ndHandRoot;
        if (fromWorldPosition) {
            cardView.node.worldPosition = fromWorldPosition;
        }
        this.handCards.push(cardView);
        tween(cardView.node).to(0.3, { position: v3(0,0) },{ easing: 'quadOut' })
            .delay(0.1)
            .call(()=>{
                cardView.isFront = true;
            }).start();
    }
    public popHandCard() {
        const cardView = this.handCards.pop();
        if (cardView) {
            cardView.node.removeFromParent();
            XUtils.unbindClick(cardView.node);
            cardView.node.worldPosition = this.ndHandRoot.worldPosition;
            return cardView;
        }
    }
    public get topPoolCard() {
        return this.poolCards[this.poolCards.length - 1];
    }
    public popPoolCard() {
        if (this.poolCards.length > 0) {
            const cardView = this.poolCards.pop();
            cardView.node.removeFromParent();
            XUtils.unbindClick(cardView.node);
            this.tweenMovePoolCards();
            // this.checkPoolEmpty();
            return cardView;
        }
    }
    // tween动画 把桌牌飞过来 到时候要改下动画
    public linkTableCard(cardView: CardView, fromWorldPosition?: Vec3) {
        cardView.data.type = CardType.hand;
        cardView.node.parent = this.ndHandRoot;
        if (fromWorldPosition) {
            cardView.node.worldPosition = fromWorldPosition;
        }
        this.handCards.push(cardView);
        tween(cardView.node).to(0.3, { 
            position: v3(0,0),
            angle: 0,
         },{ easing: 'quadOut' })
            .delay(0.2)
            .call(()=>{
                // cardView.isFront = true;
            }).start();
    }

    public refreshProp() {
        const nds = [this.ndPropAdd, this.ndPropJoker, this.ndPropUndo];
        const ids = [PropID.PropAdd, PropID.PropJoker, PropID.PropUndo];
        for (let i = 0; i < nds.length; i++) {
            const nd = nds[i];
            const id = ids[i];
            const count = UserModel.getPropCount(id);
            const lbGold = nd.getChildByPath('ndGold/lbGold').getComponent(Label);
            const lbNum = nd.getChildByPath('ndNum/lbNum').getComponent(Label);
            lbGold.node.parent.active = count == 0;
            lbNum.node.parent.active = count > 0;
            lbGold.string = '200'; //读配置
            lbNum.string = count.toString();
        }
    }

    private onClickPoolCard(cardView: CardView) {
        const idx = this.poolCards.indexOf(cardView);
        if (idx == -1 || idx < this.poolCards.length - 1) {
            return;
        }
        if (this._canDrawPoolTime > Date.now()) {
            return;
        }
        console.log('onClickPoolCard', cardView);
        this._canDrawPoolTime = Date.now() + 500;
        GameCtrl.drawPool();
    }

    /**用tween缓动把poolCard移到自己的位置 */
    private tweenMovePoolCards() {
        const len = this.poolCards.length;
        const startX = -CardView.WIDTH * 0.5;
        for (let i = 0; i < len; i++) {
            const nd = this.poolCards[i].node;
            nd.setSiblingIndex(i);
            const num = Math.min(len - i, POOL_VISIBLE_CARD_COUNT) - 1;
            const x = startX + num * POOL_OFFSET_X;
            Tween.stopAllByTarget(nd);
            tween(nd).to(0.5, {
                position: v3(x, 0, 0),
                scale: v3(1, 1, 1)
            }, { easing: 'quadOut' }).start();
        }
        // 检查ndExtraNum是否大于0
        const bExtra = len > POOL_VISIBLE_CARD_COUNT;
        this.ndExtraNum.active = bExtra;
        const lb = this.ndExtraNum.getComponentInChildren(Label);
        lb.string = '+' + (len - POOL_VISIBLE_CARD_COUNT);
        this.checkPoolEmpty();
        return new Promise<void>((resolve, reject) => {
            this.scheduleOnce(() => {
                resolve();
            }, 0.5);
        });
    }

    private checkPoolEmpty() {
        const len = this.poolCards.length;
        const bEmpty = len == 0;
        this.btnEndGame.active = bEmpty;
        this.ndPropAdd.active = bEmpty;
    }
    private onClickProp(id: PropID) {
        this.view.blockTouch(0.5);
        GameCtrl.useProp(id);
    }
    private onClickEndGame() {
        this.view.showZanting();
    }
    public reset() {
        for (const e of this.poolCards) {
            GameLoader.removeCard(e.node);
        }
        for (const e of this.handCards) {
            GameLoader.removeCard(e.node);
        }
        this.poolCards = [];
        this.handCards = [];
    }
}