import { CardJoker, PropID, UIID } from "../data/GameConfig";
import GameData from "../data/GameData";
import { GameAction, GameActionType, Level, Task, TaskAwardType, TaskColor } from "../data/GameObjects";
import { EventMgr, EventName } from "../manager/EventMgr";
import { UIMgr } from "../manager/UIMgr";
import CardView from "../ui/game/CardView";
import UIGame from "../ui/game/UIGame";
import GameLogic from "./GameLogic";

/**
 * 游戏控制类
 */
class GameCtrl {
    private view: UIGame;
    private level: Level;
    private task: Task;
    private taskColors: TaskColor[];
    private actions: GameAction[];
    // private viewTable: GameTable;
    // private viewHand: GameHand;
    public bind(view: UIGame) {
        this.view = view;
        this.lisEvents(true);
        this.onGoldChange();
    }

    private lisEvents(bool: boolean) {
        const func = bool ? 'on' : 'off';
        EventMgr[func](EventName.onGoldChange,  this.onGoldChange, this);
        EventMgr[func](EventName.onPropChange,  this.onPropChange, this);
    }

    public startGame(level: Level) {
        // 通过GameData的levelList读取一个关卡数据
        this.level = level;
        let tableCards = this.level.tableCards.map(e => e.value);
        console.log('生成随机桌牌前',[...tableCards]);
        tableCards = GameLogic.generateTableCards(
            tableCards,
            this.level.tableComboRange,
            this.level.minBreakDiff,
            this.level.maxComboRedProb,
            this.level.breakSwitchProb
        )
        console.log('生成随机桌牌后',[...tableCards]);
        for (let i = 0; i < tableCards.length; i++) {
            const card = tableCards[i];
            this.level.tableCards[i].value = card;
        }
        this.newTask();
        this.view.startGame(this.level);
        this.actions = [];
    }

    public getFirstCardValue() {
        const topTableCards = this.view.table.getTopCardValues();
        return GameLogic.generateHandCardValue(true,topTableCards);
    }

    public linkTable(cardView: CardView) {
        console.log('linkTable', cardView);
        const value0 = cardView.cardValue;
        const value1 = this.view.hand.topHandCardValue;
        // 判断是否能接龙
        const bCanLink = GameLogic.isCanLink(value0, value1);
        if (bCanLink) {
            const action = new GameAction();
            action.type = GameActionType.linkTable;
            action.targetCard = cardView.data;
            action.task = this.task;
            action.taskColors = [...this.taskColors];
            this.view.linkTableCard(cardView);
            // addTaskColor，并更新top，如果满了，bFinished=true
            const finishType = this.addTaskColor(value0);
            if (finishType > 0) {
                // 通过下面2个值，确定奖励和数量，目前写死奖一张牌。
                // this.task.awardType
                // this.task.awardNum
                let cardValue = 0;
                if (this.task.awardType == TaskAwardType.card) {
                    cardValue = 0
                } else if (this.task.awardType == TaskAwardType.gold) {
                    // 目前没这种奖励
                    action.taskAwardGold = 0;//读配置
                } else if (this.task.awardType == TaskAwardType.joker) {
                    cardValue = CardJoker;
                }
                cardValue = CardJoker;
                // 通过poolCard的数量 生成idx
                const idxs = GameLogic.randomInsertPoolCardIdxs(this.view.hand.poolCardCount, finishType);
                
                const cardValues = finishType == 2 ? [cardValue,cardValue] : [cardValue];
                this.view.hand.insertTaskAwardCard(cardValues,idxs);
                action.taskAwardPoolCardIdxs = [...idxs];
                this.newTask();
            }
            this.onTaskChange();
            if (this.view.table.getCardCount() == 0) {
                // win
                this.onGameEnd(true);
            } else {
                this.actions.push(action);
            }
        }
    }

    public onGameEnd(bWin: boolean) {
        UIMgr.instance.open(UIID.UIResult,{bWin});
        if (bWin) {
            GameData.nextLevel();
        }
    }
    private _guaranteeCount = 0;//摸牌保底计数
    public drawPool() {
        const handValue = this.view.hand.topPoolCardValue;
        const action = new GameAction();
        action.type = GameActionType.drawPool;
        action.task = this.task;
        action.taskColors = [...this.taskColors];
        this.actions.push(action);
        if (handValue > 0) {
            // 如果摸的是效果牌，就直接摸
            this.view.hand.drawPoolCard();
        } else {
            // 如果摸的这张牌是普通牌，就生成牌值
            const topValues = this.view.table.getTopCardValues();
            this.level.breakSwitchProb
            let bLink = this._guaranteeCount >= this.level.minGuarantee;
            const cardValue = GameLogic.generateHandCardValue(bLink, topValues);
            this.view.hand.drawPoolCard(cardValue);
            const tops = this.view.table.getTopCardValues();
            if (GameLogic.isCanLinkAnyOne(cardValue, tops)) {
                this._guaranteeCount = 0;
            } else {
                this._guaranteeCount++;
            }
        }
        this.breakTaskColor();
    }

    public newTask() {
        // 根据配置规则生成任务，目前没有，所以随机吧
        const task = new Task();
        task.awardType = Math.floor(Math.random() * 3);
        task.awardNum = 1;
        task.linkCount = 5; // 目前写死了，5个
        this.task = task;
        this.taskColors = [];
        this.onTaskChange();
        return task;
    }
    /**
     * @returns 0未完成 1完成 2双倍完成
     */
    private addTaskColor(cardValue: number): 0|1|2 {
        const taskColor = GameLogic.getCardTaskColor(cardValue);
        this.taskColors.push(taskColor);
        if (this.taskColors.length == this.task.linkCount) {
            const color0 = this.taskColors[0];
            // 如果其它颜色全部一样，则任务完成
            const bSameColor = this.taskColors.findIndex(c => c != color0) == -1;
            return bSameColor ? 2 : 1;
        }
        this.onTaskChange();
        return 0;
    }
    private breakTaskColor() {
        // 去掉taskColors前面的2个
        this.taskColors.splice(0, 2);
        this.onTaskChange();
    }
    private onTaskChange() {
        this.view.top.setTaskData(this.task, this.taskColors);
    }
    public unbind() {
        this.view = null;
        this.lisEvents(false);
        this.actions = [];
    }

    public useProp(id: PropID) {
        // 暂时没有道具
        if (id == PropID.PropUndo && this.actions.length == 0) {
            return;
        }
        if (GameData.useProp(id)) {
            console.log('使用道具');
            this.onUseProp(id);
        } else if (GameData.costGold(200)) { //读配置
            console.log('花金币使用道具');
            this.onUseProp(id, 200);
        }
    }
    
    private onUseProp(id: PropID, gold?: number) {
        if (id == PropID.PropAdd) {
            this.view.hand.addPropAddCards(5); //读配置
        } else if (id == PropID.PropJoker) {
            const action = new GameAction();
            action.type = GameActionType.propJoker;
            action.task = this.task;
            action.taskColors = [...this.taskColors];
            this.actions.push(action);
            this.view.hand.addPropJokerCard();
        } else if (id == PropID.PropUndo) {
            const action = this.actions.pop();
            console.log('action', action);
            this.task = action.task;
            this.taskColors = action.taskColors;
            this.onTaskChange();
            if (action.type == GameActionType.linkTable) {
                this.view.undoLinkTable(action.taskAwardPoolCardIdxs);
            } else if (action.type == GameActionType.drawPool) {
                this.view.hand.undoDrawPoolCard();
            } else if (action.type == GameActionType.propJoker) {
                this.view.hand.undoPropJokerCard();
                GameData.addProp(PropID.PropJoker, 1);
            }
        }
    }

    private onGoldChange() {
        this.view.top.setGold(GameData.gold);
    }

    private onPropChange(id: PropID, count: number) {
        this.view.hand.refreshProp();
    }
}

export default new GameCtrl();