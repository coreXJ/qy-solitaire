import { _decorator, Node, v3 } from "cc";
import { isFullScreen, UIView } from "../../base/UIView";
import ViewTable from "./ViewTable";
import ViewHand from "./ViewHand";
import GameCtrl from "../../game/GameCtrl";
import ViewTop from "./ViewTop";
import { Level } from "../../data/GameObjects";
import CardView from "./CardView";
const { ccclass, property } = _decorator;

@ccclass('UIGame')
@isFullScreen(true)
export default class UIGame extends UIView {
    private content: Node;
    public top: ViewTop;
    public table: ViewTable;
    public hand: ViewHand;

    public init(params: IOpenParams): void {
        console.log('UIGame init',params);
        // bind nodes
        this.bindNodes();
        GameCtrl.bind(this);
        GameCtrl.startGame(params.level,params.isEditor);
    }

    private bindNodes() {
        this.content = this.node.getChildByName('content');
        this.table = this.content.getComponentInChildren(ViewTable);
        this.hand = this.content.getComponentInChildren(ViewHand);
        this.top = this.content.getComponentInChildren(ViewTop);
        this.table.view = this;
        this.hand.view = this;
    }

    public startGame(level: Level) {
        // table.dealCards
        this.table.dealCards(level.tableCards);
        // hand.dealCards
        this.hand.dealCards(level.poolCount, level.handCardValue);
    }

    public linkTableCard(cardView: CardView) {
        const wpos = v3(cardView.node.worldPosition);
        const bSuccess = this.table.removeCard(cardView);
        if (bSuccess) {
            this.hand.linkTableCard(cardView, wpos);
        }
    }
    public undoLinkTable(idxs: number[]) {
        // console.log('undoLinkTable',idxs);
        const cardView = this.hand.popHandCard();
        if (cardView) {
            this.table.undoCard(cardView);
            cardView.node.worldPosition = this.hand.ndHandRoot.worldPosition;
            if (idxs?.length > 0) {
                this.hand.undoTaskAwardCards(idxs);
            }
        }
    }

    public onClose() {
        GameCtrl.unbind();
    }
}

interface IOpenParams {
    level: Level;
    isEditor?: boolean;
}