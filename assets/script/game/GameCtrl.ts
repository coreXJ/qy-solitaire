import UIGame from "../ui/game/UIGame";

/**
 * 游戏控制类
 */
class GameCtrl {
    private view: UIGame;
    // private viewTable: GameTable;
    // private viewHand: GameHand;
    public bind(view: UIGame) {
        this.view = view;
    }
    public unbind() {
        this.view = null;
    }
}

export default new GameCtrl();