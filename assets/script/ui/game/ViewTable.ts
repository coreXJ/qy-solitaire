import { _decorator, Component, Intersection2D, Tween, tween, UITransform, v3 } from "cc";
import GameLoader from "../../game/GameLoader";
import { Card, CardType } from "../../data/GameObjects";
import CardView from "./CardView";
import UIGame from "./UIGame";
import { XUtils } from "../../comm/XUtils";
import GameCtrl from "../../game/GameCtrl";
import { GameGeometry } from "../../game/GameGeometry";
import { CardJoker } from "../../data/GameConfig";
import { CardTweens } from "../../game/CardTweens";
import GameLogic from "../../game/GameLogic";
const { ccclass, property } = _decorator;

@ccclass('ViewTable')
export default class ViewTable extends Component {

    public view: UIGame = null;
    private cardViews: CardView[] = [];
    private underCardsMap: Map<CardView, CardView[]> = new Map();

    protected onLoad(): void {
        
    }

    protected start(): void {
        console.log('ViewTable start');
        // const card = GameLoader.addCard()
        // card.parent = this.node;
        // console.log(card);
        
    }

    public dealCards(cards: Card[]) {
        console.log('ViewTable dealCards', cards);
        return new Promise<void>(resolve=>{
            const cardViews:CardView[] = [];
            for (const card of cards) {
                const ndCard = GameLoader.addCard()
                ndCard.parent = this.node;
                const cardView = ndCard.getComponent(CardView);
                cardView.data = card;
                cardView.type = CardType.table;
                // cardView.vPosition = card.tPos;
                // cardView.vAngle = card.tAngle;
                cardView.isFront = false;
                cardViews.push(cardView);
            }
            // 当动画结束后
            // 先setup所有牌
            for (let i = 0; i < cardViews.length; i++) {
                const v = cardViews[i];
                CardTweens.dealTableCard(v, i).call(()=>{
                    if (i == cardViews.length - 1) {
                        for (const e of cardViews) {
                            this.setupCard(e);
                        }
                        this.updateCards();
                        resolve();
                    }
                }).start();
            }
        });
    }
    
    public undoCard(cardView: CardView) {
        cardView.node.parent = this.view.node;
        cardView.type = CardType.table;
        this.view.blockTouch(0.3);
        const endPos = v3(this.node.position).add(v3(cardView.data.tPos));
        tween(cardView).to(0.3, {
            vPositionXY: endPos,
            vAngle: cardView.data.tAngle
        },{ easing: 'quadOut' })
            .call(()=>{
                cardView.node.parent = this.node;
                cardView.vPositionXY = cardView.data.tPos;
                this.setupCard(cardView);
                this.updateCards();
            }).start();
    }

    private updateCards() {
        for (const v of this.cardViews) {
            v.isFront = v.overlap == 0;
        }
    }

    private setupCard(cardView: CardView) {
        // console.log('setupCard', cardView);
        const underCards = this.findUnderCards(cardView);
        // console.log('underCards', underCards);
        for (const e of underCards) {
            e.overlap ++;
            e.updateView();
        }
        this.cardViews.push(cardView);
        this.underCardsMap.set(cardView, underCards);
        this.view.bindCardTouch(cardView, this.onClickCard.bind(this,cardView));
    }
    private setupInsertJokerCard(cardView: CardView) {
        this.cardViews.push(cardView);
        // 寻找上层的重合牌
        const overCards = this.findOverCards(cardView);
        for (const e of overCards) {
            const unders = this.underCardsMap.get(e);
            if (unders) {
                unders.push(cardView);
                cardView.overlap++;
            }
        }
        cardView.updateView();
        this.cardViews.sort((a,b)=>a.data.tIdx-b.data.tIdx);
        this.cardViews.sort((a,b)=>a.data.tLayer-b.data.tLayer);
        for (let i = 0; i < this.cardViews.length; i++) {
            const e = this.cardViews[i];
            e.node.setSiblingIndex(i);
        }
    }
    public checkTopJoker() {
        // 找到所有overlap为0的joker，并直接link，不走ctrl
        for (const e of this.cardViews) {
            if (e.cardValue == CardJoker && e.overlap == 0) {
                this.view.blockTouch(0.3);
                this.scheduleOnce(()=>{
                    GameCtrl.linkTable(e);
                }, 0.2);
                return;
            }
        }
    }
    /**显示miss的卡，当摸储备卡或者使用小丑道具 */
    public shakeMissCards() {
        const handValue = this.view.hand.topHandCardValue;
        if (handValue >= 0x40) {
            return; // 当顶部牌是效果牌时忽略
        }
        const tops = this.getTopCardViews();
        for (const cardView of tops) {
            const bool = GameLogic.isCanLink(handValue, cardView.cardValue);
            if (bool) {
                CardTweens.shake(cardView, true);
            }
        }
    }
    private onClickCard(cardView: CardView) {
        console.log('onCardClick',cardView);
        if (this.cardViews.indexOf(cardView) == -1) {
            return;
        }
        if (cardView.overlap == 0) {
            const bool = GameCtrl.linkTable(cardView);
            if (!bool) {
                CardTweens.shake(cardView,true).start();
            }
        } else {
            CardTweens.shake(cardView).start();
        }
    }

    /**获得所有下层卡 */
    private findUnderCards(cardView: CardView) {
        const underCards:CardView[] = [];
        for (const e of this.cardViews) {
            if (cardView != e) {
                const bIntersects = GameGeometry.doCardViewsIntersect(cardView, e);
                if (bIntersects && e.data.tIdx < cardView.data.tIdx) {
                    underCards.push(e);
                }
            }
        }
        return underCards;
    }
    /**获得所有上层卡 */
    private findOverCards(cardView: CardView) {
        const overCards:CardView[] = [];
        for (const e of this.cardViews) {
            if (cardView != e) {
                const bIntersects = GameGeometry.doCardsIntersect(cardView.data, e.data);
                if (bIntersects && e.data.tLayer > cardView.data.tLayer) {
                    overCards.push(e);
                }
            }
        }
        return overCards;
    }

    public getTopCardValues() {
        const cardValues:number[] = [];
        for (const e of this.cardViews) {
            if (e.overlap == 0) {
                cardValues.push(e.cardValue);
            }
        }
        return cardValues;
    }
    /**随机勾走一张顶部卡 */
    public async hookTopCard() {
        const tops = this.cardViews.filter(e=>e.overlap==0);
        if (tops.length == 0) {
            return;
        }
        const idx = XUtils.getRandomInt(0, tops.length-1);
        const cardView = tops[idx];
        if (this.removeCard(cardView)) {
            cardView.node.parent = this.node;
            const startPos = cardView.node.position;
            const endPos = v3(startPos);
            startPos.x > 0 ? endPos.x += 400 : endPos.x -= 500;
            tween(cardView.node).to(0.7, { position: endPos },{ easing: 'quadOut' })
                .call(()=>{
                    GameLoader.removeCard(cardView.node);
                }).start();
            return new Promise((resolve)=>{
                this.scheduleOnce(()=>{
                    resolve(cardView);
                }, 1);
            });
        }
    }
    public getTopCardViews() {
        return this.cardViews.filter(e=>e.overlap==0);
    }
    public getTopCards() {
        return this.cardViews.filter(e=>e.overlap==0).map(e=>e.data);
    }
    public blowTopCards() {
        const tops = this.getTopCardViews();
        if (tops.length == 0) {
            return;
        }
        for (const cardView of tops) {
            if (this.removeCard(cardView)) {
                cardView.node.parent = this.node;
                CardTweens.blowFadeOut(cardView).call(()=>{
                    GameLoader.removeCard(cardView.node);
                }).start();
                // const endPos = v3(cardView.node.position);
                // endPos.y += 900;
                // tween(cardView.node).to(0.7, { position: endPos },{ easing: 'quadOut' })
                //     .call(()=>{
                //         GameLoader.removeCard(cardView.node);
                //     }).start();
            }
        }
        this.scheduleOnce(()=>{
            GameCtrl.checkTableCardCount();
            this.checkTopJoker();
        }, 0.3);
    }
    public undoBlowCards(blowCards: Card[]) {
        for (const e of blowCards) {
            // const startPos = v3(e.tPos);
            // startPos.y += 900;
            // const endPos = v3(e.tPos);
            const ndCard = GameLoader.addCard(this.node);
            const cardView = ndCard.getComponent(CardView);
            cardView.data = e;
            cardView.vPosition = v3(e.tPos);
            cardView.vAngle = e.tAngle;
            cardView.isFront = true;
            this.setupCard(cardView);
            CardTweens.blowFadeIn(cardView).call(()=>{
            }).start();
            // tween(cardView.node).to(0.7, { position: endPos },{ easing: 'quadOut' })
            //     .call(()=>{
            //         this.setupCard(cardView);
            //     }).start();
        }
        this.updateCards();
        return new Promise<void>((resolve)=>{
            this.scheduleOnce(()=>{
                resolve();
            }, 0.2);
        });
    }
    public insertBoosterJoker(count: number) {
        const allPairs: [CardView,CardView][] = [];
        for (const [cardView,unders] of this.underCardsMap) {
            for (const e of unders) {
                if (e.data.tLayer == cardView.data.tLayer - 1) {
                    allPairs.push([cardView,e]);
                    break;
                }
            }
        }
        console.log('allPairs',allPairs);
        const offsetX = CardView.WIDTH + 10;
        const startX = -(count - 1) / 2 * offsetX;
        for (let i = 0; i < count; i++) {
            const nd = GameLoader.addCard(this.node);
            const cardView = nd.getComponent(CardView);
            cardView.cardValue = CardJoker;
            cardView.type = CardType.table;
            cardView.setAngle(0);
            const idx = XUtils.getRandomInt(0, allPairs.length-1);
            const pair = allPairs.splice(idx,1)[0];
            const e0 = pair[0];
            const e1 = pair[1];
            const pos0 = v3(e0.data.tPos);
            const pos1 = v3(e1.data.tPos);
            const pos = pos0.add(pos1).divide(v3(2,2,1));
            const angle = (e0.data.tAngle + e1.data.tAngle) / 2;
            const card = cardView.data;
            card.tIdx = (e0.data.tIdx + e1.data.tIdx) / 2;
            console.log('e0.data.tIdx',e0.data.tIdx);
            console.log('e1.data.tIdx',e1.data.tIdx);
            console.log('card.tIdx',card.tIdx);
            card.tLayer = (e0.data.tLayer + e1.data.tLayer) / 2;
            // cardView.cardValue = CardJoker;
            cardView.setPos(pos);
            cardView.setAngle(angle);
            cardView.type = CardType.none;
            this.setupInsertJokerCard(cardView);
            const startPos = v3(startX + i * offsetX, 300);
            tween(cardView)
                .set({ vPosition : startPos, vAngle: 0 })
                .delay(0.5)
                .to(0.5, { vPosition : pos, vAngle: angle },{ easing: 'quadOut' })
                .call(()=>{
                    cardView.type = CardType.table;
                    cardView.updateView();
                }).start();
        }
    }
    public removeCard(cardView: CardView) {
        const idx = this.cardViews.indexOf(cardView);
        if (idx >= 0) {
            this.cardViews.splice(idx, 1);
            cardView.node.removeFromParent();
            this.view.unbindCardTouch(cardView);
            console.log('removeCard!!',cardView);
            const underCards = this.underCardsMap.get(cardView);
            if (underCards) {
                this.underCardsMap.delete(cardView);
                for (const e of underCards) {
                    if (e.overlap > 0) {
                        e.overlap --;
                        this.updateCards();
                    }
                }
            }
            return true;
        } else {
            return false;
        }
    }
    /** 所有牌落下去，放弃游戏时的效果 */
    public fallCards(cardViews = this.cardViews) {
        return new Promise<void>(resolve=>{
            const count = cardViews.length;
            if (count == 0) {
                resolve();
                return;
            }
            const tws: Tween[] = [];
            let topLayer = 0;
            for (const e of cardViews) {
                if (e.data.tLayer > topLayer) {
                    topLayer = e.data.tLayer;
                }
            }
            for (let i = 0; i < count; i++) {
                const cardView = cardViews[i];
                Tween.stopAllByTarget(cardView);
                cardView.node.parent = this.view.node;
                const tw = CardTweens.fall(cardView, topLayer - cardView.data.tLayer)
                tw.call(()=>{
                    GameLoader.removeCard(cardView.node);
                }).delay(0.1);
                tws.push(tw);
            }
            tws[count-1].delay(0.6).call(() => {
                resolve();
            })
            for (const e of tws) {
                e.start();
            }
            if (cardViews == this.cardViews) {
                this.cardViews = [];
            }
        })
    }
    public getCardCount() {
        return this.cardViews.length;
    }
    public reset() {
        for (const e of this.cardViews) {
            GameLoader.removeCard(e.node);
        }
        this.cardViews = [];
        this.underCardsMap = new Map();
    }

}