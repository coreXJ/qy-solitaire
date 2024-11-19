import { _decorator, Component, EditBox, Node, ScrollView, UITransform, v3 } from "cc";
import CardView from "../ui/game/CardView";
import { XUtils } from "../comm/XUtils";
import GameLoader from "../game/GameLoader";
import { CardType } from "../data/GameObjects";
import UIEditor from "./UIEditor";
const { ccclass, property } = _decorator;

@ccclass('EdirotPanelProperty')
export class EdirotPanelProperty extends Component {
    
    view: UIEditor;

    @property(EditBox)
    ebX: EditBox;
    @property(EditBox)
    ebY: EditBox;
    @property(EditBox)
    ebAngel: EditBox;
    @property(EditBox)
    ebLayer: EditBox;
    @property(Node)
    btnSelect: Node;

    private cardView: CardView;

    protected start(): void {
        console.log('EdirotPanelProperty start');
        XUtils.bindClick(this.btnSelect, this.onSelect, this);
        this.ebX.node.on('text-changed', this.onEditX, this);
        this.ebY.node.on('text-changed', this.onEditY, this);
        this.ebAngel.node.on('text-changed', this.onEditAngel, this);
        this.ebLayer.node.on('text-changed', this.onEditLayer, this);
    }
    public show(cardView: CardView) {
        this.node.active = true;
        this.cardView = cardView;
        this.fullUI();
    }
    public hide() {
        this.node.active = false;
    }
    private fullUI() {
        const data = this.cardView.data;
        this.ebX.string = data.tPos.x + '';
        this.ebY.string = data.tPos.y + '';
        this.ebAngel.string = data.tAngle + '';
        this.ebLayer.string = data.tLayer + '';
    }
    // private fullUI() {
    //     const nd = this.cardView.node;
    //     this.ebX.string = nd.position.x + '';
    //     this.ebY.string = nd.position.y + '';
    //     this.ebAngel.string = nd.angle + '';
    //     this.ebLayer.string = this.cardView.data.tLayer + '';
    // }

    private onSelect() {
        this.view.showPopSelectCard(this.cardView, (cardValue)=>{
            this.cardView.isFront = true;
            this.cardView.cardValue = cardValue;
        });
    }

    private onEditX() {
        console.log('onEditX',this.ebX.string);
        const str = this.ebX.string.trim();
        if (!XUtils.isNumber(str)) {
            return;
        }
        const x = parseFloat(str);
        const y = this.cardView.node.position.y;
        this.view.table.setCardPosition(this.cardView, v3(x,y));
    }
    private onEditY() {
        console.log('onEditY',this.ebY.string);
        const str = this.ebY.string.trim();
        if (!XUtils.isNumber(str)) {
            return;
        }
        const y = parseFloat(str);
        const x = this.cardView.node.position.x;
        this.view.table.setCardPosition(this.cardView, v3(x,y));
    }
    private onEditAngel() {
        console.log('onEditAngel',this.ebAngel.string);
        const str = this.ebAngel.string.trim();
        if (!XUtils.isNumber(str)) {
            return;
        }
        const angel = parseFloat(str);
        this.view.table.setCardAngel(this.cardView, angel);
    }
    private onEditLayer() {
        console.log('onEditLayer',this.ebLayer.string);
        const str = this.ebLayer.string.trim();
        if (!XUtils.isPureNumber(str)) {
            return;
        }
        const layer = parseInt(str);
        this.view.table.setCardLayer(this.cardView, layer);
    }
}