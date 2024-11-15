import { _decorator, Node, Component, Graphics, Color} from "cc";
import CardView from "../ui/game/CardView";

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
            const pos = cardView.node.position;
            const width = CardView.WIDTH;
            const height = CardView.HEIGHT;
            g.rect(pos.x - width / 2, pos.y - height / 2, width, height);
            g.stroke();
        }
    }
    
}