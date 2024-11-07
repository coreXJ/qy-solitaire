import { director, SpriteFrame, _decorator } from 'cc';
import LocalMgr from './LocalMgr';
import { JsonAsset } from 'cc';
import { js } from 'cc';
import { ResMgr } from './ResMgr';
import { LanguageLabel } from '../components/LanguageLabel';
import { LanguageSprite } from '../components/LanguageSprite';
import { Node } from 'cc';
import { Component } from 'cc';
import { ResUtil } from '../comm/ResUtil';
const { ccclass, property } = _decorator;

@ccclass('ConfigMgr')
export default class ConfigMgr extends Component {
    private static _instance: ConfigMgr = null;
    public static get instance() {
        if (!this._instance) {
            let node = new Node('ConfigMgr')
            this._instance = node.addComponent(ConfigMgr);
            director.addPersistRootNode(node);
        }
        return this._instance;
    }

    private _support: Array<string> = ["Language_EN", "Language_ind"];// 支持的语言代码 英语 印地语
    private _current: string = "Language_EN"//当前使用语言
    public get current(): string {
        return this._current
    }
    private set current(value: string) {
        this._current = value
    }

    private _dataObjMap = {};
    /**
    * 获取支持的多语种数组
    */
    public get languages(): string[] {
        return this._support
    }

    //加载和切换 语言包
    public async setLanguage(lan = 'Language_EN', callback?) {
        LocalMgr.instance.setString('cur_lang', lan)
        this.current = lan;
        this.updateLanguage(lan);
        // EventMgr.instance.dispatch(EventName.ChangeLan, lan);
        callback && callback();
        return true;
    }

    /**
    * 刷新语言文字
    * @param lang 
    */
    public updateLanguage(lang: string) {
        let rootNodes = director.getScene()!.children
        for (let i = 0; i < rootNodes.length; ++i) {
            let languagelabels = rootNodes[i].getComponentsInChildren(LanguageLabel)
            for (let j = 0; j < languagelabels.length; j++) {
                languagelabels[j].language = lang
            }
            let languagesprites = rootNodes[i].getComponentsInChildren(LanguageSprite)
            for (let j = 0; j < languagesprites.length; j++) {
                languagesprites[j].language = lang
            }
        }
    }

    public getLangTextByID(labId: string): string {
        if (!this._dataObjMap[this.current])
            return '';
        return this._dataObjMap[this.current]?.getValueByKey(labId).replace(/\\u003c/g, "<").replace(/\\u003e/g, ">").replace(/#n/g, "\n");
    }
    public getLangTextureByID(fileName, bundleName = "res") {
        let lang = this._current
        let path = `texture/${lang}/${fileName}/spriteFrame`
        let res = ResMgr.instance.get<SpriteFrame>(path, SpriteFrame, bundleName)
        return res
    }


    /**
     * 获取RoomMult表配置
     * @param key 选择的房间等级
     * @param type 此房间等级的配置参数名
     * @returns 
     */
    public getRoomMult(key: string, type: string){
        if (!this._dataObjMap['RoomMult'])
            return '';
        return this._dataObjMap['RoomMult']?.getValueByKey(key, type);
    }
    
    public loadAllConfig(){
        return ResMgr.instance.loadDir('res','json',(err, jsonList: JsonAsset[])=>{
            if(!err){
                console.log('####  loadAllConfig ', jsonList)
                for(let i = 0; i < jsonList.length; ++i){
                    ResUtil.assignWith(jsonList[i], this.node, true);
                    var cls = js.getClassByName(jsonList[i].name);
                    let dataObj = new cls();
                    dataObj['DataMap'] = jsonList[i].json;  
                    this._dataObjMap[jsonList[i].name] = dataObj;
                    console.log("localconfig 【%s】 加载成功---------------》", jsonList[i].name)
                }
            }
        })
    }

    clearAllConfig(){
        this._dataObjMap = {}
    }

    protected onDestroy(): void {
        this._dataObjMap = {}
    }

}