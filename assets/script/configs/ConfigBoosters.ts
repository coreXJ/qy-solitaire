import { _decorator } from 'cc';
import { BaseConfig } from '../base/BaseConfig';
const { ccclass, property } = _decorator;


@ccclass('ConfigBoosters')
export class ConfigBoosters extends BaseConfig<IBoosterItem> {

}

export interface IBoosterItem {

}