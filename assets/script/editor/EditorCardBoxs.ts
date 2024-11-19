import { _decorator, Node, Component, Graphics, Color} from "cc";
import CardView from "../ui/game/CardView";
import { GameGeometry } from "../game/GameGeometry";

const { ccclass, property } = _decorator;

@ccclass('EditorCardBoxs')
export class EditorCardBoxs extends Component {
    
    public drawSelCardBoxs(cardViews: CardView[]) {
        const g = this.getComponent(Graphics);
        g.clear();
        g.strokeColor = Color.GREEN;
        g.lineWidth = 4;
        for (const cardView of cardViews) {
            // const nd = cardView.node;
            const vertices = GameGeometry.getRectVertices(cardView.getRect());
            console.log('vertices',vertices);
            for (let i = 0; i < 4; i++) {
                const x0 = vertices[i][0];
                const y0 = vertices[i][1];
                const x1 = vertices[(i+1)%4][0];
                const y1 = vertices[(i+1)%4][1];
                g.moveTo(x0, y0);
                g.lineTo(x1, y1);
                g.stroke();
            }
            // const pos = cardView.node.position;
            // const width = CardView.WIDTH;
            // const height = CardView.HEIGHT;
            // g.rect(pos.x - width / 2, pos.y - height / 2, width, height);
            // g.stroke();
        }
    }
    
}