import { _decorator } from 'cc';
import { BaseConfig } from '../base/BaseConfig';
import { BoosterEffectType, BoosterID, PropEffectType, PropID } from '../data/GameObjects';
const { ccclass, property } = _decorator;


@ccclass('CfgBoosters')
export class CfgBoosters extends BaseConfig<IBoosterItem> {
    public getProp(id: PropID) {
        let name = '';
        if (id == PropID.PropAdd) {
            name = 'prop_add'
        } else if (id == PropID.PropJoker) {
            name = 'prop_joker'
        } else if (id == PropID.PropUndo) {
            name = 'prop_undo'
        }
        return this.getRowByName(name);
    }

    public getRowByName(name: string) {
        return this.datas.find(e=>e.name==name);
    }

    public getPropPrice(id: PropID,times = 0) {
        const price = this.getProp(id).price;
        times = Math.min(times, price.length - 1);
        return price[times];
    }

    public getPropEffect(id: PropID) {
        const effect = this.getProp(id).effect;
        return effect;
    }
    public getBooster(id: BoosterID) {
        let name = '';
        if (id == BoosterID.hook) {
            name = 'booster_elimate'
        } else if (id == BoosterID.blow) {
            name = 'booster_slot'
        } else if (id == BoosterID.joker) {
            name = 'booster_joker'
        }
        return this.getRowByName(name);
    }

    public getBoosterEffect(id: BoosterID) {
        const effect = this.getBooster(id).effect;
        return effect;
        // effect.sort((a,b)=>a.effectType-b.effectType);
        // return effect.map(e=>e.times);
    }

    public getMechAdd(winCombo: number) {
        winCombo = Math.min(winCombo, 3);
        return this.getRowByName('mech_add'+winCombo);
    }

    /**连胜奖励是否解锁 */
    public getMechAddUnlock(level: number, winCombo: number) {
        console.log('getMechAddUnlock',level,winCombo);
        winCombo = Math.max(winCombo, 1);
        return level >= this.getMechAdd(winCombo).unlockLevel;
    }
}

export interface IBoosterItem {
    id: number;
    name: string;
    type: string;
    effect: IBoosterEffect[];
    unlockLevel: number;
    price: number[];
    addGuide: number[];
}
export interface IBoosterEffect {
    effectType: PropEffectType | BoosterEffectType;
    times: number;
}