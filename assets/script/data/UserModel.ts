import GameData from "../game/GameData";
import { EventMgr, EventName } from "../manager/EventMgr";
import { Booster, BoosterID, PropID } from "./GameObjects";

/**
 * 玩家数据
 */
class UserModel {
    private _gold: number;
    private _curLevelId: number;
    private _winTimes: number; // 连胜次数
    private _props: {
        id: PropID,
        count: number
    }[];
    private _boosters: Booster[];
    
    public loadUserData() {
        // 从local读取用户数据，目前用写死的数据
        this._gold = 1000;
        this._curLevelId = GameData.firstLevelId;
        this._winTimes = 0;
        this._props = [
            {id:PropID.PropAdd,count:3},
            {id:PropID.PropJoker,count:3},
            {id:PropID.PropUndo,count:3}
        ];
        this._boosters = [
            {id:BoosterID.hook,count:3,freetime:0},
            {id:BoosterID.blow,count:3,freetime:0},
            {id:BoosterID.joker,count:3,freetime:0},
        ];
    }
    public get curLevelId() { return this._curLevelId; }
    public nextLevel() {
        const level = GameData.getNextLevel(this.curLevelId);
        if (level) {
            this._curLevelId = level.id;
        }
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
    public addWinTimes() {
        this._winTimes++;
    }
    public breakWinTimes() {
        this._winTimes = 0;
    }
    public get winTimes() {
        return this._winTimes;
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
    public useBooster(boosterId: BoosterID) {
        const booster = this._boosters.find(e=>e.id==boosterId);
        if (booster?.count > 0) {
            booster.count--;
            EventMgr.emit(EventName.onBoosterChange, booster);
            return true;
        }
        return false;
    }
    public getBooster(boosterId: BoosterID) {
        return this._boosters.find(e=>e.id==boosterId);
    }
    public getBoosterCount(boosterId: BoosterID) {
        return this._boosters.find(e=>e.id==boosterId)?.count || 0;
    }
    public addBooster(id: BoosterID, count: number) {
        let booster = this._boosters.find(e=>e.id==id);
        if (booster) {
            booster.count += count;
        } else {
            booster = {id,count,freetime:0};
            this._boosters.push(booster);
        }
        EventMgr.emit(EventName.onBoosterChange, booster);
    }
    /**
     * 添加免费时间
     * @param id 
     * @param ms 单位毫秒
     */
    public addBoosterFreeTime(id: BoosterID, ms: number) {
        let booster = this._boosters.find(e=>e.id==id);
        if (!booster) {
            booster = {id,count:0,freetime:0};
            this._boosters.push(booster);
        }
        const now = Date.now();
        if (booster.freetime < now) {
            booster.freetime = now;
        }
        booster.freetime += ms;
        EventMgr.emit(EventName.onBoosterChange, booster);
    }
    public getFreeBoosters() {
        return this._boosters.filter(e=>e.freetime > Date.now()).map(e=>e.id);
    }
}

export default new UserModel();