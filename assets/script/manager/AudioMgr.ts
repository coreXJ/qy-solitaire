import { _decorator, Component, Node, AudioSource, Game, director } from 'cc';
import { EventMgr } from './EventMgr';
import LocalMgr from './LocalMgr';
import MyAudio from '../components/MyAudio';
import { EButtonSoundType, SoundUrl, playAudioType } from '../data/GameConfig';
import { tween } from 'cc';
import { Tween } from 'cc';
// import { NativeHelper } from '../NativeApi/NativeHelper';
const { ccclass, property } = _decorator;

@ccclass('AudioMgr')
export default class AudioMgr extends Component {
    public static SoundUrl = SoundUrl;
    private static _instance: AudioMgr = null;
    public static get instance() {
        if (!this._instance) {
            let node = new Node("AudioMgr")
            this._instance = node.addComponent(AudioMgr);
            this._instance.init();
            director.addPersistRootNode(node);
        }
        return this._instance;
    }

    //音效播放器
    private _oneShotAudioInfoList: MyAudio[] = [];
    //背景音乐播放器
    private _musicAudio: MyAudio;
    private _localData: any = {};
    private _volumeMusic: number = 1;
    private _volumeEffect: number = 1;
    private _switchMusic: boolean = true;
    private _switchEffect: boolean = true;
    private _switchVibration: boolean = true;
    private _cacheMusiceBundle: string = ""
    private _cacheMusiceUrl: string = ""
    //是否切入后台
    private _applicationHide = false;
    //本地存储标签名
    private _localStorageTag: string = "game_volume";

    private onApplicationHide() {
        this.pauseAll();
        this._applicationHide = true;
    }

    private onApplicationShow() {
        this.resumeAll();
        this._applicationHide = false;
    }

    private init() {
        EventMgr.on(Game.EVENT_HIDE, this.onApplicationHide, this)
        EventMgr.on(Game.EVENT_SHOW, this.onApplicationShow, this)
        let data = LocalMgr.instance.getJson(this._localStorageTag)
        if (data) {
            try {
                this._localData = data;
                this._volumeMusic = this._localData.volume_music;
                this._volumeEffect = this._localData.volume_effect;
                this._switchMusic = this._localData.switch_music;
                this._switchEffect = this._localData.switch_effect;
                this._switchVibration = this._localData.switchVibration;
            }
            catch (e) {
                this._localData = {};
                this._volumeMusic = 1;
                this._volumeEffect = 1;
                this._switchMusic = true;
                this._switchEffect = true;
                this._switchVibration = true;
            }
        }
    }

    private getAudio(): MyAudio | undefined {
        let audio: MyAudio | undefined;
        for (let i = 0; i < this._oneShotAudioInfoList.length; i++) {
            if (this._oneShotAudioInfoList[i] && !this._oneShotAudioInfoList[i].isPlaying) {
                return this._oneShotAudioInfoList[i];
            }
        }

        if (this._oneShotAudioInfoList.length + 2 >= AudioSource.maxAudioChannel) {
            let tempAudio: MyAudio | undefined
            for (let i = 0; i < this._oneShotAudioInfoList.length; i++) {
                if (this._oneShotAudioInfoList[i].audioType == playAudioType.OneShotAduio) {
                    if (!tempAudio || this._oneShotAudioInfoList[i].playTime < tempAudio.playTime) {
                        tempAudio = this._oneShotAudioInfoList[i]
                    }
                }
            }
            if (tempAudio) {
                tempAudio.stop();
            }
            return tempAudio;
        }
        audio = new MyAudio(this.node);
        this._oneShotAudioInfoList.push(audio);
        return audio;
    }

    //******************************* 常用接口 ******************************************* */

    //播放音效
    public playEffect(url: string, bundleName: string = 'res',loop = false) {
        if (!this._switchEffect || this._applicationHide) return;
        let audio = this.getAudio();
        audio.audioName = url;
        audio.setValume(1);
        return audio?.playMusic(bundleName, url, playAudioType.OneShotAduio,loop)
    }

    //播放音乐
    public playMusic(url: string, bundleName: string = 'res',loop = true) {
        if (!this._switchMusic || this._applicationHide) {
            this._cacheMusiceBundle = bundleName;
            this._cacheMusiceUrl = url;

            return;
        }
        if (!this._musicAudio) {
            this._musicAudio = new MyAudio(this.node);
        }
        return this._musicAudio.playMusic(bundleName, url, playAudioType.Play, loop)
    }

    //场景切换时释放音效资源（例如从游戏回到大厅）
    public release(bundle: string) {
        if (this._musicAudio?.bundle == bundle) {
            this._musicAudio.release();
        }
        this._oneShotAudioInfoList.forEach((audio) => {
            if (audio?.bundle == bundle) audio.release();
        })
    }

    /** 音乐开关 */
    public getSwitchMusic(): boolean {
        return this._switchMusic;
    }

    //切换音乐状态
    public setSwitchMusic(value: boolean) {
        console.log("setSwitchMusic ------------>", value)
        this._switchMusic = value;
        this._save()

        if (this._switchMusic == false)
            this._stop(playAudioType.Play);
        else {
            if (this._cacheMusiceBundle && this._cacheMusiceUrl) {
                this.playMusic(this._cacheMusiceUrl, this._cacheMusiceBundle)
            } else {
                this._musicAudio && this._musicAudio?.audioSource?.play();
            }
        }
    }

    /** 音效开关 */
    public getSwitchEffect(): boolean {
        return this._switchEffect;
    }

    //切换音效状态
    public setSwitchEffect(value: boolean) {
        this._switchEffect = value;
        this._save()
        if (value == false) {
            this._stop(playAudioType.OneShotAduio);
        }
    }

    //特殊需求 播放循环音效
    public playLoopEffect(url: string, bundleName = 'res') {
        if (!this._switchEffect || this._applicationHide) return;
        let audio = this.getAudio();
        audio.setValume(1);
        audio.audioName = url;
        audio?.playMusic(bundleName, url, playAudioType.OneShotAduio, true)
    }

    //特殊需求 停止循环音效
    public stopLoopEffect(url: string) {
        this._oneShotAudioInfoList.forEach((audio) => {
            if (audio.audioName == url) {
                audio.stop();
            }
        })
    }

    //设置背景音乐大小
    public setMusicValume(val: number) {
        if (this._musicAudio) {
            this._musicAudio.setValume(val);
        }
    }

    //播放大厅背景音乐
    public playHallBgm() {
        // this.playMusic(SoundUrl.Hall_Bgm);
    }

    //停止大厅背景音乐
    public stopHallBgm() {
        this.stopMusic();
    }

    //播放游戏背景音乐
    public playGameBgm() {
        // this.playMusic(SoundUrl.Game_Bgm);
    }

    //播放按钮点击音效
    public playButtonSound(soundType: EButtonSoundType = EButtonSoundType.COMMON) {
        switch(soundType){
            case EButtonSoundType.COMMON:
                this.playEffect(SoundUrl.Common_Button_All);
                break;
            case EButtonSoundType.CLOSE:
                this.playEffect(SoundUrl.Common_Close_All);
                break;                    
            default:
                break;
        }       
    }
    

    //播放震动
    public playVibration() {
        if (!this._switchVibration) return;
        // NativeHelper.vibrate();
    }

    /** 震动开关 */
    public getSwitchVibration(): boolean {
        return this._switchVibration;
    }

    //切换震动状态
    public setSwitchVibration(value: boolean) {
        this._switchVibration = value;
        this._save()
        if (value == false) {
            // NativeApi.stopVibrate();
        } else {
            this.playVibration();
        }
    }

    public pauseAll() {
        this._pause(playAudioType.Play)
        this._pause(playAudioType.OneShotAduio)
    }

    public resumeAll() {
        if (this._switchMusic)
            this._resume(playAudioType.Play)
        if (this._switchEffect)
            this._resume(playAudioType.OneShotAduio)
    }

    public stopAll() {
        this._stop(playAudioType.Play)
        this._stop(playAudioType.OneShotAduio)
    }

    public stopAllEffect() {
        this._stop(playAudioType.OneShotAduio)
    }

    private _tweenObj = {value: 0};
    public fadeOutAllEffect() {
        // 0.5秒内fadeout所有当前播放的音效
        Tween.stopAllByTarget(this._tweenObj);
        this._tweenObj.value = 1;
        const arr = this._oneShotAudioInfoList.filter(e=>e.isPlaying);
        tween(this._tweenObj).to(0.5, {value:0}, {onUpdate: ()=>{
            arr.forEach((audio) => {
                if (audio.isPlaying) {
                    audio.setValume(this._tweenObj.value);
                    if (this._tweenObj.value == 0) {
                        audio.stop();
                    }
                }
            })
        }}).start();
    }

    //兼容留下的接口
    public stopMusic() {
        this._musicAudio?.stop();    
    }
    public stopEffect() { }

    //******************************* 常用接口 ******************************************* */

    private _save() {
        this._localData.volume_music = this._volumeMusic;
        this._localData.volume_effect = this._volumeEffect;
        this._localData.switch_music = this._switchMusic;
        this._localData.switch_effect = this._switchEffect;
        this._localData.switchVibration = this._switchVibration;
        LocalMgr.instance.setJson(this._localStorageTag, this._localData);
    }


    private _pause(audioType: playAudioType) {
        console.log(`pause `, audioType);
        if (audioType == playAudioType.Play) {
            this._musicAudio?.pause();
        }
        else {
            this._oneShotAudioInfoList.forEach((audio) => {
                audio.pause();
            });
        }
    }

    private _resume(audioType: playAudioType) {
        if (audioType == playAudioType.Play)
            this._musicAudio?.resume();
        else
            this._oneShotAudioInfoList.forEach((audio) => {
                audio.resume();
            })
    }

    private _stop(audioType: playAudioType) {
        if (audioType == playAudioType.Play)
            this._musicAudio?.stop();
        else
            this._oneShotAudioInfoList.forEach((audio) => {
                audio.stop();
            })
    }

}
