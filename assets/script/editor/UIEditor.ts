import { _decorator, Node, Label, EventTouch, instantiate, v3, sys, UIOpacity, Input, input, EventKeyboard, KeyCode, EditBox } from "cc";
import { isFullScreen, UIView } from "../base/UIView";
import { EditorTable } from "./EditorTable";
import CardView from "../ui/game/CardView";
import { Level } from "../data/GameObjects";
import { XUtils } from "../comm/XUtils";
import { EditorLayers } from "./EditorLayers";

const { ccclass, property } = _decorator;
const CardViewPos = v3(-277, -495);
@ccclass('UIEditor')
@isFullScreen(true)
export default class UIEditor extends UIView {
    
    @property(CardView)
    cardView: CardView = null;

    @property(EditorTable)
    table: EditorTable = null;
    @property(EditorLayers)
    layers: EditorLayers = null;
    @property(Node)
    etLevel: Node = null;
    private level: Level;
    private ndHelp: Node;
    public init(...args: any): void {
        console.log('UIEditor init');
        this.lisEvents();
        this.bindNodes();
        this.layers.setListener(this.table);
    }
    protected onEnable(): void {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }
    protected onDisable(): void {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }
    public onOpen(fromUI: number, ...args: any): void {
        console.log('UIEditor onOpen');
        this.newLevel();
    }
    private bindNodes() {
        this.ndHelp = this.node.getChildByName('popHelp');
        const btnExport = this.node.getChildByName('btnExport');
        const btnHelp = this.node.getChildByName('btnHelp');
        XUtils.bindClick(btnExport, this.exportLevel, this);
        XUtils.bindClick(this.ndHelp, this.onClickHelp, this);
        XUtils.bindClick(btnHelp, this.onClickHelp, this);
    }
    private lisEvents() {
        this.cardView.node.on(Node.EventType.TOUCH_START, this.onCardTouchStart, this);
        this.cardView.node.on(Node.EventType.TOUCH_MOVE, this.onCardTouchMove, this);
        this.cardView.node.on(Node.EventType.TOUCH_END, this.onCardTouchEnd, this);
        this.cardView.node.on(Node.EventType.TOUCH_CANCEL, this.onCardTouchEnd, this);
        this.etLevel.on('text-changed', this.onEditLevel, this);
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
        this.level.id = 1;
        this.level.tableComboRange = [6,7];
        this.level.minBreakDiff = 2;
        this.level.maxComboRedProb = 0.5;
        this.level.breakSwitchProb = 0.5;
        this.level.poolCount = 10;
        this.level.handCardValue = 0;
        this.level.minGuarantee = 3;
        this.level.group = 'group1';
        this.etLevel.getComponent(EditBox).string = this.level.id+'';
    }
    private exportLevel() {
        if (sys.isBrowser) {
            this.level.tableCards = this.table.getCards();
            if (this.level.tableCards.length == 0) {
                return;
            }
            const content = JSON.stringify(this.level);
            const filename = `level${this.level.id}.json`;
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

    private onKeyDown(event: EventKeyboard) {
        console.log('onKeyDown', event);
        if (event.keyCode == KeyCode.DELETE) {
            this.table.removeSelCards();
        } else if (event.keyCode == KeyCode.CTRL_LEFT ||
            event.keyCode == KeyCode.CTRL_RIGHT
        ) {
            this.table.isMultipleMode = true;
        } else if (event.keyCode == KeyCode.KEY_A) {
            if (this.table.isMultipleMode) {
                this.table.selectAll();
            }
        }
    }
    private onKeyUp(event: EventKeyboard) {
        if (event.keyCode == KeyCode.CTRL_LEFT ||
            event.keyCode == KeyCode.CTRL_RIGHT) {
                this.table.isMultipleMode = false;
        }
    }
    private onClickHelp() {
        this.ndHelp.active = !this.ndHelp.active;
    }

    private onEditLevel(et: EditBox) {
        console.log('onEditLevel',et.string);
        let str = et.string.replace(/\D/g, '');
        str = parseInt(str) + '';
        if (str != et.string) {
            et.string = str;
        }
        this.level.id = parseInt(str);
        this.level.name = 'Level '+str;
    }
}