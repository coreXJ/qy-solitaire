// EdirotPopSelectCard
import { _decorator, Component, Node, ScrollView, UITransform } from "cc";
import CardView from "../ui/game/CardView";
import { XUtils } from "../comm/XUtils";
import GameLoader from "../game/GameLoader";
import { CardType } from "../data/GameObjects";
const { ccclass, property } = _decorator;

@ccclass('EdirotPopSelectCard')
export class EdirotPopSelectCard extends Component {

    @property(ScrollView)
    scrollView: ScrollView;
    @property(CardView)
    targetCardView: CardView;
    private _callback: (cardValue: number) => void;
    
    protected start(): void {
        console.log('EdirotPopSelectCard start');
        // 填充sv的所有卡
        const btnCancel = this.node.getChildByPath('content/btnCancel');
        XUtils.bindClick(btnCancel, this.onClickCancel, this);
        const btnConfirm = this.node.getChildByPath('content/btnConfirm');
        XUtils.bindClick(btnConfirm, this.onClickConfirm, this);
        this.fullCards();
    }

    public show(currentCard?: number, callback?: (cardValue: number) => void) {
        this._callback = callback;
        this.node.active = true;
        this.targetCardView.isFront = true;
        this.targetCardView.cardValue = currentCard || 0;
    }

    private onClickCancel() {
        this.node.active = false;
    }

    private onClickConfirm() {
        this.node.active = false;
        this._callback && this._callback(this.targetCardView.cardValue);
    }
    
    private fullCards() {
        console.log('fullCards');
        const tran = this.scrollView.content.getComponent(UITransform);
        const itemWidth = 120;
        const itemHeight = 168;
        const col = 5;
        tran.height = 4 * itemHeight * 3 + itemHeight;
        const startX = -(col - 1) / 2 * itemWidth;
        const bindCard = (nd: Node, cardValue: number) => {
            const cardView = nd.getComponent(CardView);
            cardView.type = CardType.none;
            cardView.cardValue = cardValue;
            cardView.isFront = true;
            XUtils.bindClick(nd, () => {
                console.log('click cardValue: ' + cardView.cardValue);
                this.targetCardView.cardValue = cardView.cardValue;
            });
        }
        // 添加卡背
        const nd = GameLoader.addCard(this.scrollView.content);
        nd.setPosition(startX, -itemHeight / 2);
        bindCard(nd, 0);
        for (let i = 0; i < 4; i++) {
            let startY = -itemHeight / 2 - i * itemHeight * 3 - itemHeight;
            for (let j = 0; j < 0x0D; j++) {
                const x = startX + (j % col) * itemWidth;
                const nd = GameLoader.addCard(this.scrollView.content);
                nd.setPosition(x,startY - Math.floor(j / col) * itemHeight);
                bindCard(nd, (j + 1) + i * 0x10);
                
            }
        }
    }
}