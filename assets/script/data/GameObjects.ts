import { Vec3 } from "cc";

/**牌数据 */
export class Card {
    value: number; // 牌值 0为未知
    // type?: CardType;
    tAngle: number; // 角度
    tIdx: number;
    tLayer: number;
    tType: number;
    tPos: Vec3;
}

export enum CardType {
    none = 0, // 未知
    hand, // 手牌
    pool, // 摸牌堆
    table // 牌桌
}

/**关卡数据 */
export class Level {
    id: number;
    name: string;
    // group: string;
    /**生成桌牌时，连续接龙的牌数范围 */
    tableComboRange: [number,number];
    minBreakDiff: number;
    tableCards: Card[];
    maxComboRedProb: number;
    breakSwitchProb: number;
    poolCount: number;
    handCardValue: number;
    minGuarantee: number;
    ascProb: number;

    public getLevelId() {
        return Math.floor(this.id / 100);
    }
    public getDifficult(): 1|2|3|4 {
        return <any>Math.floor(this.id % 100);
    }
}

export class Task {
    linkCount: number;
    awardType: TaskAwardType;
    awardNum: number;
}

// 金币、牌、鬼牌、
export enum TaskAwardType {
    gold,
    card,
    joker
}

/**描述每次操作
 * 包括：linkTable、drawPool、propJoker
 * 以及每次操作后的任务数据
 */
export class GameAction {
    type: GameActionType;
    targetCard: Card;
    task: Task;
    taskColors: TaskColor[];
    taskAwardGold: number;
    taskAwardPoolCardIdxs: number[];
    blowCards: Card[];
}
export enum GameActionType {
    linkTable,
    drawPool,
    propJoker
}
/**0红 1黑 */
export enum TaskColor {
    red = 0,
    black = 1
};

export interface Booster {
    id: BoosterID;
    count: number;
    freetime: number;
}
export interface Prop {
    id: PropID;
    count: number;
}
export enum BoosterID {
    /**钩子，开局钩3张表层牌 */
    hook = 1,
    /**吹风，开局往储备牌区插入吹风卡 */
    blow = 2,
    /**赖子，开局替换桌子上3张牌变成赖子 */
    joker = 3,
}

export enum PropID {
    PropJoker = 1,
    PropAdd = 2,
    PropUndo = 3,
}

export enum PropEffectType {
    add = 1,
    joker = 2,
    undo = 4,
}

export enum BoosterEffectType {
    hook = 5,
    blow = 3,
    joker = 2,
}