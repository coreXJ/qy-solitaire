import { _decorator } from 'cc';
import { BaseConfig } from '../base/BaseConfig';
const { ccclass, property } = _decorator;


@ccclass('CfgLevel')
export class CfgLevel extends BaseConfig<ILevelItem> {
    public getItemById(id: number) {
        return this.datas.find(v => v.id === id);
    }
    public getLevelId(id: number, difficult:1|2|3|4 = 1) {
        const e = this.getItemById(id);
        return e[`difficult${difficult}`];
    }
    public getFirstId() {
        return this.datas[0].id;
    }
}

export interface ILevelItem {
    id: number;
    level: number;
    difficult1: number;
    difficult2: number;
    difficult3: number;
    difficult4: number;
    remark: string;
}