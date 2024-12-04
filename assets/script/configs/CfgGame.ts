import { _decorator } from 'cc';
import { BaseConfig } from '../base/BaseConfig';
const { ccclass, property } = _decorator;


@ccclass('CfgGame')
export class CfgGame extends BaseConfig<IBoosterItem> {

}

export interface IBoosterItem {

}