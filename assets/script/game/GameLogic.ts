/**
 * 游戏逻辑模块
 */

const value = 0x0F;
const color = 0xF0;

class GameLogic {

    /**
     * 生成关卡桌牌
     * @param cards 需要生成的牌列表
     * @param comboRange 连续接龙的牌数范围 
     * @param minBreakDiff 打断牌差额保底
     * @param maxComboRedProb 连续接龙牌红色牌占比
     * @param breakSwitchProb 当打断时，对调maxComboRedProb的概率
     */
    public generateTableCards(cards: number[],
        comboRange: [number,number],
        minBreakDiff: number,
        maxComboRedProb: number,
        breakSwitchProb: number
    ) {
        const newCards: number[] = [];
        let last = 0;
        let combo = 0;
        let range = 0;
        const minRange = comboRange[0];
        const rangeDiff = comboRange[1] - comboRange[0];
        for (let card of cards) {
            if (card > 0) {
                // 当有指定的牌时，不生成新牌
                newCards.push(card);
                last = card;
                combo ++;
                continue;
            }
            if (!last) {
                // 如果是首张生成牌，完全随机（后面要考虑maxComboRedProb）
                card = this.generateRandomCard();
                newCards.push(card);
                last = card;
                combo ++;
                continue;
            }
            range = range || Math.round(Math.random() * rangeDiff) + minRange;
            if (combo > range) {
                // 当超过了range就要生成打断牌
                // 通过minBreakDiff
                card = this.generateRandomCard(card, minBreakDiff);
                newCards.push(card);
                last = 0;
                combo = 0;
                continue;
            } else {
                // 否则继续生成接龙牌
                card = this.generateLinkCard(last);
                newCards.push(card);
                last = card;
                combo ++;
                continue;
            }
        }
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
    private addSuit(card: number) {
        const num = Math.floor(Math.random() * 3);
        return this.getCardValue(card) + num * 16;
    }
    private generateLinkCard(card: number) {
        card = this.getCardValue(card);
        console.log('---0',card);
        card += Math.random() > 0.5 ? 1 : -1;
        if (card > 13) {
            card = 1;
        }
        console.log('---1',card);
        card = this.addSuit(card);
        console.log('generateLinkCard',card);
        return card;
    }
    private generateRandomCard(card?: number, minBreakDiff?: number) {
        if (!card || !minBreakDiff) {
            card = Math.floor(Math.random() * 13) + 1;
            card = this.addSuit(card);
        } else {
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

    /**去掉花色后的值 */
    public getCardValue(card: number): number {
        return card & value;
    }

    /**获得花色 */
    public getCardColor(card: number): number {
        return card & color;
    }

}

export default new GameLogic();