import { _decorator } from 'cc';
import { BaseConfig } from '../base/BaseConfig';
const { ccclass, property } = _decorator;


@ccclass('ConfigGame')
export class ConfigGame extends BaseConfig<IBoosterItem> {

}

export interface IBoosterItem {

}