import { _decorator, Component, Label, Node, tween, Tween, v3, Vec3 } from "cc";
import GameLoader from "../../game/GameLoader";
import { Card, CardType } from "../../data/GameObjects";
import CardView from "./CardView";
import GameLogic from "../../game/GameLogic";
import UIGame from "./UIGame";
import { XUtils } from "../../comm/XUtils";
import GameCtrl from "../../game/GameCtrl";
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

    protected onLoad(): void {
        this.btnEndGame.active = false;
        this.ndPropAdd.active = false;
    }

    protected start(): void {
        console.log('ViewHand start');
        XUtils.bindClick(this.btnEndGame, this.onClickEndGame, this);
    }

    public get topHandCardValue() {
        return this.handCards[this.handCards.length-1]?.cardValue || -10000;
    }
    
    public dealCards(poolCount: number, handCardValue: number) {
        console.log('ViewHand dealCards', poolCount,handCardValue);
        // 先发pool牌 
        for (let i = 0; i < poolCount + 1; i++) {
            this.addPoolCardView();
        }
        // 再翻一张hand牌
        this.scheduleOnce(() => {
            handCardValue = handCardValue || GameCtrl.getFirstCardValue();
            this.drawPoolCard(handCardValue);
        }, 0.7);
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
        XUtils.bindClick(cardView.node, this.onClickPoolCard, this, cardView);
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
            this.addHandCard(cardView, wpos);
        }
    }

    public addHandCard(cardView: CardView, fromWorldPosition?: Vec3) {
        cardView.node.parent = this.ndHandRoot;
        if (fromWorldPosition) {
            cardView.node.worldPosition = fromWorldPosition;
        }
        this.handCards.push(cardView);
        tween(cardView.node).to(0.3, { position: v3(0,0) },{ easing: 'quadOut' })
            .delay(0.2)
            .call(()=>{
                cardView.isFront = true;
            }).start();
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
            this.checkPoolEmpty();
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
        tween(cardView.node).to(0.3, { position: v3(0,0) },{ easing: 'quadOut' })
            .delay(0.2)
            .call(()=>{
                // cardView.isFront = true;
            }).start();
    }

    private onClickPoolCard(cardView: CardView) {
        const idx = this.poolCards.indexOf(cardView);
        if (idx == -1 || idx < this.poolCards.length - 1) {
            return;
        }
        console.log('onClickHandCard', cardView);
        GameCtrl.drawPool();
    }

    /**用tween缓动把poolCard移到自己的位置 */
    private tweenMovePoolCards() {
        const len = this.poolCards.length;
        const startX = -CardView.WIDTH * 0.5;
        for (let i = 0; i < len; i++) {
            const nd = this.poolCards[i].node;
            const num = Math.min(len - i, POOL_VISIBLE_CARD_COUNT) - 1;
            const x = startX + num * POOL_OFFSET_X;
            Tween.stopAllByTarget(nd);
            tween(nd).to(0.5, { position: v3(x, 0, 0) }, { easing: 'quadOut' }).start();
        }
        // 检查ndExtraNum是否大于0
        const bExtra = len > POOL_VISIBLE_CARD_COUNT;
        this.ndExtraNum.active = bExtra;
        const lb = this.ndExtraNum.getComponentInChildren(Label);
        lb.string = '+' + (len - POOL_VISIBLE_CARD_COUNT);
    }

    private checkPoolEmpty() {
        const len = this.poolCards.length;
        const bEmpty = len == 0;
        this.btnEndGame.active = bEmpty;
        this.ndPropAdd.active = bEmpty;
    }

    private onClickEndGame() {
        GameCtrl.onGameEnd(false);
    }
}