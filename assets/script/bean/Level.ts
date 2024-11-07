import Card from "./Card";

export default class Level {
    id: number;
    name: string;
    group: string;
    tableCards: Card[];
    handCount: number;
    maxComboRange: [number,number];
}