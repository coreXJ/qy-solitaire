import { _decorator, Node, Component, Graphics, Color, Vec3, instantiate, v3, UITransform, EventTouch, v2, Vec2 } from "cc";
import CardView from "../ui/game/CardView";
import GameLoader from "../game/GameLoader";
import { Card, CardType } from "../data/GameObjects";
import { GameGeometry } from "../game/GameGeometry";
import { IEditorLayersListener } from "./EditorLayers";
import { EditorCardBoxs } from "./EditorCardBoxs";

const { ccclass, property } = _decorator;

@ccclass('EditorTable')
export class EditorTable extends Component implements IEditorLayersListener {

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
    public isMultipleMode = false;

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
        pos = pos.subtract(this.node.worldPosition);
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
    public onNewCardDown(pos: Vec3) {
        pos = pos.subtract(this.node.worldPosition);
        if (!this.isPosInMesh(pos)) {
            return;
        }
        const ndCard = GameLoader.addCard();
        const cardView = ndCard.getComponent(CardView);
        ndCard.parent = this.ndRoot;
        console.log('pos1',pos);
        pos = this.pos2meshPos(pos);
        console.log('pos2',pos);
        ndCard.setPosition(pos);
        cardView.data.tPos = pos;
        this.setupCard(cardView);
        cardView.isEditor = true;
        
    }
    private setupCard(cardView: CardView) {
        // 当setup的牌下面没有其它牌时，layer为1
        // 当setup的牌下面有其它牌，layer=target。layer+1
        const ndCard = cardView.node;
        const underCards = this.findUnderCards(ndCard);
        cardView.data.tLayer = 1;
        cardView.data.type = CardType.table;
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
        }
        console.log('重新排序后', [...this.cardViews]);
    }
    /**获得所有下层卡 */
    private findUnderCards(ndCard: Node) {
        const underCards:CardView[] = [];
        for (const e of this.cardViews) {
            if (ndCard != e.node) {
                const tran = e.getComponent(UITransform);
                const bIntersects = GameGeometry.doNodesIntersect(ndCard, e.node);
                if (bIntersects) {
                    underCards.push(e);
                }
            }
        }
        // console.log('findUnderCards', [...underCards]);
        return underCards;
    }
    private findUnderCardsByCardView(cardView: CardView) {
        const rect0 = {
            x : cardView.data.tPos.x,
            y : cardView.data.tPos.y,
            width : CardView.WIDTH,
            height : CardView.HEIGHT,
            angle: cardView.data.tAngle || 0
        };
        const underCards:CardView[] = [];
        for (const e of this.cardViews) {
            if (cardView != e) {
                // const tran = e.getComponent(UITransform);
                const rect1 = GameGeometry.node2rect(e.node);
                const bIntersects = GameGeometry.doRectsIntersect(rect0, rect1);
                if (bIntersects) {
                    underCards.push(e);
                }
            }
        }
        // console.log('findUnderCards', [...underCards]);
        return underCards;
    }
    private pos2meshPos(pos: Vec3) {
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
        if (this.isMultipleMode) {
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
                const rect = e.getComponent(UITransform).getBoundingBoxToWorld();
                if (rect.contains(pos)) {
                    this.isTouchMove = true;
                    return;
                }
            }
        }
        this.isTouchClick = true;
    }
    private onTouchMove(e: EventTouch) {
        if (this.touchStartPos) {
            const p0 = this.touchStartPos;
            const pos = e.getUILocation();
            const diffX = pos.x - p0.x;
            const diffY = pos.y - p0.y;
            console.log('diffX',diffX,this.isTouchClick);
            console.log('diffY',diffY,this.isTouchMove);
            if (this.isTouchClick && (Math.abs(diffX) > 10 || Math.abs(diffY) > 10)) {
                this.isTouchClick = false;
            } else if (this.isTouchMove) {
                console.log('this.selCards',this.selCards.length);
                for (const e of this.selCards) {
                    const cardPos = v3(e.data.tPos);
                    cardPos.x += diffX;
                    cardPos.y += diffY;
                    e.node.setPosition(cardPos);
                    console.log('cardPos',cardPos.x,cardPos.y);
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
                    this.onMoveCardBefore(e);
                    const meshPos = this.pos2meshPos(e.node.position);
                    e.data.tPos = meshPos;
                    e.node.setPosition(meshPos);
                    this.onMoveCardAfter(e);
                }
            } else {
                for (const e of this.selCards) {
                    e.node.setPosition(e.data.tPos);
                }
            }
            this.setSelCards();
        }
        this.isTouchClick = false;
        this.isTouchMove = false;
    }
    private getTargetCard(pos: Vec2) {
        let targetCard: CardView = null;
        for (const cardView of this.cardViews) {
            if (this.isCanEditCard(cardView)) {
                const rect = cardView.getComponent(UITransform).getBoundingBoxToWorld();
                if (rect.contains(pos)) {
                    if (!targetCard || targetCard.data.tLayer < cardView.data.tLayer) {
                        targetCard = cardView;
                    }
                }
            }
        }
        return targetCard;
    }
    private onMoveCardBefore(cardView: CardView) {
        console.log('onMoveCardBefore',{...cardView.data.tPos});
        // 将压在下面的card overlap--
        const cards = this.findUnderCardsByCardView(cardView);
        console.log('underCards',cards);
        for (const e of cards) {
            if (e.data.tLayer < cardView.data.tLayer) {
                e.overlap = Math.max(0, e.overlap-1);
                e.updateView();
            }
        }
    }
    private onMoveCardAfter(cardView: CardView) {
        // 将压在下面的card overlap++
        cardView.overlap = 0;
        const cards = this.findUnderCards(cardView.node);
        for (const e of cards) {
            if (e.data.tLayer < cardView.data.tLayer) {
                e.overlap++;
                e.updateView();
            } else if (e.data.tLayer > cardView.data.tLayer) {
                cardView.overlap++;
            }
        }
        cardView.updateView();
    }
    private setSelCards(cards: CardView[] = this.selCards) {
        this.selCards = [...cards];
        this.boxs.drawSelCardBoxs(this.selCards);
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
            this.onMoveCardBefore(e);
            const idx = this.cardViews.indexOf(e);
            if (idx >= 0) {
                this.cardViews.splice(idx,1);
                GameLoader.removeCard(e.node);
            }
        }
        this.setSelCards([]);
    }
    public selectAll() {
        console.log('selectAll');
        this.setSelCards([...this.cardViews]);
    }
}