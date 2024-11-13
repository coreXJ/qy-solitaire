import { _decorator, Node, Component, Graphics, Color, Vec3, instantiate, v3 } from "cc";
import CardView from "../ui/game/CardView";
import GameLoader from "../game/GameLoader";
import { Card } from "../data/GameObjects";

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
        this.cardViews.push(ndCard.getComponent(CardView));
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