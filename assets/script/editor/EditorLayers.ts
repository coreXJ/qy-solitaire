import { _decorator, Node, Component, instantiate, Label, Sprite, Color } from "cc";
import { XUtils } from "../comm/XUtils";

const { ccclass, property } = _decorator;

const COLOR_NORMAL = new Color(0x33, 0x33, 0x33);
const COLOR_SELECT = new Color(0x33, 0x33, 0xff);
@ccclass('EditorLayers')
export class EditorLayers extends Component {

    private items: Node[] = [];
    private selItemIdx = -1;
    private toggles: Node[] = [];
    private toggleCheckeds: boolean[] = [];

    protected onLoad(): void {
        // 初始化21个item
        const item0 = this.node.getChildByName('item');
        const col = 7;
        const row = 3;
        const itemWidth = 750/7;
        const itemHeight = 50;
        const startX = -(col - 1) * itemWidth / 2;
        const startY = (row - 1) * itemHeight / 2;
        for (let i = 0; i < 7 * 3; i++) {
            let nd = this.node.children[i];
            if (!nd) {
                nd = instantiate(item0);
                nd.parent = this.node;
            }
            this.items[i] = nd;
            this.toggles[i] = nd.getChildByName('Toggle');
            nd.setSiblingIndex(i);
            nd.active = true;
            nd.setPosition(startX + (i % col) * itemWidth, startY - Math.floor(i / col) * itemHeight);
            XUtils.bindClick(nd, this.onClickItem, this, i);
            XUtils.bindClick(this.toggles[i], this.onClickToggle, this, i);
            if (i == 20) {
                nd.getComponentInChildren(Label).string = '20+';
            } else {
                nd.getComponentInChildren(Label).string = (i+1)+'层';
            }
        }
    }

    private onClickItem(idx: number) {
        console.log('onClickItem',idx,this.items[idx]);
        if (this.selItemIdx >= 0) {
            this.items[this.selItemIdx].getComponent(Sprite).color = COLOR_NORMAL;
        }
        if (this.selItemIdx == idx) {
            this.selItemIdx = -1;
        } else {
            this.selItemIdx = idx;
            this.items[idx].getComponent(Sprite).color = COLOR_SELECT;
        }
    }

    private onClickToggle(idx: number) {
        this.toggleCheckeds[idx] = !this.toggleCheckeds[idx];
        console.log('onClickToggle',idx,this.toggleCheckeds[idx]);
        this.toggles[idx].children[0].active = this.toggleCheckeds[idx];
    }

}