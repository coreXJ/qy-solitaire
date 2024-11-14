import { _decorator, Node, Component, Graphics, Color, Vec3, instantiate, v3, UITransform } from "cc";
import CardView from "../ui/game/CardView";
import GameLoader from "../game/GameLoader";
import { Card, CardType } from "../data/GameObjects";
import { GameGeometry } from "../game/GameGeometry";

const { ccclass, property } = _decorator;

@ccclass('EditorTable')
export class EditorTable extends Component {
    private distance = 6; // 牌的距离
    private g: Graphics;
    private meshUnitX: number = 0;
    private meshUnitY: number = 0;
    private drawStartX = 0;
    private drawStartY = 0;
    private cardViews: CardView[] = [];

    protected onLoad(): void {
        this.g = this.getComponent(Graphics);
        this.setCardDistance(this.distance);
    }

    public onNewCardMove(pos: Vec3) {
        pos = pos.subtract(this.node.worldPosition);
        if (Math.abs(pos.x) > Math.abs(this.drawStartX) || Math.abs(pos.y) > Math.abs(this.drawStartY)) {
            return;
        }
        // 原本是计划在这里做个放置位置预览，有时间可以做。
    }

    public onNewCardDown(pos: Vec3) {
        pos = pos.subtract(this.node.worldPosition);
        if (Math.abs(pos.x) > Math.abs(this.drawStartX) || Math.abs(pos.y) > Math.abs(this.drawStartY)) {
            return;
        }
        const ndCard = GameLoader.addCard();
        ndCard.parent = this.node;
        console.log('pos1',pos);
        pos = this.pos2meshPos(pos);
        console.log('pos2',pos);
        ndCard.setPosition(pos);
        this.setupCard(ndCard);
    }
    private setupCard(ndCard: Node) {
        // 当setup的牌下面没有其它牌时，layer为1
        // 当setup的牌下面有其它牌，layer=target。layer+1
        const underCards = this.findUnderCards(ndCard);
        const cardView = ndCard.getComponent(CardView);
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
    
}