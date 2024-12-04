import { _decorator } from 'cc';
import { BaseConfig } from '../base/BaseConfig';
const { ccclass, property } = _decorator;


@ccclass('CfgBoosters')
export class CfgBoosters extends BaseConfig<IBoosterItem> {

}

export interface IBoosterItem {

}