import { _decorator, Component, Label, Node, UITransform, v3 } from "cc";
import { MySprite } from "../../components/MySprite";
import { Task, TaskColor } from "../../data/GameObjects";
import { XUtils } from "../../comm/XUtils";
import UIGame from "./UIGame";
const { ccclass, property } = _decorator;

@ccclass('ViewTop')
export default class ViewTop extends Component {
    public view: UIGame;
    @property(Node)
    public btnSetting: Node;
    @property(Label)
    private lbGold: Label;

    @property(Node)
    private ndTaskBg: Node;
    @property(Node)
    private ndTaskItemRoot: Node;
    @property(MySprite)
    private mspCard: MySprite;
    @property(Node)
    private ndMul2: Node;
    public get height() {
        return this.getComponent(UITransform).height;
    }
    protected start(): void {
        console.log('ViewTop start');
        this.view.bindClick(this.btnSetting, this.onClickSetting, this);
    }

    public setTaskData(task: Task,colors: TaskColor[]) {
        // task 只用来设置奖励的道具icon，总进度5目前受限于美术设计。
        for (let i = 0; i < 5; i++) {
            const color = colors[i];
            const bVisible = color >= 0;
            this.ndTaskItemRoot.children[i].active = bVisible;
            if (bVisible) {
                this.ndTaskItemRoot.children[i].getComponent(MySprite).spriteFrameIdx = color;
            }
        }
        let bSameColor = false;
        if (colors.length >= 2) {
            const color0 = colors[0];
            bSameColor = colors.findIndex(c => c != color0) == -1;
        }
        this.ndMul2.active = bSameColor;
    }
    public reset() {
        
    }

    // // 刷新任务
    // public refreshTask() {
    //     // ctrl.newTask 生成新任务数据，并刷新显示
    //     this.task = GameCtrl.newTask();
    //     // 下面是动态数量的代码，目前美术说是固定5个，就暂时写死吧。
    //     // const bgWidth = 52 + this.task.linkCount * 30;
    //     // this.ndTaskBg.getComponent(UITransform).width = bgWidth;
    //     // const AwardPosX = (this.task.linkCount - 1) * 30 / 2 + 37;
    //     // this.mspCard.node.setPosition(AwardPosX, 0);
    //     for (const e of this.ndTaskItemRoot.children) {
    //         e.active = false;
    //     }
    //     this.mspCard.spriteFrameIdx = 0; // 这个要通过task.awardType来，目前还没确定。
    //     this.ndMul2.active = false;
    //     this.taskCards = [];
    // }

    // public addTaskCard(cardValue: number) {
    //     // 添加一个接龙，显示出来。
    //     // return bFinished;
    //     return false;
    // }

    // public breakTask() {
    //     // 打断接龙，去掉开头的2个接龙牌
    // }

    public setGold(gold: number) {
        // 刷新金币
        this.lbGold.string = XUtils.formatGold(gold);
    }

    public getTaskCardWorldPosition() {
        return v3(this.mspCard.node.worldPosition);
    }

    private onClickSetting() {
        this.view.menu.show();
    }
}