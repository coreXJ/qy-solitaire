import { Vec3 } from "cc";

/**牌数据 */
export class Card {
    value: number; // 牌值 0为未知
    type: CardType;
    tAngle: Vec3; // 角度
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
    group: string;
    /**生成桌牌时，连续接龙的牌数范围 */
    tableComboRange: [number,number];
    minBreakDiff: number;
    tableCards: Card[];
    maxComboRedProb: number;
    breakSwitchProb: number;
    poolCount: number;
    handCardValue: number;
}