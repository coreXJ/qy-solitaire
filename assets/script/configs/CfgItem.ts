import { _decorator } from 'cc';
import { BaseConfig } from '../base/BaseConfig';
const { ccclass, property } = _decorator;


@ccclass('CfgItem')
export class CfgItem extends BaseConfig<IBoosterItem> {

}

export interface IBoosterItem {

}