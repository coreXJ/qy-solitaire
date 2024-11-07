import { Vec3 } from "cc";

export default class Card {
    value: number; // 牌值 0为未知
    type: CardType;
    tAngle: number; // 角度
    tIdx: number;
    tLayer: number;
    tType: number;
    tPos: Vec3;
}

export enum CardType {
    none = 0, // 未知
    hand, // 手牌
    deck, // 摸牌堆
    table // 牌桌
}