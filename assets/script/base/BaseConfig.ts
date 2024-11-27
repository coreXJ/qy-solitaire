import { _decorator } from 'cc';
const { ccclass, property } = _decorator;


export class BaseConfig<T> {
    private _datas: T[] = [];
    public initDatas(rows: T[]) {
        this._datas = rows;
    }
}