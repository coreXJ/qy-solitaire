import { CardJoker, UIID } from "../data/GameConfig";
import GameData from "../data/GameData";
import { Level } from "../data/GameObjects";
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
    // private viewTable: GameTable;
    // private viewHand: GameHand;
    public bind(view: UIGame) {
        this.view = view;
    }

    public startGame(levelId: number) {
        // 通过GameData的levelList读取一个关卡数据
        this.level = GameData.getLevel(levelId);
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
        this.view.startGame(this.level);
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
            this.view.linkTableCard(cardView);
            if (this.view.table.getCardCount() == 0) {
                // win
                this.onGameEnd(true);
            }
        }
    }

    public onGameEnd(bWin: boolean) {
        UIMgr.instance.open(UIID.UIResult,{bWin});
    }

    public drawPool() {
        const handValue = this.view.hand.topHandCardValue;
        if (handValue == CardJoker) {
            // 如果摸的是效果牌，就直接摸
            this.view.hand.drawPoolCard();
        } else {
            // 如果摸的这张牌是普通牌，就生成牌值
            const topValues = this.view.table.getTopCardValues();
            let bLink = false;//xj====写到了这里 要加个摸牌保底
            const cardValue = GameLogic.generateHandCardValue(bLink, topValues);
            this.view.hand.drawPoolCard(cardValue);
        }
    }

    public unbind() {
        this.view = null;
    }

}

export default new GameCtrl();