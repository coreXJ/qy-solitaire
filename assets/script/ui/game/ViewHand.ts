import { _decorator, Component, Label, Node, tween, Tween, UIOpacity, v3, Vec3 } from "cc";
import GameLoader from "../../game/GameLoader";
import { Card, CardType, PropID } from "../../data/GameObjects";
import CardView from "./CardView";
import UIGame from "./UIGame";
import { XUtils } from "../../comm/XUtils";
import GameCtrl from "../../game/GameCtrl";
import { CardBlow, CardJoker } from "../../data/GameConfig";
import GameData from "../../game/GameData";
import UserModel from "../../data/UserModel";
import { CardTweens } from "../../game/CardTweens";
const { ccclass, property } = _decorator;

export const POOL_VISIBLE_CARD_COUNT = 9;
export const POOL_OFFSET_X = -22;

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
    @property(Node)
    prebWinGold: Node = null;
    
    public view: UIGame = null;
    private poolCards: CardView[] = [];
    private handCards: CardView[] = [];
    
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
        // console.log('ViewHand dealCards', poolCount);
        return new Promise<void>(resolve => {
            this.scheduleOnce(()=>{
                // 先发pool牌 
                for (let i = 0; i < poolCount + 1; i++) {
                    const cardView = this.newPoolCardView(false);
                    CardTweens.addPoolCard(cardView, i, poolCount + 1)
                    .call(()=>{
                        this.poolCards.push(cardView);
                        // this.updatePoolVisible();
                        if (i == poolCount) {
                            // this.tweenMovePoolCards();
                            this.scheduleOnce(() => {
                                resolve();
                            }, 0.7);
                        }
                    }).start();
                }
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
            this.view.bindCardTouch(cardView, this.onClickPoolCard, this, cardView);
            const pos = this.node.getWorldPosition();
            pos.add(v3(startX + i * offsetX, y, 0));
            cardView.vWorldPosition = pos;
            tween(cardView).set({z: -0.8})
                .to(0.3,{z: 0},{easing:'backOut'}).start();
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
            this.view.bindCardTouch(cardView, this.onClickPoolCard, this, cardView);
            cardView.vWorldPosition = this.view.table.node.worldPosition;
            tween(cardView).set({z: -0.8})
                .to(0.3,{z: 0.2},{easing:'backOut'}).start();
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
        const addCards: CardView[] = [];
        const tws: Tween[] = [];
        const count = cardValues.length;
        const pos = this.view.top.getTaskCardWorldPosition();
        const startX = pos.x - (count - 1)/2 * CardView.WIDTH / 2;
        for (let i = 0; i < count; i++) {
            const value = cardValues[i];
            const nd = GameLoader.addCard();
            nd.parent = this.ndPoolRoot;
            const cardView = nd.getComponent(CardView);
            cardView.cardValue = value;
            this.poolCards.splice(idxs[i], 0, cardView);
            this.view.bindCardTouch(cardView, this.onClickPoolCard, this, cardView);
            const vPos = v3(pos);
            vPos.x = startX + i * CardView.WIDTH / 2;
            cardView.vWorldPosition = vPos;
            const tw = CardTweens.popTaskAwardCard(cardView);
            tws.push(tw);
            addCards.push(cardView);
        }
        tws[count - 1].call(()=>{
            this.tweenMovePoolCards((cardView,x,bExtraCard)=>{
                const idx = addCards.indexOf(cardView);
                if (idx >= 0) {
                    const tw = CardTweens.moveTaskAwardPoolCard(cardView, x);
                    tw.call(()=>{
                        if (bExtraCard) {
                            CardTweens.fadeOut(cardView);
                        } else {
                            CardTweens.fadeIn(cardView);
                        }
                    }).start();
                    return true;
                }
                return false;
            });
        });
        for (const e of tws) {
            e.start();
        }
    }
    public undoTaskAwardCards(idxs: number[]) {
        idxs.sort((id0,id1)=>id1-id0); // 从大到小排序
        for (const idx of idxs) {
            const cardView = this.poolCards.splice(idx, 1)[0];
            if (cardView) {
                const worldPosition = cardView.vWorldPosition;
                cardView.node.parent = this.node;
                tween(cardView).set({
                    z: 0,
                    vWorldPosition:worldPosition
                }).delay(0.2).to(0.5, {
                    z: -0.5,
                    vWorldPosition: this.view.top.getTaskCardWorldPosition()
                },{easing: 'quadOut'}).call(()=>{
                    GameLoader.removeCard(cardView.node);
                }).start();
            }
        }
        this.tweenMovePoolCards();
    }
    public addPropAddCards(count: number) {
        for (let i = 0; i < count; i++) {
            const cardView = this.newPoolCardView();
            CardTweens.addPoolCard(cardView, i, count).start();
        }
        this.checkPoolEmpty();
        this.view.blockTouch(1 / 12 * 8 + 0.1 * count);
    }
    public addPropJokerCard() {
        const nd = GameLoader.addCard();
        nd.parent = this.ndHandRoot;
        const cardView = nd.getComponent(CardView);
        cardView.cardValue = CardJoker;
        // this.poolCards.push(cardView);
        const startWorldPos = this.propJokerWorldPosition;
        // const endWorldPos = this.ndHandRoot.worldPosition;
        cardView.vWorldPosition = startWorldPos;
        tween(cardView).set({z: -0.8})
            .to(0.3,{z: 0},{easing:'backOut'})
            .call(()=>{
                CardTweens.propJoker(cardView).start();
            }).start();
        this.handCards.push(cardView);
    }
    private get propJokerWorldPosition() {
        const pos = v3(this.ndPropJoker.worldPosition);
        pos.y += 15;
        return pos;
    }
    public undoPropJokerCard() {
        const cardView = this.popHandCard();
        const startWorldPos = cardView.vWorldPosition;
        cardView.node.parent = this.node;
        cardView.vWorldPosition = startWorldPos;
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
    public newPoolCardView(bAdd = true) {
        const nd = GameLoader.addCard(this.ndPoolRoot);
        const cardView = nd.getComponent(CardView);
        cardView.cardValue = 0;
        if (bAdd) {
            this.poolCards.push(cardView);
        }
        this.view.bindCardTouch(cardView, this.onClickPoolCard, this, cardView);
        return cardView;
    }
    public addPoolCardView(cardView?: CardView) {
        // const len = this.poolCards.length;
        if (!cardView) {
            const nd = GameLoader.addCard();
            cardView = nd.getComponent(CardView);
        }
        cardView.node.parent = this.ndPoolRoot;
        this.poolCards.push(cardView);
        this.tweenMovePoolCards();
        this.view.bindCardTouch(cardView, this.onClickPoolCard, this, cardView);
    }

    public drawPoolCard(cardValue?: number) {
        console.log('drawPoolCard',cardValue);
        if (this.poolCards.length > 0) {
            const cardView = this.topPoolCard;
            Tween.stopAllByTarget(cardView);
            const wpos = v3(cardView.vWorldPosition);
            this.popPoolCard();
            cardView.data = cardView.data || new Card();
            cardView.type = CardType.hand;
            if (cardValue) {
                cardView.data.value = cardValue;
            }
            console.log('drawPoolCard111',cardView.cardValue);
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
        pos.z = 0.2;
        cardView.node.parent = this.node;
        cardView.vWorldPosition = wpos;
        tween(cardView).to(0.4, {
            vWorldPosition: pos,
            // z: 0.2
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
        nd.setPosition(0, 0);
        const cardView = nd.getComponent(CardView);
        cardView.cardValue = CardBlow;
        this.poolCards.push(cardView);
        this.view.bindCardTouch(cardView, this.onClickPoolCard, this, cardView);
        this.tweenMovePoolCards();
        cardView.getComponent(UIOpacity).opacity = 0;
        CardTweens.fadeIn(cardView, 0.2).start();
        // cardView.vWorldPosition = this.view.table.node.worldPosition;
        // tween(cardView).set({z: -0.8})
        //     .to(0.3,{z: 0.2},{easing:'backOut'}).start();
        // return new Promise<void>(resolve => {
        //     this.scheduleOnce(async ()=>{
        //         await this.tweenMovePoolCards();
        //         resolve();
        //     },0.5);
        // });
    }
    public undoDrawPoolCard() {
        const cardView = this.popHandCard();
        cardView.isFront = false;
        const wpos = cardView.vWorldPosition;
        this.addPoolCardView(cardView);
        cardView.vWorldPosition = wpos;
    }

    public addHandCard(cardView: CardView, fromWorldPosition?: Vec3) {
        console.log('addHandCard111');
        cardView.node.parent = this.ndHandRoot;
        if (fromWorldPosition) {
            cardView.vWorldPosition = fromWorldPosition;
        }
        this.handCards.push(cardView);
        tween(cardView.node).to(0.3, { position: v3(0,0) },{ easing: 'quadOut' })
            .delay(0.1)
            .call(()=>{
                cardView.isFront = true;
                console.log('addHandCard222',cardView.cardValue);
            }).start();
    }
    public popHandCard() {
        const cardView = this.handCards.pop();
        if (cardView) {
            cardView.node.removeFromParent();
            XUtils.unbindClick(cardView.node);
            cardView.vWorldPosition = this.ndHandRoot.worldPosition;
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
        cardView.type = CardType.hand;
        cardView.node.parent = this.ndHandRoot;
        if (fromWorldPosition) {
            cardView.vWorldPosition = fromWorldPosition;
        }
        this.handCards.push(cardView);
        CardTweens.linkTable(cardView).start();
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
        console.log('onClickPoolCard',idx,cardView);
        if (idx == -1 || idx < this.poolCards.length - 1) {
            return;
        }
        console.log('onClickPoolCard', cardView);
        GameCtrl.drawPool();
        this.view.blockTouch(0.5);
    }

    /**用tween缓动把poolCard移到自己的位置 */
    private tweenMovePoolCards(customTweenFunc?: (cardView:CardView,x:number,bExtraCard:boolean)=>boolean) {
        const len = this.poolCards.length;
        const startX = -CardView.WIDTH * 0.5;
        for (let i = 0; i < len; i++) {
            const cardView = this.poolCards[i];
            const nd = cardView.node;
            nd.setSiblingIndex(i);
            const num = Math.min(len - i, POOL_VISIBLE_CARD_COUNT) - 1;
            const x = startX + num * POOL_OFFSET_X;
            Tween.stopAllByTarget(nd);
            // 如果是extra的牌，fadeOut，否则fadeIn
            const bExtraCard = POOL_VISIBLE_CARD_COUNT < len - i - 1;
            const bCustomTween = customTweenFunc && customTweenFunc(cardView,x,bExtraCard);
            if (!bCustomTween) {
                CardTweens.movePoolCard(cardView, x)
                    .call(()=>{
                        if (bExtraCard) {
                            CardTweens.fadeOut(cardView).start();
                        } else {
                            CardTweens.fadeIn(cardView).start();
                        }
                    }).start();
            }
        }
        // 检查ndExtraNum是否大于0
        const bExtra = len > POOL_VISIBLE_CARD_COUNT;
        // this.ndExtraNum.active = true;
        const extraNumX = -268;
        if (!this.ndExtraNum.active) {
            this.ndExtraNum.setPosition(extraNumX + 50, 0);
        }
        if (bExtra) {
            tween(this.ndExtraNum).set({
                active: true
            }).to(0.2, {
                position: v3(extraNumX)
            }).set({
            }).start();
        } else if (this.ndExtraNum.active) {
            tween(this.ndExtraNum)
            .to(0.2, {
                position: v3(extraNumX + 50)
            }).set({
                active: false
            }).start();
        }
        const lb = this.ndExtraNum.getComponentInChildren(Label);
        lb.string = '+' + (len - POOL_VISIBLE_CARD_COUNT);
        this.checkPoolEmpty();
        return new Promise<void>((resolve, reject) => {
            this.scheduleOnce(() => {
                resolve();
            }, 0.5);
        });
    }

    /**通关时的算分动画 */
    public playWinAnimPool() {
        const cards = [...this.poolCards].reverse();
        return new Promise<void>(resolve=>{
            let idx = 0;
            let addMs = 0.25;
            const next = ()=>{
                const cardView = cards[idx];
                CardTweens.fadeOutTop(cardView, addMs, ()=>{
                    idx ++;
                    if (idx < cards.length) {
                        addMs = Math.max(addMs - 0.05, 0);
                        next();
                    }
                    console.log('跳金币');
                    // 跳金币
                    const x = cardView.vWorldPosition.x;
                    const startY = this.ndPoolRoot.worldPosition.y + CardView.HEIGHT;
                    const ndGoldAnim = GameLoader.addWinPoolGold(this.prebWinGold);
                    ndGoldAnim.parent = this.node;
                    ndGoldAnim.worldPosition = v3(x, startY);
                    CardTweens.fadeOutWinPoolGold(ndGoldAnim)
                        .call(()=>{
                            GameLoader.removeWinPoolGold(ndGoldAnim);
                            if (idx >= cards.length) {
                                resolve();
                            }
                        }).start();
                }).start();
            }
            this.scheduleOnce(()=>{
                next();
                CardTweens.fadeOutNode(this.ndExtraNum).call(()=>{
                    this.ndExtraNum.getComponent(UIOpacity).opacity = 255;
                    this.ndExtraNum.active = false;
                }).start();
            }, 0.6);
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
        this.ndExtraNum.active = false;
    }
    protected update(dt: number): void {
        if (this.view.isStarted) {
            this.updateHandVisible(); 
            // this.updatePoolVisible();
        }
    }
    private updateHandVisible() {
        const handCount = this.handCards.length;
        if (handCount == 0) {
            return;
        }
        let bool = false;
        for (let i = handCount - 1; i >= 0; i--) {
            const e = this.handCards[i];
            if (!bool) {
                e.node.active = true;
                const xy = e.vPositionXY;
                if (xy.x == 0 && xy.y == 0) {
                    bool = true;
                }
            } else {
                e.node.active = false;
            }
        }
    }
    // private updatePoolVisible() {
    //     const count = this.poolCards.length;
    //     if (count == 0) {
    //         return;
    //     }
    //     const startX = -CardView.WIDTH * 0.5;
    //     const x = startX + (POOL_VISIBLE_CARD_COUNT - 1) * POOL_OFFSET_X;
    //     let bool = false;
    //     for (let i = count - 1; i >= 0; i--) {
    //         const e = this.poolCards[i];
    //         if (!bool) {
    //             e.node.active = true;
    //             const xy = e.vPositionXY;
    //             if (xy.x == x) {
    //                 bool = true;
    //             }
    //         } else {
    //             e.node.active = false;
    //         }
    //     }
    // }
}