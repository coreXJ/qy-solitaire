import { _decorator, Node, Component, EditBox} from "cc";
import { XUtils } from "../comm/XUtils";
import CardView from "../ui/game/CardView";
import { Level } from "../data/GameObjects";
import UIEditor from "./UIEditor";

const { ccclass, property } = _decorator;

@ccclass('EditorTabPool')
export class EditorTabPool extends Component {
    @property(EditBox)
    private ebPoolCount: EditBox;
    @property(CardView)
    private handCardView: CardView;

    private _level: Level;

    public init(view: UIEditor, level: Level) {
        this._level = level;
        this.ebPoolCount.string = level.poolCount.toString();
        this.ebPoolCount.node.off('text-changed');
        this.ebPoolCount.node.on('text-changed',()=>{
            const str = this.ebPoolCount.string.trim();
            if (XUtils.isPureNumber(str)) {
                this._level.poolCount = parseInt(str);
            }
        });
        this.handCardView._bFront = true;
        this.handCardView.cardValue = level.handCardValue || 0;
        XUtils.bindClick(this.handCardView.node, ()=>{
            view.showPopSelectCard(this.handCardView, (cardValue)=>{
                this.handCardView.cardValue = cardValue;
                level.handCardValue = cardValue;
            });

        })
    }

}