import { Vec3 } from "cc";
import { CardType, Level } from "./GameObjects";

/**
 * 游戏数据中心
 */
class GameData {
    private levelList: Level[] = null;
    private levelMap: { [key: number]: Level } = null;

    public loadAllLevelData() {
        // 从config/level目录读取json数据，初始化levelList
        const list:Level[] = [ // 假数据先用着
            {
                id: 0,
                name: "Level 1",
                group: "group1",
                tableComboRange: [4, 7],
                minBreakDiff: 2,
                maxComboRedProb: 0.5,
                breakSwitchProb: 0.5,
                tableCards: [
                    {
                        value: 0,
                        type: CardType.table,
                        tIdx: 0,
                        tType: 0,
                        tPos: new Vec3(-50.5, 0),
                        tLayer: 0,
                        tAngle: new Vec3(0, 0),
                    },
                    {
                        value: 0,
                        type: CardType.table,
                        tIdx: 1,
                        tType: 0,
                        tPos: new Vec3(0, 0),
                        tLayer: 0,
                        tAngle: new Vec3(0, 0),
                    },
                    {
                        value: 0,
                        type: CardType.table,
                        tIdx: 2,
                        tType: 0,
                        tPos: new Vec3(50.5, 0),
                        tLayer: 0,
                        tAngle: new Vec3(0, 0),
                    },
                ],
                poolCount: 10,
                handCardValue: 0
            }
        ];
        this.levelList = [...list];
        this.levelList.sort((a, b) => a.id - b.id);
        // 将levelList放进levelMap，id作为key
        this.levelMap = {};
        for (let i = 0; i < this.levelList.length; i++) {
            this.levelMap[this.levelList[i].id] = this.levelList[i];
        }
    }

    public getLevel(levelId: number): Level {
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