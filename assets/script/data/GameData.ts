import { JsonAsset, Vec3 } from "cc";
import { CardType, Level } from "./GameObjects";
import { PropID } from "./GameConfig";
import { EventMgr, EventName } from "../manager/EventMgr";
import { ResMgr } from "../manager/ResMgr";

/**
 * 游戏数据中心
 */
class GameData {
    private levelList: Level[] = null;
    private levelMap: { [key: number]: Level } = null;
    private _level: Level = null;
    //===userdata===
    private _gold: number;
    private _curLevelId: number;
    private _props: {id:PropID,count:number}[];
    //===end===

    public loadUserData() {
        // 从local读取用户数据，目前用写死的数据
        this._gold = 1000;
        this._curLevelId = this.firstLevelId;
        this._props = [
            {id:PropID.PropAdd,count:3},
            {id:PropID.PropJoker,count:3},
            {id:PropID.PropUndo,count:3}
        ];
    }
    public get firstLevelId() {
        return this.levelList[0].id;
    }
    public get gold() {
        return this._gold;
    }
    
    public addGold(gold: number) {
        this._gold += gold;
        EventMgr.emit(EventName.onGoldChange, this._gold);
    }
    public costGold(gold: number) {
        if (this.isEnoughGold(gold)) {
            this._gold -= gold;
            EventMgr.emit(EventName.onGoldChange, this._gold);
            return true;
        }
        return false;
    }
    public isEnoughGold(gold: number) {
        return this._gold >= gold;
    }
    public getPropCount(propId: PropID) {
        return this._props.find(e=>e.id==propId)?.count || 0;
    }
    public useProp(propId: PropID) {
        const prop = this._props.find(e=>e.id==propId);
        if (prop?.count > 0) {
            prop.count--;
            EventMgr.emit(EventName.onPropChange, propId, prop.count);
            return true;
        }
        return false;
    }
    public addProp(id: PropID, count: number) {
        const prop = this._props.find(e=>e.id==id);
        if (prop) {
            prop.count += count;
        } else {
            this._props.push({id,count});
        }
        EventMgr.emit(EventName.onPropChange, id, prop.count);
    }
    public get curLevelId() { return this._curLevelId; }
    public nextLevel() {
        const level = this.levelList.find(e=>e.id>this._curLevelId);
        if (level) {
            this._curLevelId = level.id;
        }
    }
    
    public loadAllLevelData() {
        // 从config/level目录读取json数据，初始化levelList
        // const list:Level[] = [ // 假数据先用着
        //     {
        //         id: 0,
        //         name: "Level 1",
        //         group: "group1",
        //         tableComboRange: [6, 7],
        //         minBreakDiff: 2,
        //         maxComboRedProb: 0.5,
        //         breakSwitchProb: 0.5,
        //         tableCards: [
        //             {
        //                 value: 0,
        //                 type: CardType.table,
        //                 tIdx: 0,
        //                 tType: 0,
        //                 tPos: new Vec3(-50.5, 0),
        //                 tLayer: 0,
        //                 tAngle: 0,
        //             },
        //         ],
        //         poolCount: 10,
        //         handCardValue: 0
        //     }
        // ];
        return new Promise<void>((resolve, reject) => {
            ResMgr.instance.loadDir('config','level',(err, assets: JsonAsset[])=>{
                if (err) {
                    reject();
                    return;
                }
                const list:Level[] = <any>assets.map(e=>e.json);
                this.levelList = [...list];
                this.levelList.sort((a, b) => a.id - b.id);
                // 将levelList放进levelMap，id作为key
                this.levelMap = {};
                for (let i = 0; i < this.levelList.length; i++) {
                    this.levelMap[this.levelList[i].id] = this.levelList[i];
                }
                resolve();
            });
        });
    }

    public getLevel(levelId = this._curLevelId): Level {
        return JSON.parse(JSON.stringify(this.levelMap[levelId]));
    }

    // public loadAllLevel() {
    //     return ResMgr.instance.loadDir('res','level',(err, jsonList: JsonAsset[])=>{
    //         if(!err){
    //             console.log('####  loadAllConfig ', jsonList)
    //             for(let i = 0; i < jsonList.length; ++i){
    //                 ResUtil.assignWith(jsonList[i], this.node, true);
    //                 var cls = js.getClassByName(jsonList[i].name);
    //                 let dataObj = new cls();
    //                 dataObj['DataMap'] = jsonList[i].json;  
    //                 this._dataObjMap[jsonList[i].name] = dataObj;
    //                 console.log("localconfig 【%s】 加载成功---------------》", jsonList[i].name)
    //             }
    //         }
    //     })
    // }
}

export default new GameData();