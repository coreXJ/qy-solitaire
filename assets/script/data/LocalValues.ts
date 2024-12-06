import { sys } from "cc";
import { IUserData } from "./UserModel";

export enum LocalKey {
    // 用户数据
    userData = "userData",
    // 语言
    language = "language",
    // 音乐
    music = "music",
    // 音效
    sound = "sound",
    // 震动
    shake = "shake",
}

export default class LocalValues {
    static {
        console.log('LocalValues init');
        if (!this.getUserData()) {
            this.setMusic(true);
            this.setSound(true);
            this.setShake(true);
        }
    }
    //============基础功能部分============
    public static setObject(key: string, value: any) {
        sys.localStorage.setItem(key, JSON.stringify(value));
    }
    public static getObject(key: string) {
        const json = sys.localStorage.getItem(key);
        if (!json) return null;
        return JSON.parse(sys.localStorage.getItem(key));
    }
    public static setInteger(key: string, value: number) {
        sys.localStorage.setItem(key, value.toString());
    }
    public static getInteger(key: string) {
        return parseInt(sys.localStorage.getItem(key) || '0');
    }
    public static setString(key: string, value: string) {
        sys.localStorage.setItem(key, value);
    }
    public static getString(key: string) {
        return sys.localStorage.getItem(key);
    }
    public static setBoolean(key: string, value: boolean) {
        sys.localStorage.setItem(key, value.toString());
    }
    public static getBoolean(key: string) {
        return sys.localStorage.getItem(key) === 'true';
    }
    public static removeItem(key: string) {
        sys.localStorage.removeItem(key);
    }
    public static clear() {
        sys.localStorage.clear();
    }
    //============游戏业务部分============
    public static setUserData(data: any) {
        this.setObject(LocalKey.userData, data)
    }
    public static getUserData():IUserData {
        return this.getObject(LocalKey.userData)
    }
    public static setLanguage(lang: string) {
        this.setString(LocalKey.language, lang)
    }
    public static getLanguage() {
        return this.getString(LocalKey.language)
    }
    public static setSound(sound: boolean) {
        this.setBoolean(LocalKey.sound, sound)
    }
    public static getSound() {
        return this.getBoolean(LocalKey.sound)
    }
    public static setMusic(music: boolean) {
        this.setBoolean(LocalKey.music, music)
    }
    public static getMusic() {
        return this.getBoolean(LocalKey.music)
    }
    public static setShake(shake: boolean) {
        this.setBoolean(LocalKey.shake, shake)
    }
    public static getShake() {
        return this.getBoolean(LocalKey.shake)
    }
}