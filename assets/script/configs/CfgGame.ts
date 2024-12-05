import { _decorator } from 'cc';
import { BaseConfig } from '../base/BaseConfig';
const { ccclass, property } = _decorator;


@ccclass('CfgGame')
export class CfgGame extends BaseConfig<IBoosterItem> {
    /**初始金币 */
    public get initialCoin() {
        return parseInt(this.getValue("initialCoin") || '0');
    }
    /**结算基础金币 */
    public get levelCoin() {
        return parseInt(this.getValue("levelCoin") || '0');
    }
    /**结算储备卡金币 */
    public get bonusCoin() {
        return parseInt(this.getValue("bonusCoin") || '0');
    }
    /**结算储备卡金币增量 */
    public get bonusGap() {
        return parseInt(this.getValue("bonusGap") || '0');
    }
    public getValue(key: string) {
        return this.datas.find(e=>e.name == key).config;
    }
}

export interface IBoosterItem {
    id: number;
    type: string;
    name: string;
    config: string;
}