import { _decorator, Node, Label, EventTouch, instantiate, v3, sys, UIOpacity } from "cc";
import { isFullScreen, UIView } from "../base/UIView";
import { EditorTable } from "./EditorTable";
import CardView from "../ui/game/CardView";
import { Level } from "../data/GameObjects";
import { XUtils } from "../comm/XUtils";

const { ccclass, property } = _decorator;
const CardViewPos = v3(-277, -495);
@ccclass('UIEditor')
@isFullScreen(true)
export default class UIEditor extends UIView {
    
    @property(CardView)
    cardView: CardView = null;

    @property(EditorTable)
    table: EditorTable = null;
    private level: Level;
    public init(...args: any): void {
        console.log('UIEditor init');
        this.lisCardTouch();
        this.bindNodes();
    }

    public onOpen(fromUI: number, ...args: any): void {
        console.log('UIEditor onOpen');
        this.newLevel();
    }
    private bindNodes() {
        const btnExport = this.node.getChildByName('btnExport');
        XUtils.bindClick(btnExport, this.exportLevel, this);
    }
    private lisCardTouch() {
        this.cardView.node.on(Node.EventType.TOUCH_START, this.onCardTouchStart, this);
        this.cardView.node.on(Node.EventType.TOUCH_MOVE, this.onCardTouchMove, this);
        this.cardView.node.on(Node.EventType.TOUCH_END, this.onCardTouchEnd, this);
        this.cardView.node.on(Node.EventType.TOUCH_CANCEL, this.onCardTouchEnd, this);
    }

    private onCardTouchStart(e: EventTouch) {
        const op = this.cardView.getComponent(UIOpacity) || this.cardView.addComponent(UIOpacity);
        op.opacity = 127;
        this.cardView.node.setWorldPosition(e.getUILocation().toVec3());
        // this.touchCardNode = instantiate(this.cardView.node);
        // this.touchCardNode.parent = this.table.node;
        // const pos = e.getUILocation().toVec3();
        // console.log('cardView TOUCH_START',pos);
        // this.touchCardNode.worldPosition = pos;
    }

    private onCardTouchMove(e: EventTouch) {
        console.log('cardView TOUCH_MOVE');
        const wpos = e.getUILocation().toVec3();
        this.cardView.node.setWorldPosition(wpos);
        this.table.onNewCardMove(wpos);
    }

    private onCardTouchEnd(e: EventTouch) {
        console.log('cardView TOUCH_END');
        const wpos = e.getUILocation().toVec3();
        this.table.onNewCardDown(wpos);
        this.cardView.node.setPosition(CardViewPos);
        const op = this.cardView.getComponent(UIOpacity) || this.cardView.addComponent(UIOpacity);
        op.opacity = 255;
    }
    private newLevel() {
        this.level = new Level();
        // 刷新table，和其它东西。
    }
    private exportLevel() {
        if (sys.isBrowser) {
            this.level.tableCards = this.table.getCards();
            if (this.level.tableCards.length == 0) {
                return;
            }
            const content = JSON.stringify(this.level);
            const filename = "level.json";
            // 创建一个 Blob 对象
            const blob = new Blob([content], { type: 'text/plain' });
            // 创建一个临时的 URL
            const url = URL.createObjectURL(blob);
            // 创建一个隐藏的 <a> 元素
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            // 将 <a> 元素添加到 DOM 中
            document.body.appendChild(a);
            // 触发点击事件
            a.click();
            // 移除 <a> 元素
            document.body.removeChild(a);
            // 释放 URL 对象
            URL.revokeObjectURL(url);
        }
    }
}