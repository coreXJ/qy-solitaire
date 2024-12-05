import { _decorator } from 'cc';
import { BaseConfig } from '../base/BaseConfig';
const { ccclass, property } = _decorator;


@ccclass('CfgMultiplecoins')
export class CfgMultiplecoins extends BaseConfig<IMultipleCoin> {
    public getItem(level: number) {
        return this.datas.find(e=>e.level==level);
    }

    /**局内道具使用价格倍数 */
    public getPropPriceMultiple(level: number) {
        return this.getItem(level).boostersPrice;
    }
}

interface IMultipleCoin {
    id: number;
    level: number;
    levelBouns: number;
    cardBonus: number;
    boostersPrice: number;
}