/**
 * 游戏逻辑模块
 */

import { CardJoker } from "../data/GameConfig";
import { TaskColor } from "../data/GameObjects";

const value = 0x0F;
const color = 0xF0;

class GameLogic {

    /**
     * 生成关卡桌牌
     * @param cards 需要生成的牌列表
     * @param comboRange 连续接龙的牌数范围 
     * @param ascProb 连续接龙牌升序概率
     * @param minBreakDiff 打断牌差额保底
     * @param redProb 连续接龙牌红色牌占比
     * @param redSwitchProb 当打断时，对调maxComboRedProb的概率
     */
    public generateTableCards(cards: number[],
        comboRange: [number,number],
        ascProb: number,
        minBreakDiff: number,
        redProb: number,
        redSwitchProb: number,
    ) {
        console.log('===生成桌牌===');
        console.log('cards',cards);
        console.log('comboRange',comboRange);
        console.log('ascProb',ascProb);
        console.log('minBreakDiff',minBreakDiff);
        console.log('maxComboRedProb',redProb);
        console.log('breakSwitchProb',redSwitchProb);
        console.log('======');
        const newCards: number[] = [];
        let last = 0;
        let combo = 0;
        let range = 0;
        const minRange = comboRange[0];
        const rangeDiff = comboRange[1] - comboRange[0];
        for (let i = cards.length - 1; i >= 0; i--) {
            let card = cards[i];
            if (card > 0) {
                // 当有指定的牌时，不生成新牌
                newCards[i] = card;
                last = card;
                combo ++;
                console.log('指定牌：', this.getCardColor(card)/16, this.getCardValue(card));
                continue;
            }
            if (!last) {
                // 如果是首张生成牌，完全随机（后面要考虑maxComboRedProb）
                card = this.generateRandomCard();
                newCards[i] = card;
                last = card;
                combo ++;
                console.log('首张牌：', this.getCardColor(card)/16, this.getCardValue(card));
                continue;
            }
            range = range || Math.round(Math.random() * rangeDiff) + minRange;
            // console.log('range',range);
            if (combo >= range) {
                // 当超过了range就要生成打断牌
                // 通过minBreakDiff
                
                if (Math.random() < redSwitchProb) {
                    redProb = 1 - redProb;
                    console.log('打断时颜色反转');
                }
                card = this.generateRandomCard(last, minBreakDiff, redProb);
                console.log('打断牌：', this.getCardColor(card)/16, this.getCardValue(card));
                newCards[i] = card;
                last = card;
                combo = 1;
                continue;
            } else {
                // 否则继续生成接龙牌
                card = this.generateLinkCard(last, ascProb, redProb);
                newCards[i] = card;
                last = card;
                combo ++;
                console.log('接龙牌：', this.getCardColor(card)/16, this.getCardValue(card));
                continue;
            }
        }
        // console.log('generateTableCards',comboRange,minBreakDiff,ascProb,maxComboRedProb);
        // for (let card of newCards) {
        //     console.log('生成牌：', this.getCardColor(card)/16, this.getCardValue(card));
        // }
        return newCards;
    }

    public generateHandCardValue(bLink: boolean, topTableCards: number[]) {
        console.log('generateHandCardValue',bLink,topTableCards);
        if (bLink) {
            // 第一张手牌 或者 摸牌保底
            return this.generateLinkCard(topTableCards[0]);
        } else {
            return this.generateRandomCard();
        }
    }
    private addSuit(card: number, redProb = 0.5) {
        const random = Math.random();
        let num = 0;
        if (random < redProb) {
            num = Math.floor(Math.random() * 2) * 2;
        } else {
            num = Math.floor(Math.random() * 2) * 2 + 1;
        }
        // const num = Math.floor(Math.random() * 4);
        return this.getCardValue(card) + num * 16;
    }
    private generateLinkCard(card: number, ascProb = 0.5, redProb = 0.5) {
        card = this.getCardValue(card);
        card += Math.random() < ascProb ? 1 : -1;
        if (card > 13) {
            card = 1;
        } else if (card == 0) {
            card = 13;
        }
        card = this.addSuit(card, redProb);
        console.log('generateLinkCard',card);
        return card;
    }
    private generateRandomCard(card?: number, minBreakDiff?: number, redProb = 0.5) {
        if (!card || !minBreakDiff) {
            card = Math.floor(Math.random() * 13) + 1;
            card = this.addSuit(card, redProb);
        } else {
            card = this.getCardValue(card);
            const max = 13 - minBreakDiff * 2;
            const add = Math.round(Math.random() * max);
            card += add;
            if (card > 13) {
                card = card % 13;
            }
        }
        console.log('generateRandomCard',card);
        return card;
    }

    /**两张牌是否可以接龙 */
    public isCanLink(card0: number, card1: number) {
        if (card0 == CardJoker || card1 == CardJoker) {
            return true;
        }
        card0 = this.getCardValue(card0);
        card1 = this.getCardValue(card1);
        const diff = Math.abs(card0 - card1);
        if (diff == 1) {
            return true;
        } else if (diff == 12) {
            return true;
        }
        return false;
    }
    public isCanLinkAnyOne(card: number, cards: number[]) {
        for (const e of cards) {
            if (this.isCanLink(card, e)) {
                return true;
            }
        }
    }

    /**去掉花色后的值 */
    public getCardValue(card: number): number {
        return card & value;
    }

    /**获得花色 */
    public getCardColor(card: number): number {
        return card & color;
    }

    public getCardTaskColor(card: number): TaskColor {
        const color = this.getCardColor(card);
        return color % 0x20 == 0 ? TaskColor.red : TaskColor.black;
    }

    /**随机生成往pool插入牌的idx */
    public randomInsertPoolCardIdxs(poolCardCount: number,insertCount: number) {
        const idxs:number[] = [];
        for (let i = 0; i < insertCount; i++) {
            let idx = Math.round(Math.random() * poolCardCount);
            idxs.push(idx);
        }
        idxs.sort((a,b)=>a-b);
        for (let i = 0; i < idxs.length; i++) {
            idxs[i] = idxs[i] + i;
        }
        return idxs;
    }
    
}

export default new GameLogic();