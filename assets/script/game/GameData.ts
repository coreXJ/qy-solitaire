import { JsonAsset } from "cc";
import { Level, PropID } from "../data/GameObjects";
import { ResMgr } from "../manager/ResMgr";
import ConfigMgr from "../manager/ConfigMgr";

/**
 * 游戏数据中心
 */
class GameData {
    private levelList: Level[] = null;
    private levelMap: { [key: number]: Level } = null;
    private _level: Level = null;

    public get firstLevelId() {
        return this.levelList[0].getLevelId();
    }
    public hasLevel(levelId: number, difficult:1|2|3|4 = 1) {
        // return !!this.levelMap[levelId];
        return ConfigMgr.Level.getLevelId(levelId, difficult);
    }
    public getNextLevel(curLevelId: number, difficult:1|2|3|4 = 1) {
        const level = this.levelList.find(e=>{
            return e.getLevelId()>curLevelId && e.getDifficult()==difficult;
        });
        return level;
    }
    
    public loadAllLevelData() {
        return new Promise<void>((resolve, reject) => {
            ResMgr.instance.loadDir('config','level',(err, assets: JsonAsset[])=>{
                if (err) {
                    reject();
                    return;
                }
                const list = assets.map(e=>Object.assign(new Level(), e.json));
                this.levelList = [...list];
                this.levelList.sort((a, b) => a.id - b.id);
                // 将levelList放进levelMap，id作为key
                this.levelMap = {};
                for (let i = 0; i < this.levelList.length; i++) {
                    this.levelMap[this.levelList[i].id] = this.levelList[i];
                    this.levelList[i]
                    // //===temp
                    // if (this.levelList[i].ascProb === undefined) {
                    //     this.levelList[i].ascProb = 0.65;
                    // }
                }
                resolve();
            });
        });
    }

    public getLevel(levelId: number, difficult:1|2|3|4 = 1): Level {
        let id = ConfigMgr.Level.getLevelId(levelId, difficult);
        return JSON.parse(JSON.stringify(this.levelMap[id]));
    }
}

export default new GameData();