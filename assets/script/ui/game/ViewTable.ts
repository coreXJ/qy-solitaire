import { _decorator, Component, Intersection2D, tween, UITransform } from "cc";
import GameLoader from "../../game/GameLoader";
import { Card } from "../../data/GameObjects";
import CardView from "./CardView";
import UIGame from "./UIGame";
import { XUtils } from "../../comm/XUtils";
import GameCtrl from "../../game/GameCtrl";
import { GameGeometry } from "../../game/GameGeometry";
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
        const cardViews:CardView[] = [];
        for (const card of cards) {
            const ndCard = GameLoader.addCard()
            ndCard.parent = this.node;
            const cardView = ndCard.getComponent(CardView);
            cardView.data = card;
            ndCard.position = card.tPos;
            ndCard.angle = card.tAngle;
            cardViews.push(cardView);
        }
        // 当动画结束后
        // 先setup所有牌
        for (const v of cardViews) {
            this.setupCard(v);
        }
        this.updateCards();
    }
    
    public undoCard(cardView: CardView) {
        cardView.node.parent = this.node;
        tween(cardView.node).to(0.3, { position: cardView.data.tPos },{ easing: 'quadOut' })
            .call(()=>{
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
        console.log('setupCard', cardView);
        const underCards = this.findUnderCards(cardView);
        console.log('underCards', underCards);
        for (const e of underCards) {
            e.overlap ++;
            e.updateView();
        }
        this.cardViews.push(cardView);
        this.underCardsMap.set(cardView, underCards);
        XUtils.bindClick(cardView.node, this.onClickCard.bind(this,cardView));
    }

    private onClickCard(cardView: CardView) {
        console.log('onCardClick',cardView);
        if (this.cardViews.indexOf(cardView) == -1) {
            return;
        }
        if (cardView.overlap == 0) {
            GameCtrl.linkTable(cardView);
        }
    }

    /**获得所有下层卡 */
    private findUnderCards(cardView: CardView) {
        const trans = cardView.getComponent(UITransform);
        // const rect0 = {
        //     x : cardView.node.position.x,
        //     y : cardView.node.position.y,
        //     width : trans.width,
        //     height : trans.height,
        //     angle:cardView.node.angle};
        const underCards:CardView[] = [];
        for (const e of this.cardViews) {
            if (cardView != e) {
                const tran = e.getComponent(UITransform);
                const rect1 = {
                    x : e.node.position.x,
                    y : e.node.position.y,
                    width : tran.width,
                    height : tran.height,
                    angle:e.node.angle
                };
                // const bIntersects = GameGeometry.doRectsIntersect(rect0, rect1);
                const bIntersects = GameGeometry.doNodesIntersect(cardView.node, e.node);
                // console.log("doRectsIntersect",bIntersects,rect0,rect1);
                if (bIntersects && e.data.tIdx < cardView.data.tIdx) {
                    underCards.push(e);
                }
            }
        }
        // console.log('findUnderCards', [...underCards]);
        return underCards;
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

    public removeCard(cardView: CardView) {
        const idx = this.cardViews.indexOf(cardView);
        if (idx >= 0) {
            this.cardViews.splice(idx, 1);
            cardView.node.removeFromParent();
            XUtils.unbindClick(cardView.node);
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

    public getCardCount() {
        return this.cardViews.length;
    }

}