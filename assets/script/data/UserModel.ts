import GameData from "../game/GameData";
import ConfigMgr from "../manager/ConfigMgr";
import { EventMgr, EventName } from "../manager/EventMgr";
import { Booster, BoosterID, Prop, PropID } from "./GameObjects";
import LocalValues, { LocalKey } from "./LocalValues";

/**
 * 玩家数据
 */
class UserModel {
    private _gold: number;
    private _curLevelId: number;
    private _winTimes: number; // 连胜次数
    private _props: Prop[];
    private _boosters: Booster[];
    
    public loadUserData() {
        // 从local读取用户数据，目前用写死的数据
        const userData = LocalValues.getUserData();
        if (!userData) {
            this._gold = ConfigMgr.Game.initialCoin;
            this._curLevelId = GameData.firstLevelId;
            this._winTimes = 0;
            this._props = [
                {id:PropID.PropAdd,count:0},
                {id:PropID.PropJoker,count:0},
                {id:PropID.PropUndo,count:0}
            ];
            this._boosters = [
                {id:BoosterID.hook,count:0,freetime:0},
                {id:BoosterID.blow,count:0,freetime:0},
                {id:BoosterID.joker,count:0,freetime:0},
            ];
            this.saveUserData();
        } else {
            this._gold = userData.gold;
            this._curLevelId = userData.curLevelId;
            this._winTimes = userData.winTimes;
            this._props = userData.props;
            this._boosters = userData.boosters;
        }
    }
    private _saveTimeout: number;
    public saveUserData() {
        clearTimeout(this._saveTimeout);
        this._saveTimeout = setTimeout(()=>{
            // 保存用户数据
            const userData:IUserData = {
                gold: this._gold,
                curLevelId: this._curLevelId,
                winTimes: this._winTimes,
                props: this._props,
                boosters: this._boosters
            };
            LocalValues.setUserData(userData);
            console.log('saveUserData');
        }, 500);
    }
    public clearUserData() {
        console.log('clearUserData');
        LocalValues.removeItem(LocalKey.userData);
    }
    public get curLevelId() { return this._curLevelId; }
    public nextLevel() {
        const level = GameData.getNextLevel(this.curLevelId);
        if (level) {
            this._curLevelId = level.getLevelId();
            EventMgr.emit(EventName.onCurLevelChange,this._curLevelId);
            this.saveUserData();
        }
    }
    public setLevelId(levelId: number) {
        if (GameData.hasLevel(levelId)) {
            this._curLevelId = levelId;
            EventMgr.emit(EventName.onCurLevelChange,this._curLevelId);
            this.saveUserData();
            return true;
        }
    }
    public get gold() {
        return this._gold;
    }
    
    public addGold(gold: number) {
        this._gold += gold;
        EventMgr.emit(EventName.onGoldChange, this._gold);
        this.saveUserData();
    }
    public costGold(gold: number) {
        if (this.isEnoughGold(gold)) {
            this._gold -= gold;
            EventMgr.emit(EventName.onGoldChange, this._gold);
            this.saveUserData();
            return true;
        }
        return false;
    }
    public setGold(gold: number) {
        this._gold = gold;
        EventMgr.emit(EventName.onGoldChange, this._gold);
        this.saveUserData();
    }
    public isEnoughGold(gold: number) {
        return this._gold >= gold;
    }
    public getPropCount(propId: PropID) {
        return this._props.find(e=>e.id==propId)?.count || 0;
    }
    public addWinTimes() {
        this._winTimes++;
        EventMgr.emit(EventName.onWinTimesChange, this._winTimes);
        this.saveUserData();
    }
    public breakWinTimes() {
        this._winTimes = 0;
        EventMgr.emit(EventName.onWinTimesChange, this._winTimes);
        this.saveUserData();
    }
    public setWinTimes(winTimes: number) {
        this._winTimes = winTimes;
        EventMgr.emit(EventName.onWinTimesChange, this._winTimes);
        this.saveUserData();
    }
    public get winCombo() {
        return this._winTimes;
    }
    public useProp(propId: PropID) {
        const prop = this._props.find(e=>e.id==propId);
        if (prop?.count > 0) {
            prop.count--;
            EventMgr.emit(EventName.onPropChange, propId, prop.count);
            this.saveUserData();
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
        this.saveUserData();
    }
    public setProp(id: PropID, count: number) {
        const prop = this._props.find(e=>e.id==id);
        if (prop) {
            prop.count = count;
        } else {
            this._props.push({id,count});
        }
        EventMgr.emit(EventName.onPropChange, id, prop.count);
        this.saveUserData();
    }
    public useBooster(boosterId: BoosterID) {
        const booster = this._boosters.find(e=>e.id==boosterId);
        if (booster?.count > 0) {
            booster.count--;
            EventMgr.emit(EventName.onBoosterChange, booster);
            this.saveUserData();
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
        this.saveUserData();
    }
    public setBooster(id: BoosterID, count: number) {
        let booster = this._boosters.find(e=>e.id==id);
        if (booster) {
            booster.count = count;
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
        this.saveUserData();
    }
    public setBoosterFreeTime(id: BoosterID, ms: number) {
        let booster = this._boosters.find(e=>e.id==id);
        if (!booster) {
            booster = {id,count:0,freetime:0};
            this._boosters.push(booster);
        }
        booster.freetime = Date.now() + ms;
        EventMgr.emit(EventName.onBoosterChange, booster);
    }
    public getFreeBoosters() {
        return this._boosters.filter(e=>e.freetime > Date.now()).map(e=>e.id);
    }

    public get isUnlockWinCombo() {
        return true;
        return ConfigMgr.Boosters.getMechAddUnlock(this.curLevelId, this.winCombo);
    }
}

export default new UserModel();

export interface IUserData {
    gold: number;
    curLevelId: number;
    winTimes: number;
    props: Prop[];
    boosters: Booster[];
}