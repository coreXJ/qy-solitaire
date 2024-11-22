import { _decorator, Component, Label, macro, Node, tween, Tween, v3, Vec3 } from "cc";
import { MySprite } from "../../components/MySprite";
import { Booster, BoosterID } from "../../data/GameObjects";
import { XUtils } from "../../comm/XUtils";

const { ccclass, property } = _decorator;


@ccclass('BoosterView')
export default class BoosterView extends Component {
    @property(MySprite)
    mspBg: MySprite = null;
    @property(MySprite)
    mspIcon: MySprite = null;
    @property(Node)
    ndAdd: Node = null;
    @property(Node)
    ndSelNode:Node = null;
    @property(Node)
    ndCount:Node = null;
    @property(Node)
    ndTime:Node = null;
    @property(Label)
    lbTime:Label = null;
    @property(Label)
    lbCount:Label = null;
    
    private data: Booster;
    private bChecked: boolean;
    protected onLoad(): void {
        XUtils.bindClick(this.node, this.onClick, this);
    }
    public get dataID() {
        return this.data.id;
    }
    public setData(data: Booster) {
        console.log('BoosterView setData',data);
        this.data = data;
        this.mspIcon.spriteFrameIdx = data.id - 1;
        this.refresh();
    }
    public refresh() {
        const count = this.data.count;
        const freetime = this.data.freetime;
        const bFree = freetime > Date.now();
        this.lbCount.string = count.toString();
        this.unscheduleAllCallbacks();
        if (!count || bFree) {
            this.bChecked = false;
        }
        this.ndTime.active = bFree;
        if (bFree) {
            this.ndAdd.active = false;
            this.ndCount.active = false;
            this.ndSelNode.active = false;
            this.mspBg.spriteFrameIdx = 1;
            this.countdown();
        } else {
            this.ndAdd.active = !count;
            this.ndCount.active = !this.isChecked && !!count;
            this.ndSelNode.active = this.isChecked;
            this.mspBg.spriteFrameIdx = this.isChecked ? 1 : 0;
        }
    }
    public set isChecked(bool: boolean) {
        const bFree = this.data.freetime > Date.now();
        if (bFree) {
            this.bChecked = false;
            return;
        }
        if (bool && this.data.count > 0) {
            this.bChecked = true;
        } else {
            this.bChecked = false;
        }
        this.refresh();
    }
    public get isChecked() {
        return this.bChecked;
    }
    private countdown() {
        const func = ()=>{
            const ms = this.data.freetime - Date.now();
            if (ms <= 0) {
                this.refresh();
                return;
            }
            const format = ms > 3600000 ? 'HH:mm:ss' : 'mm:ss';
            const str = XUtils.formatDateToSimple(ms, format);
            this.lbTime.string = str;
            // console.log('countdown',str);
        }
        func();
        this.schedule(func, 1, macro.REPEAT_FOREVER);
    }
    private onClick() {
        console.log('BoosterView onClick',this.data);
        const bFree = this.data.freetime > Date.now();
        if (bFree) {
            return;
        }
        if (!this.data.count) {
            return;
        }
        this.isChecked = !this.isChecked;
    }
}