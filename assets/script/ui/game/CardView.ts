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
    private spCard: Sprite = null;
    @property(Node)
    private ndShadow: Node = null;
    @property(Node)
    private ndEditor: Node = null;
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
        this.vAngle = 0;
        this.z = 0;
        this.overlap = 0;
        this.isFront = false;
        this._data = null;
        this._bEditor = false;
    }

    public saveEditorData() {
        // 把当前坐标和角度赋值到cardData中
        const data = this.data;
        data.tPos = v3(this.vPosition);
        data.tAngle = this.vAngle;
        return data;
    }

    public getRect():GameGeometry.IRect {
        return {
            x: this.data.tPos?.x || 0,
            y: this.data.tPos?.y || 0,
            width: CardView.WIDTH,
            height: CardView.HEIGHT,
            angle: this.data.tAngle || 0,
        }
    }

    public setPos(pos: Vec3) {
        // this.node.position = pos;
        this.vPosition = pos;
        this.data.tPos = v3(pos);
    }

    public setAngle(angle: number) {
        // this.node.angle = angle;
        this.vAngle = angle;
        this.data.tAngle = angle;
    }

    //=======CardView需要接管node的一些参数，v开头的不会影响data=======
    private _dirty: boolean;
    private _vAngle: number;
    private _z: number;
    public set vAngle(angle: number) {
        this._vAngle = angle;
        this._dirty = true;
        this.updateDirty();
    }
    public get vAngle() {
        return this._vAngle || 0;
    }
    public set vPosition(pos: Vec3) {
        let z0 = this.node.position.z;
        let z1 = pos.z;
        this.node.setPosition(pos);
        if (z0 != z1) {
            this.z = z1;
        }
    }
    public get vPosition() {
        return this.node.position;
    }
    public set vWorldPosition(pos: Vec3) {
        let z0 = this.node.worldPosition.z;
        let z1 = pos.z;
        this.node.setWorldPosition(pos);
        if (z0 != z1) {
            this.z = z1;
        }
    }
    public get vWorldPosition() {
        return this.node.getWorldPosition();
    }
    public set z(z: number) {
        this._z = z;
        this.vPosition.z = z;
        this._dirty = true;
        this.updateDirty();
    }
    public get z() {
        return this._z || 0;
    }
    protected update(dt: number): void {
        this.updateDirty();
    }
    public updateDirty() {
        if (this._dirty) {
            const nd0 = this.spCard.node;
            const nd1 = this.ndShadow;
            this._dirty = false;
            const z = this.z;
            const scale = 1 + z;
            nd0.angle = this.vAngle;
            nd0.scale = v3(scale,scale,1);
            if (z > 0) {
                // 显示shadow
                nd1.active = true;
                const x = CardView.WIDTH * 3 * z;
                const y = -CardView.HEIGHT * 1.1 * z;
                nd1.setPosition(x,y);
                const scale1 = scale * 1.2;
                nd1.scale = v3(scale1,scale1,1);
                nd1.angle = this.vAngle;
            } else {
                // 隐藏shadow
                nd1.active = false;
            }
        }
    }
}