import { _decorator } from 'cc';
import { ResMgr } from '../../manager/ResMgr';
import { UIConfig, UIID } from '../../data/GameConfig';
import { Prefab } from 'cc';
const { ccclass, property } = _decorator;

export interface IPreload {
    onPreLoadAssetsProgress(progress: number): void;

    onPreLoadAssetsComplete(): void;
}

class _PreLoadRes {
    private _listener: IPreload = null;
    public set Listener(listener: IPreload){
        this._listener = listener;
    }
    public get Listener(){
        return this._listener;
    }

    private readonly Pre_Res_List: string[] = [
        // UIConfig[UIID.UIRoom].prefab,
        // UIConfig[UIID.UIStore].prefab,
        // UIConfig[UIID.UIDailyBonus].prefab,
        // UIConfig[UIID.UIDeleteAccount].prefab,
        // UIConfig[UIID.UISet].prefab,
        // UIConfig[UIID.UIHelp].prefab,
        // UIConfig[UIID.UIPlayerInfo].prefab,
        // UIConfig[UIID.UIPlayerInfoDialog].prefab,
        // UIConfig[UIID.UILeaveDialog].prefab,
        // UIConfig[UIID.UINetErrorDialog].prefab,
        // UIConfig[UIID.UIFragTask].prefab,
        // UIConfig[UIID.UIFragTaskAwards].prefab,
    ];

    public preLoad(){
        ResMgr.instance.load(this.Pre_Res_List, Prefab, (finished: number, total: number) => {
            if(this._listener){
                let progress = finished / total;
                if (progress == Number.MAX_VALUE || isNaN(progress)) {
                    progress = 0;
                }
                this._listener.onPreLoadAssetsProgress(progress);
            }
        }, (err: Error | null, data: Prefab[]) => {
            if(this._listener){
                this._listener.onPreLoadAssetsComplete();
            }
            if (!err) {
                data.forEach(item => ResMgr.instance.PrefabList.set(item.name, item));;    
            }
        });
    }
}

export const PreLoadRes = new _PreLoadRes();


