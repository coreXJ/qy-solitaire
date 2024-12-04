import { _decorator } from 'cc';
import { BaseConfig } from '../base/BaseConfig';
const { ccclass, property } = _decorator;


@ccclass('CfgSteakCollection')
export class CfgSteakCollection extends BaseConfig<IBoosterItem> {

}

export interface IBoosterItem {

}