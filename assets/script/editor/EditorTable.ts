import { _decorator, Node, Component, Graphics, Color, Vec3, instantiate, v3, UITransform, EventTouch, v2, Vec2 } from "cc";
import CardView from "../ui/game/CardView";
import GameLoader from "../game/GameLoader";
import { Card, CardType } from "../data/GameObjects";
import { GameGeometry } from "../game/GameGeometry";
import { IEditorLayersListener } from "./EditorLayers";
import { EditorCardBoxs } from "./EditorCardBoxs";
import UIEditor from "./UIEditor";
import { XUtils } from "../comm/XUtils";

const { ccclass, property } = _decorator;

@ccclass('EditorTable')
export class EditorTable extends Component implements IEditorLayersListener {
    view: UIEditor;
    @property(EditorCardBoxs)
    boxs: EditorCardBoxs;
    @property(Node)
    ndRoot: Node;
    private distance = 6; // 牌的距离
    private g: Graphics;
    private meshUnitX: number = 0;
    private meshUnitY: number = 0;
    private drawStartX = 0;
    private drawStartY = 0;
    private cardViews: CardView[] = [];
    // 当前可以编辑的层
    private editableLayer: number = 0;
    // 当前选中的卡牌
    private selCards: CardView[] = [];
    // 当前显示的层
    private visibleLayers: number[] = [];
    // 是否按下ctrl多选
    public isKeyCtrl = false;
    // 按下alt复制
    public isKeyAlt = false
    /**是否对齐网格 */
    public isAlignMesh = false;
    /**操作类型 0移动 1旋转 */
    public touchType: 0|1 = 0;
    protected onLoad(): void {
        this.g = this.getComponent(Graphics);
        this.setCardDistance(this.distance);
        this.initTouch();
    }
    private touchStartPos = v2();
    private isTouchClick = false;
    private isTouchMove = false;
    private initTouch() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
    public onNewCardMove(pos: Vec3) {
        // pos = pos.subtract(this.node.worldPosition);
        // if (!this.isPosInMesh(pos)) {
        //     return;
        // }
        // 原本是计划在这里做个放置位置预览，有时间可以做。
    }
    private isPosInMesh(pos: Vec3) {
        console.log('isPosInMesh',pos.y,this.drawStartY);
        if (Math.abs(pos.x) > Math.abs(this.drawStartX) || Math.abs(pos.y) > Math.abs(this.drawStartY)) {
            return false;
        }
        return true;
    }
    public onNewCardDown(pos: Vec3, bSel = true) {
        pos = pos.subtract(this.node.worldPosition);
        if (!this.isPosInMesh(pos)) {
            return;
        }
        const ndCard = GameLoader.addCard();
        const cardView = ndCard.getComponent(CardView);
        ndCard.parent = this.ndRoot;
        console.log('pos1',pos);
        pos = this.pos2meshPos(pos, this.isAlignMesh);
        cardView.setPos(pos);
        this.setupCard(cardView);
        cardView.isEditor = true;
        if (bSel) {
            this.setSelCards([cardView]);
        }
        return cardView;
    }
    private setupCard(cardView: CardView) {
        // 当setup的牌下面没有其它牌时，layer为1
        // 当setup的牌下面有其它牌，layer=target。layer+1
        // const ndCard = cardView.node;
        const underCards = this.findIntersectCards(cardView);
        cardView.data.tLayer = 1;
        cardView.type = CardType.table;
        for (const e of underCards) {
            if (cardView.data.tLayer <= e.data.tLayer) {
                cardView.data.tLayer = e.data.tLayer + 1;
            }
            e.overlap ++;
            e.updateView();
        }
        this.cardViews.push(cardView);
        // 通过layer和tId重新排序，layer越小越前
        this.cardViews.sort((a,b)=> a.data.tLayer - b.data.tLayer);
        for (let i = 0; i < this.cardViews.length; i++) {
            const e = this.cardViews[i];
            e.node.setSiblingIndex(i);
            e.data.tIdx = i;
        }
        console.log('重新排序后', [...this.cardViews]);
    }
    /**获得所有下层卡 */
    private findIntersectCards(cardView: CardView) {
        const underCards:CardView[] = [];
        for (const e of this.cardViews) {
            if (cardView != e) {
                // const tran = e.getComponent(UITransform);
                const bIntersects = GameGeometry.doCardViewsIntersect(cardView, e);
                if (bIntersects) {
                    underCards.push(e);
                }
            }
        }
        // console.log('findUnderCards', [...underCards]);
        return underCards;
    }
    private findIntersectCardsByCardView(cardView: CardView,bUnder = false) {
        const rect0 = {
            x : cardView.data.tPos.x,
            y : cardView.data.tPos.y,
            width : CardView.WIDTH,
            height : CardView.HEIGHT,
            angle: cardView.data.tAngle || 0
        };
        const underCards:CardView[] = [];
        for (const e of this.cardViews) {
            if (bUnder && e.data.tLayer >= cardView.data.tLayer) {
                continue;
            }
            if (cardView != e) {
                // const tran = e.getComponent(UITransform);
                const rect1 = GameGeometry.card2rect(e.data);
                const bIntersects = GameGeometry.doRectsIntersect(rect0, rect1);
                if (bIntersects) {
                    underCards.push(e);
                }
            }
        }
        // console.log('findUnderCards', [...underCards]);
        return underCards;
    }
    // private findUnderCards(cardView: CardView) {
    //     const intersectCards = this.findIntersectCardsByCardView(cardView);
    //     intersectCards.filter(e => e.data.tLayer < cardView.data.tLayer);
    // }
    private pos2meshPos(pos: Vec3, bAlignMesh: boolean) {
        if (bAlignMesh) {
            let x = pos.x - this.drawStartX;
            let y = pos.y - this.drawStartY;
            const format = (num: number, unit: number) => {
                let mul = num / unit;
                if (mul % 1 > 0.5) {
                    mul = Math.ceil(mul);
                } else {
                    mul = Math.floor(mul);
                }
                return mul * unit;
            }
            x = format(x, this.meshUnitX) + this.drawStartX;
            y = format(y, this.meshUnitY) + this.drawStartY;
            return v3(x,y);
        } else {
            let x = XUtils.numToFixed(pos.x);
            let y = XUtils.numToFixed(pos.y);
            return v3(x,y);
        }
    }

    public setCardDistance(num: number) {
        this.distance = num;
        this.meshUnitX = (CardView.WIDTH + this.distance) / 4;
        this.meshUnitY = (CardView.HEIGHT + this.distance) / 6;
        console.log('meshUnitX',this.meshUnitX,'meshUnitY',this.meshUnitY);
        this.draw();
    }

    /**保存关卡数据时调用 */
    public getCards() {
        const datas:Card[] = [];
        for (const v of this.cardViews) {
            datas.push(v.saveEditorData());
        }
        datas.sort((a,b)=>a.tLayer - b.tLayer);
        for (let i = 0; i < datas.length; i++) {
            const e = datas[i];
            e.tIdx = i;
        }
        console.log('getCards',datas);
        return datas;
    }

    private draw() {
        const lineCountX = Math.ceil(((750 - CardView.WIDTH) / 2)/ this.meshUnitX) * 2 -1;
        console.log('lineCountX',lineCountX);
        const lineCountY = Math.ceil(((750 - CardView.HEIGHT) / 2)/ this.meshUnitY) * 2 -1;
        console.log('lineCountY',lineCountY);
        const startX = -(lineCountX - 1) / 2 * this.meshUnitX;
        const startY = -(lineCountY - 1) / 2 * this.meshUnitY;
        this.drawStartX = startX;
        this.drawStartY = startY;
        console.log('startX',startX,'startY',startY);
        const g = this.g;
        const color0 = new Color(0x33,0x33,0x33);
        const color1 = new Color(0x55,0x55,0x55);
        g.lineWidth = 4;
        
        // 先绘制横线
        for (let i = 0; i < lineCountX; i++) {
            const y = startY + i * this.meshUnitY;
            g.moveTo(startX, y);
            g.lineTo(-startX, y);
            g.strokeColor = i == (lineCountX-1) / 2 ? color1 : color0;
            g.stroke();
        }
        // 再绘制竖线
        for (let i = 0; i < lineCountY; i++) {
            const x = startX + i * this.meshUnitX;
            g.moveTo(x, startY);
            g.lineTo(x, -startY);
            g.strokeColor = i == (lineCountY-1) / 2 ? color1 : color0;
            g.stroke();
        }
    }
    
    onEditableLayer(layerId: number): void {
        console.log('onEditableLayer',layerId);
        this.editableLayer = layerId;
        this.setSelCards([]);
    }
    onVisbibleLayers(ids: number[]): void {
        console.log('onVisbibleLayers',ids);
        this.visibleLayers = [...ids];
        // 更新cards的隐藏显示
        for (const card of this.cardViews) {
            if (ids.length == 0) {
                card.node.active = true;
            } else {
                card.node.active = ids.indexOf(card.data.tLayer) != -1;
            }
        }
        this.setSelCards([]);
    }
    private onTouchStart(e: EventTouch) {
        console.log('onTouchStart');
        const pos = e.getUILocation();
        if (this.isKeyCtrl) {
            // 选中/取消选中 当前pos的card
            const targetCard = this.getTargetCard(pos);
            if (targetCard) {
                const idx = this.selCards.indexOf(targetCard);
                if (idx == -1) {
                    this.selCards.push(targetCard);
                } else {
                    this.selCards.splice(idx,1);
                }
                this.setSelCards();
            }
            return;
        }
        this.touchStartPos = pos;
        if (this.selCards?.length > 0) {
            for (const e of this.selCards) {
                const posLoc = v2(pos).subtract(this.node.worldPosition.toVec2());
                console.log('posLoc',posLoc);
                const bool = GameGeometry.isPointInRect([posLoc.x,posLoc.y],e.getRect());
                console.log('isPointInRect',posLoc,e.getRect(),bool);
                if (bool) {
                    this.isTouchMove = true;
                    return;
                }
                // const rect = e.getComponent(UITransform).getBoundingBoxToWorld();
                // if (rect.contains(pos)) {
                //     this.isTouchMove = true;
                //     return;
                // }
            }
        }
        this.isTouchClick = true;
    }
    private _copyCardsStr = '';
    // 复制选中
    public ctrlC() {
        if (this.selCards.length == 0) {
            this._copyCardsStr = '';
            return;
        }
        const datas = this.selCards.map(e=>e.data);
        datas.sort((a,b)=>a.tLayer - b.tLayer);
        const str = JSON.stringify(datas);
        this._copyCardsStr = str;
    }
    public ctrlV() {
        if (!this._copyCardsStr) {
            return;
        }
        const oriCards:Card[] = JSON.parse(this._copyCardsStr);
        let newCards: CardView[] = [];
        for (const e of oriCards) {
            const card:Card = JSON.parse(JSON.stringify(e));
            // 往右下角移动10
            card.tPos.x += 10;
            card.tPos.y -= 10;
            // 要判断是否超出，超出就用最大值
            const ndCard = GameLoader.addCard();
            const cardView = ndCard.getComponent(CardView);
            cardView.data = card;
            ndCard.parent = this.ndRoot;
            cardView.setPos(v3(card.tPos));
            cardView.setAngle(card.tAngle);
            cardView.isEditor = true;
            cardView.updateView();
            newCards.push(cardView);
            this.cardViews.push(cardView);
        }
        this.refreshOverlap();
        this.setSelCards(newCards);
        this.ctrlC();
    }
    public ctrlD() { // 镜像复制
        const datas = this.selCards.map(e=>e.data);
        datas.sort((a,b)=>a.tLayer - b.tLayer);
        const oriCards:Card[] = JSON.parse(JSON.stringify(datas));
        let newCards: CardView[] = [];
        for (const e of oriCards) {
            const card:Card = JSON.parse(JSON.stringify(e));
            // 往右下角移动10
            card.tPos.x = -card.tPos.x;
            card.tAngle = -card.tAngle;
            const ndCard = GameLoader.addCard();
            const cardView = ndCard.getComponent(CardView);
            cardView.data = card;
            ndCard.parent = this.ndRoot;
            cardView.setPos(v3(card.tPos));
            cardView.setAngle(card.tAngle);
            cardView.isEditor = true;
            cardView.updateView();
            newCards.push(cardView);
            this.cardViews.push(cardView);
        }
        this.refreshOverlap();
        this.setSelCards(newCards);

    }
    private onTouchMove(e: EventTouch) {
        if (this.touchStartPos) {
            const p0 = v2(this.touchStartPos);
            const pos = e.getUILocation();
            const diffX = pos.x - p0.x;
            const diffY = pos.y - p0.y;
            // console.log('diffX',diffX,this.isTouchClick);
            // console.log('diffY',diffY,this.isTouchMove);
            if (this.isTouchClick && (Math.abs(diffX) > 10 || Math.abs(diffY) > 10)) {
                this.isTouchClick = false;
            } else if (this.isTouchMove) {
                if (this.touchType == 0) {
                    for (const e of this.selCards) {
                            const cardPos = v3(e.data.tPos);
                            cardPos.x += diffX;
                            cardPos.y += diffY;
                            e.node.setPosition(cardPos);
                            // console.log('cardPos',cardPos.x,cardPos.y);
                            
                    }
                } else if (this.touchType == 1) {
                    // 先计算弧度
                    const targetCard = this.selCards[this.selCards.length-1];
                    const targetPos = targetCard.vWorldPosition.toVec2();
                    let pos0 = p0.subtract(targetPos);
                    let pos1 = pos.subtract(targetPos);
                    // console.log('pos0',pos0.x,pos0.y);
                    // console.log('pos1',pos1.x,pos1.y);
                    let radian0 = Math.atan2(pos0.x,pos0.y);
                    let radian1 = Math.atan2(pos1.x,pos1.y);
                    let radianDiff = radian1 - radian0;
                    let angleDiff = radianDiff * (180 / Math.PI);
                    for (const e of this.selCards) {
                            const angle = e.data.tAngle || 0;
                            e.vAngle = XUtils.numToFixed(angle - angleDiff);
                            
                    }
                }
            }
        }
    }
    private onTouchEnd(e: EventTouch) {
        console.log('onTouchEnd');
        if (!this.touchStartPos) {
            return;
        }
        this.touchStartPos = null;
        const pos = e.getUILocation();
        if (this.isTouchClick) {
            const targetCard = this.getTargetCard(pos);
            // console.log('clickCard',clickCard);
            this.setSelCards(targetCard ? [targetCard] : []);
        } else if (this.isTouchMove) {
            if (this.touchType == 0) {
                let isInMesh = true;
                for (const e of this.selCards) {
                    const bool = this.isPosInMesh(e.node.position);
                    console.log('bool',bool);
                    if (!bool) {
                        isInMesh = false;
                        break;
                    }
                }
                if (isInMesh) {
                    for (const e of this.selCards) {
                        // this.onMoveCardBefore(e);
                        const meshPos = this.pos2meshPos(e.node.position, this.isAlignMesh);
                        e.setPos(meshPos);
                        // this.onMoveCardAfter(e);
                    }
                    this.refreshOverlap();
                } else {
                    for (const e of this.selCards) {
                        e.node.setPosition(e.data.tPos);
                    }
                }
            } else if (this.touchType == 1) {
                for (const e of this.selCards) {
                    e.data.tAngle = e.vAngle;
                }
                this.refreshOverlap();
            }
            this.setSelCards();
        }
        this.isTouchClick = false;
        this.isTouchMove = false;
    }
    private getTargetCard(worldPos: Vec2) {
        const pos = v2(worldPos).subtract(this.node.worldPosition.toVec2());
        let targetCard: CardView = null;
        const len = this.cardViews.length
        for (let i = len - 1; i >= 0; i--) {
            const cardView = this.cardViews[i];
            if (this.isCanEditCard(cardView)) {
                const bool = GameGeometry.isPointInRect([pos.x,pos.y],cardView.getRect());
                if (bool) {
                    if (!targetCard || targetCard.data.tLayer < cardView.data.tLayer) {
                        targetCard = cardView;
                    }
                }
            }
        }
        return targetCard;
    }
    private setSelCards(cards: CardView[] = this.selCards) {
        this.selCards = [...cards];
        this.boxs.drawSelCardBoxs(this.selCards);
        this.view.onSelCards(this.selCards);
    }
    private isCanEditCard(cardView: CardView) {
        if (!cardView.node.active) {
            return false;
        }
        if (this.editableLayer != 0 && cardView.data.tLayer != this.editableLayer) {
            return false;
        }
        return true;
    }
    public removeSelCards() {
        for (const e of this.selCards) {
            // this.onMoveCardBefore(e);
            const idx = this.cardViews.indexOf(e);
            if (idx >= 0) {
                this.cardViews.splice(idx,1);
                GameLoader.removeCard(e.node);
            }
        }
        this.setSelCards([]);
        this.refreshOverlap();
    }
    public selectAll() {
        console.log('selectAll');
        this.setSelCards([...this.cardViews]);
    }
    public clearCards() {
        this.setSelCards([]);
        for (const e of this.cardViews) {
            GameLoader.removeCard(e.node);
        }
        this.cardViews.length = 0;
    }
    public resume(cards: Card[]) {
        this.clearCards();
        cards.sort((a,b)=>a.tLayer-b.tLayer);
        for (const e of cards) {
            const ndCard = GameLoader.addCard();
            const cardView = ndCard.getComponent(CardView);
            cardView.data = e;
            cardView._bFront = true;
            ndCard.parent = this.ndRoot;
            cardView.setPos(e.tPos);
            cardView.vAngle = e.tAngle||0;
            // this.setupCard(cardView);
            cardView.isEditor = true;
            this.cardViews.push(cardView);
        }
        this.refreshOverlap();
    }

    public setCardPosition(cardView: CardView, pos: Vec3) {
        if (!this.isPosInMesh(pos)) {
            return false;
        }
        cardView.setPos(pos);
        this.refreshOverlap();
        this.setSelCards();
        return true;
    }

    public setCardAngel(cardView: CardView, angel: number) {
        cardView.setAngle(angel);
        this.refreshOverlap();
        this.setSelCards();
        return true;
    }
    public setCardLayer(cardView: CardView, layer: number) {
        cardView.data.tLayer = layer;
        this.refreshOverlap();
    }
    private refreshOverlap() {
        // layer从小到大排序
        // 然后遍历所有牌，检查有多少底下的牌，设置overlap
        this.cardViews.sort((a,b)=>a.data.tLayer-b.data.tLayer);
        for (let i = 0; i < this.cardViews.length; i++) {
            const e = this.cardViews[i];
            e.data.tIdx = i;
            e.overlap = 0;
            e.node.setSiblingIndex(i);
            const unders = this.findIntersectCardsByCardView(e,true)
            for (const e1 of unders) {
                e1.overlap ++;
            }
        }
        for (const e of this.cardViews) {
            e.updateView();
        }
    }
}