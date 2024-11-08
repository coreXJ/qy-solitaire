import { _decorator, Color, Component, Sprite } from "cc";
import { Card, CardType } from "../../data/GameObjects";
import GameLoader from "../../game/GameLoader";
const { ccclass, property } = _decorator;

const COLOR_NONE = new Color(0xff,0xff,0xff);
const COLOR_OVERLAP = new Color(0x99,0x99,0x99);

@ccclass('CardView')
export default class CardView extends Component {
    public static WIDTH = 96;
    public static HEIGHT = 144;
    @property(Sprite)
    spCard: Sprite = null;
    private _data: Card;
    private _bFront: boolean = false;

    /**被重叠计数，table下有用 */
    public overlap = 0;
    /**被覆盖的牌 */
    public underCards: CardView[] = [];
    public set isFront(bool: boolean) {
        this._bFront = bool;
        this.updateView();
    }

    public get cardValue(): number {
        return this._data?.value || 0;
    }
    public get cardType(): CardType {
        return this._data?.type || CardType.none;
    }
    public set data(data: Card) {
        this._data = data;
        this.updateView();
    }
    public get data() {
        return this._data;
    }
    public updateView() {
        const cardValue = this._bFront ? this.cardValue : 0;
        GameLoader.setCardFrame(this.spCard, cardValue);
        this.spCard.color = COLOR_NONE;
        if (this.cardType == CardType.table) {
            if (this.overlap) {
                this.spCard.color = COLOR_OVERLAP;
            }
        }
    }
    public animFront() {
        // 翻到正面的动画
    }
    public animBack() {
        // 翻到正面的动画
    }

    public reset() {
        this.overlap = 0;
        this.isFront = false;
        this._data = null;
    }

}