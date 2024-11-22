import { _decorator, Component } from 'cc';
import { ResMgr } from '../manager/ResMgr';
import { UIMgr } from '../manager/UIMgr';
import { GameConfig, UIConfig, UIID } from '../data/GameConfig';
import { Prefab } from 'cc';
import ConfigMgr from '../manager/ConfigMgr';
import HotUpdateMgr from '../manager/HotUpdateMgr';
import { game } from 'cc';
import { Game } from 'cc';
import GameLoader from './GameLoader';
import GameData from './GameData';
import UserModel from '../data/UserModel';
const { ccclass, property } = _decorator;

@ccclass('Launch')
export class Launch extends Component {
    private _hideTime = 0;
    protected onLoad(): void {
        game.on(Game.EVENT_SHOW, this.onGameShow, this);
        game.on(Game.EVENT_HIDE, this.onGameHide, this);
    }
    private onGameShow() {
        // 如果后台超过1小时，重启以检查更新
        if (Date.now() - this._hideTime > 3600000) {
            game.restart();
        }
    }
    private onGameHide() {
        this._hideTime = Date.now();
    }
    start() {
        HotUpdateMgr.instance.checkMainVersion();
        //初始化UI配置表
        UIMgr.instance.initUIConf(UIConfig);
        //初始化基础场景
        this.initGame();
        // //播放背景音乐
        // AudioMgr.instance.playHallBgm();
    }


    private async initUIMask(){
        return ResMgr.instance.load('prefab/comm/mask', Prefab, (err , prefab: Prefab)=>{
            if(err){
                prefab?.decRef();
                return;
            }
            prefab.addRef();
            GameConfig.UIMaskPrefab = prefab;
        })
    }


    private initGame(){
        Promise.all([
            ConfigMgr.instance.loadAllConfig(),
            GameData.loadAllLevelData(),
            GameLoader.loadAllGameRes(),
            // this.initServerConfig(),
            // this.initGameRoot(),
            this.initUIMask()
        ]).then(()=>{
            UserModel.loadUserData()
        }).then(this.enterApp.bind(this));
    }
  
    private enterApp(){
        console.log('#### enterApp');
        UIMgr.instance.open(UIID.UILoading, 
        );
    }

    protected onDestroy(): void {
        game.off(Game.EVENT_SHOW, this.onGameShow, this);
        game.off(Game.EVENT_HIDE, this.onGameHide, this);
    }
}


