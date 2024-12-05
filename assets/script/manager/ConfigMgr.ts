import { director, SpriteFrame, _decorator } from 'cc';
import LocalMgr from './LocalMgr';
import { JsonAsset } from 'cc';
import { js } from 'cc';
import { ResMgr } from './ResMgr';
import { LanguageLabel } from '../components/LanguageLabel';
import { LanguageSprite } from '../components/LanguageSprite';
import { CfgBoosters } from '../configs/CfgBoosters';
import { CfgLevel } from '../configs/CfgLevel';
import { CfgGame } from '../configs/CfgGame';
import { CfgMultiplecoins } from '../configs/CfgMultiplecoins';
const { ccclass, property } = _decorator;

@ccclass('ConfigMgr')
class ConfigMgr {
    //==================表==================
    private _Game: CfgGame;
    public get Game() {
        return this._Game;
    }
    private _Level: CfgLevel;
    public get Level() {
        return this._Level;
    }
    private _Boosters: CfgBoosters;
    public get Boosters() {
        return this._Boosters;
    }
    private _Multiplecoins: CfgMultiplecoins;
    public get Multiplecoins() {
        return this._Multiplecoins;
    }
    //====================================

    // private _support: Array<string> = ["Language_EN"];// 支持的语言代码 英语 印地语
    public language: string = "Language_EN"//当前使用语言

    // private _dataObjMap = {};
    // /**
    // * 获取支持的多语种数组
    // */
    // public get languages(): string[] {
    //     return this._support
    // }

    // //加载和切换 语言包
    // public async setLanguage(lan = 'Language_EN', callback?) {
    //     LocalMgr.instance.setString('cur_lang', lan)
    //     this.current = lan;
    //     this.updateLanguage(lan);
    //     // EventMgr.instance.dispatch(EventName.ChangeLan, lan);
    //     callback && callback();
    //     return true;
    // }

    // /**
    // * 刷新语言文字
    // * @param lang 
    // */
    // public updateLanguage(lang: string) {
    //     let rootNodes = director.getScene()!.children
    //     for (let i = 0; i < rootNodes.length; ++i) {
    //         let languagelabels = rootNodes[i].getComponentsInChildren(LanguageLabel)
    //         for (let j = 0; j < languagelabels.length; j++) {
    //             languagelabels[j].language = lang
    //         }
    //         let languagesprites = rootNodes[i].getComponentsInChildren(LanguageSprite)
    //         for (let j = 0; j < languagesprites.length; j++) {
    //             languagesprites[j].language = lang
    //         }
    //     }
    // }

    public getLangTextByID(labId: string): string {
        // if (!this._dataObjMap[this.language])
        //     return '';
        // return this._dataObjMap[this.language]?.getValueByKey(labId).replace(/\\u003c/g, "<").replace(/\\u003e/g, ">").replace(/#n/g, "\n");
        return '';
    }
    // public getLangTextureByID(fileName, bundleName = "res") {
    //     let lang = this.current
    //     let path = `texture/${lang}/${fileName}/spriteFrame`
    //     let res = ResMgr.instance.get<SpriteFrame>(path, SpriteFrame, bundleName)
    //     return res
    // }

    public loadAllConfig(){
        return ResMgr.instance.loadDir('config','excel',(err, jsonList: JsonAsset[])=>{
            if(!err){
                console.log('####  loadAllConfig ', jsonList)
                for(let i = 0; i < jsonList.length; ++i){
                    // ResUtil.assignWith(jsonList[i], this.node, true);
                    var cls = js.getClassByName('Cfg'+jsonList[i].name);
                    let config:any = new cls();
                    config.initDatas(jsonList[i].json.rows);
                    // this._dataObjMap[jsonList[i].name] = config;
                    this['_'+jsonList[i].name] = config;
                    console.log("localconfig 【%s】 加载成功---------------》", jsonList[i].name)
                }
            }
        })
    }

    // protected onDestroy(): void {
    //     this._dataObjMap = {}
    // }
}

export default new ConfigMgr();