import { _decorator } from 'cc';
const { ccclass, property } = _decorator;


export class BaseConfig<T> {
    private _datas: T[] = [];
    protected get datas() { return this._datas; }
    public initDatas(rows: T[]) {
        this._datas = rows;
    }

    public getItemByIdx(idx: number): T {
        return this._datas[idx];
    }

    public count(): number { return this._datas.length; }
}