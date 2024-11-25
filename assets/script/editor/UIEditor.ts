import { _decorator, Node, Label, EventTouch, instantiate, v3, sys, UIOpacity, Input, input, EventKeyboard, KeyCode, EditBox, Prefab, Sprite, Color, Toggle } from "cc";
import { isFullScreen, UIView } from "../base/UIView";
import { EditorTable } from "./EditorTable";
import CardView from "../ui/game/CardView";
import { Level } from "../data/GameObjects";
import { XUtils } from "../comm/XUtils";
import { EditorLayers } from "./EditorLayers";
import { ResMgr } from "../manager/ResMgr";
import { EdirotPopSelectCard } from "./EdirotPopSelectCard";
import { EdirotPanelProperty } from "./EditorPanelProperty";
import { UIMgr } from "../manager/UIMgr";
import { UIID } from "../data/GameConfig";
import { EditorPopSave } from "./EditorPopSave";
import GameCtrl from "../game/GameCtrl";

const { ccclass, property } = _decorator;
const CardViewPos = v3(-277, -495);
@ccclass('UIEditor')
@isFullScreen(true)
export default class UIEditor extends UIView {
    
    @property(CardView)
    cardView: CardView = null;

    @property(EditorTable)
    table: EditorTable = null;
    @property(EdirotPanelProperty)
    panelProperty: EdirotPanelProperty = null;
    @property(EditorLayers)
    layers: EditorLayers = null;
    @property(Node)
    etLevel: Node = null;
    @property(Toggle)
    tgAlignMesh: Toggle = null;
    private level: Level;
    private ndHelp: Node;
    private tabs: Sprite[] = [];
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
        this.selectTab(0);
    }
    private bindNodes() {
        this.table.view = this;
        this.ndHelp = this.node.getChildByName('popHelp');
        const btnExport = this.node.getChildByName('btnExport');
        const btnClear = this.node.getChildByName('btnClear');
        const btnHelp = this.node.getChildByName('btnHelp');
        const btnPlay = this.node.getChildByName('btnPlay');
        const tabs = this.node.getChildByName('tabs');
        XUtils.bindClick(btnExport, this.showPopSave, this);
        XUtils.bindClick(this.ndHelp, this.onClickHelp, this);
        XUtils.bindClick(btnClear, this.onClickClear, this);
        XUtils.bindClick(btnHelp, this.onClickHelp, this);
        XUtils.bindClick(btnPlay, this.onClickPlay, this);
        for (let i = 0; i < tabs.children.length; i++) {
            const e = tabs.children[i];
            this.tabs[i] = e.getComponent(Sprite);
            XUtils.bindClick(e,this.selectTab,this,i);
        }
        this.tgAlignMesh.node.on('toggle',this.onAlignMesh,this);
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

    private onKeyDown(event: EventKeyboard) {
        console.log('onKeyDown', event);
        const keyCode = event.keyCode;
        if (keyCode == KeyCode.DELETE) {
            this.table.removeSelCards();
        } else if (keyCode == KeyCode.CTRL_LEFT ||
            keyCode == KeyCode.CTRL_RIGHT
        ) {
            this.table.isKeyCtrl = true;
        } else if (keyCode == KeyCode.KEY_A) {
            if (this.table.isKeyCtrl) {
                this.table.selectAll();
            }
        } else if (keyCode == KeyCode.ALT_LEFT ||
            keyCode == KeyCode.ALT_RIGHT
        ) {
            this.table.isKeyAlt = true;
        } else if (keyCode == KeyCode.KEY_C) {
            if (this.table.isKeyCtrl) {
                this.table.ctrlC();
            }
        } else if (keyCode == KeyCode.KEY_V) {
            if (this.table.isKeyCtrl) {
                this.table.ctrlV();
            }
        } else if (keyCode == KeyCode.KEY_D) {
            if (this.table.isKeyCtrl) {
                this.table.ctrlD();
            }
        }
    }
    private onKeyUp(event: EventKeyboard) {
        const keyCode = event.keyCode;
        if (keyCode == KeyCode.CTRL_LEFT ||
            keyCode == KeyCode.CTRL_RIGHT) {
                this.table.isKeyCtrl = false;
        } else if (keyCode == KeyCode.ALT_LEFT ||
            keyCode == KeyCode.ALT_RIGHT
        ) {
            this.table.isKeyAlt = false;
        }
    }
    private onClickClear() {
        this.table.clearCards();
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

    private async showPopSave() {
        const node = await this.getPrefabNode('popSave');
        node.getComponent(EditorPopSave).show(this, this.level);
    }
    public async showPopSelectCard(cardView?: CardView, callback?:(cardValue: number) => void) {
        const node = await this.getPrefabNode('popSelectCard');
        const comp = node.getComponent(EdirotPopSelectCard);
        comp.show(cardView.cardValue, callback);
    }
    private async getPrefabNode(name: string) {
        let node = this.node.getChildByName(name);
        if (!node) {
            const path = "prefab/editor/" + name;
            let prefab: Prefab = await ResMgr.instance.load(path, Prefab);
            node = instantiate(prefab);
            node.parent = this.node;
            node.name = name;
        }
        return node;
    }
    public resumeLevel(level: Level) {
        console.log('resumeLevel',level);
        this.level = level;
        this.etLevel.getComponent(EditBox).string = (this.level.id || 1) + '';
        this.table.resume(this.level.tableCards);
    }
    public onSelCards(cards: CardView[]) {
        this.panelProperty.view = this;
        if (cards?.length == 1) {
            this.panelProperty.show(cards[0]);
        } else {
            this.panelProperty.hide();
        }
    }
    public selectTab(tab: 0|1) {
        console.log('selectTab',tab);
        this.table.touchType = tab;
        for (let i = 0; i < this.tabs.length; i++) {
            const e = this.tabs[i];
            e.color = tab == i ? new Color(0x10,0x20,0x30) : Color.GRAY;
        }
    }
    private onAlignMesh() {
        console.log('onAlignMesh',this.tgAlignMesh.isChecked);
        this.table.isAlignMesh = this.tgAlignMesh.isChecked;
    }
    private onClickPlay() {
        this.level.tableCards = this.table.getCards();
        const level = JSON.parse(JSON.stringify(this.level));
        GameCtrl.openGame({
            level: level,
            useBoosters: [],
            isEditor: true
        });
    }
}