import { AudioSource } from "cc";
import { AudioClip } from "cc";
import { playAudioType } from "../data/GameConfig";
import { Node } from "cc";
import { assetManager } from "cc";
import { ResMgr } from "../manager/ResMgr";

export default class MyAudio {
    audioSource: AudioSource;
    audioClip: AudioClip;
    audioType: playAudioType;
    playTime: number;
    bundle: string;
    url: string;
    private _audioName: string = "";
    public get audioName() {
        return this._audioName;
    }
    public set audioName(name: string) {
        this._audioName = name;
    }
    private isLoad: boolean = false;
    private isRelease: boolean = false;
    public EventHandler: any;
    static index: number = 0;
    constructor(node: Node) {
        let audioNode = new Node();
        audioNode.name = "MyAudio" + MyAudio.index++;
        audioNode.setParent(node);
        this.audioSource = audioNode.addComponent(AudioSource);
        this.audioSource.playOnAwake = false;
        audioNode.on(AudioSource.EventType.ENDED, this.handlerEvent.bind(this), audioNode);
    }

    private handlerEvent(eType: any) {
        // console.log("播放音频结束")
        this.audioSource.clip = null;
    }

    public get isPlaying(): boolean {
        return this.isLoad || this?.audioSource?.playing
    }

    //播放音效
    public async playMusic(bundle: string, url: string, type: playAudioType, loop: boolean = false) {
        if(this.url == url && this.isPlaying && loop)
            return;
        if (this.audioSource && !this.isLoad) {
            this.audioType = type;
            this.bundle = bundle;
            this.url = url;
            this.isRelease = false;
            this.playTime = Date.now();
            this.audioSource.stop();
            let clip = await this.load(bundle, `AudioClip/${url}`);
            if (clip && clip.isValid) {
                if (this.isRelease) {
                    assetManager.releaseAsset(clip)
                    return;
                }
                this.audioSource.clip = clip;
                this.audioSource.loop = loop;
                this.audioSource.play();
                return this.audioSource;
            }
            else {
                console.error("load invalid audio " + bundle + url)
            }
        }
    }

    //暂停播放
    public pause() {
        if (this.audioSource.playing)
            this.audioSource.pause();
    }

    //恢复播放
    public resume() {
        //如果暂停状态
        if (this.audioSource.clip && this.audioSource.state == 2) {
            this.audioSource.play();
        }
    }

    //停止播放
    public stop() {
        this.audioSource.stop();
    }

    //清理播放数据
    public clear() {

    }

    //获取播放状态
    public state() {
        if (this.audioSource)
            return this.audioSource.state;
        return -1;
    }

    public release() {
        if (this.isLoad) {
            this.isRelease = true;
            return;
        }
        this.audioSource.stop();
        if (this.audioSource.clip) {
            assetManager.releaseAsset(this.audioSource.clip)
            this.audioSource.clip = null;
        }
    }

    public toString() {
        return `${this.bundle}/${this.url} State: ${this.state()}`;
    }

    //设置音量
    public setValume(val: number) {
        this.audioSource.volume = val;
    }

    public getValume() {
        return this.audioSource.volume;
    }

    private async load(bundle: string, url: string): Promise<AudioClip> {
        this.isLoad = true;
        const clip = await ResMgr.instance.load<AudioClip>(bundle, url, AudioClip);
        this.isLoad = false;
        return clip;
    }
}