import { _decorator, Color, Component,Label,Node, Sprite, v3, Vec3 } from "cc";
import { Card, CardType } from "../../data/GameObjects";
import GameLoader from "../../game/GameLoader";
import { GameGeometry } from "../../game/GameGeometry";
const { ccclass, property } = _decorator;

const COLOR_NONE = new Color(0xff,0xff,0xff);
const COLOR_OVERLAP = new Color(0x99,0x99,0x99);

@ccclass('CardView')
export default class CardView extends Component {
    public static WIDTH = 96;
    public static HEIGHT = 144;
    @property(Sprite)
    spCard: Sprite = null;
    @property(Node)
    ndEditor: Node = null;
    private _data: Card;
    public _bFront: boolean = false;

    private _bEditor: boolean = false;

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
    public set cardValue(value: number) {
        this.data.value = value;
        this.updateView();
    }
    public set data(data: Card) {
        this._data = data;
        this.updateView();
    }
    public get data() {
        this.initData();
        return this._data;
    }
    public set isEditor(bool: boolean) {
        this._bEditor = bool;
        this.updateView();
    }

    protected onLoad(): void {
        this.initData();
    }
    private initData() {
        if (!this._data) {
            const data = new Card();
            data.type = CardType.none;
            data.value = 0;
            data.tAngle = 0;
            data.tPos = v3();
            this._data = data;
        }
    }

    public updateView() {
        if (this.cardValue >= 0x40) {
            this._bFront = true;
        }
        const cardValue = this._bFront ? this.cardValue : 0;
        GameLoader.setCardFrame(this.spCard, cardValue);
        this.spCard.color = COLOR_NONE;
        if (this.cardType == CardType.table) {
            if (this.overlap) {
                this.spCard.color = COLOR_OVERLAP;
            }
        }
        this.ndEditor.active = this._bEditor;
        if (this._bEditor) {
            this.ndEditor.getChildByName('lbLayer').getComponent(Label).string = '' + (this.data.tLayer||0);
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
        this._bEditor = false;
    }

    public saveEditorData() {
        // 把当前坐标和角度赋值到cardData中
        const data = this.data;
        data.tPos = v3(this.node.position);
        data.tAngle = this.node.angle;
        return data;
    }

    public getRect():GameGeometry.GameRect {
        return {
            x: this.data.tPos?.x || 0,
            y: this.data.tPos?.y || 0,
            width: CardView.WIDTH,
            height: CardView.HEIGHT,
            angle: this.data.tAngle || 0,
        }
    }

    public setPos(pos: Vec3) {
        this.node.position = pos;
        this.data.tPos = v3(pos);
    }
}