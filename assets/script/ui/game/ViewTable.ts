import { _decorator, Component, UITransform } from "cc";
import GameLoader from "../../game/GameLoader";
import { Card } from "../../data/GameObjects";
import CardView from "./CardView";
import UIGame from "./UIGame";
import { XUtils } from "../../comm/XUtils";
import GameCtrl from "../../game/GameCtrl";
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
            ndCard.eulerAngles = card.tAngle;
            cardViews.push(cardView);
        }
        // 当动画结束后
        // 先setup所有牌
        for (const v of cardViews) {
            this.setupCard(v);
        }
        this.updateCards();
    }

    private updateCards() {
        for (const v of this.cardViews) {
            v.isFront = v.overlap == 0;
        }
    }

    private setupCard(cardView: CardView) {
        // console.log('setupCard', cardView);
        const underCards = this.findUnderCards(cardView);
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
        const box = cardView.getComponent(UITransform).getBoundingBox();
        const underCards:CardView[] = [];
        for (const e of this.cardViews) {
            const tran = e.getComponent(UITransform);
            const box1 = tran.getBoundingBox();
            const bIntersects = box.intersects(box1);
            if (bIntersects && e.data.tIdx < cardView.data.tIdx) {
                underCards.push(e);
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