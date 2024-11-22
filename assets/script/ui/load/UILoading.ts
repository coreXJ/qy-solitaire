import { _decorator, Label, ProgressBar, Tween } from 'cc';
import { LoginTypeID, UIID } from '../../data/GameConfig';
import { UIView } from '../../base/UIView';
import LocalMgr from '../../manager/LocalMgr';
import { UIMgr } from '../../manager/UIMgr';
import { IPreload, PreLoadRes } from './PreLoadRes';
import HttpApi from '../../net/HttpApi';
const { ccclass, property } = _decorator;

export enum ELoadingType{
    LoadingNone,
    LoadingRes,//加载资源
    LoadingNet,//加载网络
}

@ccclass('UILoading')
export class UILoading extends UIView implements IPreload {
    @property(ProgressBar)
    private progressbar: ProgressBar = null;
    @property(Label)
    private tipLabel: Label = null;
    private _loadingType: ELoadingType = ELoadingType.LoadingNone; 
    private _loadingResDone: boolean = false;
    private _loadingNetDone: boolean = false;
    private _autoLogin: boolean = false;

    private readonly ResPercent: [number, number] = [0.0, 0.8];
    private readonly NetPercent: [number, number] = [0.8, 1.0];
    private readonly AllPercent: [number, number] = [0.0, 1.0];

    public init(...args : any): void {
        PreLoadRes.Listener = this;
    }

    public onOpen(fromUI: number, args: ELoadingType): void {
        console.log('### onOpen ==> ')
        this.setProgress(0);
        this._loadingType = args;
        this.goToLoading();
        this.registerEventListener(true);
        this.forConnectComplete();//因为没有服务器，所以算连接成功
    }

    private setProgress(per: number) {
        this.progressbar.progress = per;
        this.tipLabel.string = Math.round(per * 100) + '%';
    }

    private registerEventListener(bReg: boolean) {
        // let fun = bReg ? "on" : "off";
    }

    /**本次loading是展示网络连接进度 */
    private forConnect(percent: [number, number]): void {
        this.progressbar.node.active = true;
        this.setProgress(percent[0]);
        Tween.stopAllByTarget(this.progressbar);
        new Tween(this.progressbar)
            .to(0.01,{progress: this.progressbar.progress + (percent[1] - this.progressbar.progress) * 0.015})
            .repeatForever()
            .start();
    }

    private forConnectComplete(): void {
        Tween.stopAllByTarget(this.progressbar);
        this._loadingNetDone = true;
        if(this._loadingResDone){
            const obj = {v:0};
            new Tween(obj)
                .to(0.1,{v: 1},{onUpdate:(target, ratio)=> {
                    this.setProgress(target.v);
                },})
                .call(()=>{
                    UIMgr.instance.open(UIID.UIHall,null,()=>{
                        UIMgr.instance.close(UIID.UILoading);
                    });
                })
                .start();
        }
    }

    public onPreLoadAssetsProgress(progress: number): void {
        this.progressbar.node.active = true;
        const percent = this.ResPercent; //this._autoLogin ? this.ResPercent : this.AllPercent;
        this.setProgress(percent[0] + progress * percent[1]);
    }

    public onPreLoadAssetsComplete(): void {
        this._loadingResDone = true;
        if(this._loadingNetDone){
            this.forConnectComplete();
        }else{
            this.forConnect(this.NetPercent);
        }
    }

    public onClose(): any {
        Tween.stopAllByTarget(this.node);
        this.unscheduleAllCallbacks();
        this.registerEventListener(false);
    }

    /**
     * 1.loading资源 链接网络
     * 如果是自动登录  loading资源到80%，判断网络链接成功？ 有 0.3-》20 没 无线移动 链接成功后，到100% 进入大厅
     * 如果不是自动登录 到登录页   点击登录回到loading页 loading资源到80% 判断网络链接成功？ 有 0.3-》20 没 无线移动 链接成功后，到100% 进入大厅
     */
    private goToLoading() {
        if(this._loadingType == ELoadingType.LoadingRes){
            this._autoLogin = this.checkAutoLogin();
            if(this._autoLogin){
                console.log('### UILoading LoadRes auto Login')
                this.setProgress(0);
                PreLoadRes.preLoad();
            }else{
                console.log('### UILoading LoadRes munual Login')
            }
        }else{
            console.log('### UILoading LoadNet')
            this.setProgress(0);
            PreLoadRes.preLoad();
        }
    }
    //自动登录判断保存的token是否为非游客
    private checkAutoLogin() {
        return true; // 目前只有游客自动登录
        const loginType: LoginTypeID = LocalMgr.instance.getNumber('login_type', 0);
        if (loginType != LoginTypeID.Guest) {
            let token = LocalMgr.instance.getString('token', '');
            let uid = LocalMgr.instance.getNumber('uid', 0);
            if (token && uid) {
                return true;
            }
        }
        return false;
    }

}


