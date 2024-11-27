import { _decorator } from 'cc';
import { BaseConfig } from '../base/BaseConfig';
const { ccclass, property } = _decorator;


@ccclass('ConfigStore')
export class ConfigStore extends BaseConfig<IBoosterItem> {

}

export interface IBoosterItem {

}