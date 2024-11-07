import { Enum, Prefab, _decorator, instantiate } from "cc";
import { ResKeeper } from "./ResKeeper";
import { Widget } from "cc";
import { UITransform } from "cc";
import { view } from "cc";
import { UIViewLoader } from "./UIViewLoader";

/**
 * UIView界面基础类
 * 
 * 1. 快速关闭与屏蔽点击的选项配置
 * 2. 界面缓存设置（开启后界面关闭不会被释放，以便下次快速打开）
 * 3. 界面显示类型配置
 * 
 * 4. 加载资源接口（随界面释放自动释放），this.loadRes(xxx)
 * 5. 由UIMgr.instance释放
 * 
 * 5. 界面初始化回调（只调用一次）
 * 6. 界面打开回调（每次打开回调）
 * 7. 界面打开动画播放结束回调（动画播放完回调）
 * 8. 界面关闭回调
 * 9. 界面置顶回调
 */

const { ccclass, property } = _decorator;

/** 界面展示类型 */
export enum UIShowTypes {
    UIFullScreen,       // 全屏显示，全屏界面使用该选项可获得更高性能
    UIAddition,         // 叠加显示，性能较差
    UISingle,           // 单界面显示，只显示当前界面和背景界面，性能较好
};

export enum UIOpenType {
    UIOpenNone = 0,   //无动画
    UIOpenScale,  //缩放动画
    UIOpenMoveLeft,  //左移动动画
    UIOpenMoveTop,  //下移动动画
    UIOpenCustom = 99, //自定义动画
}

export enum UICloseType {
    UICloseNone = 0,   //无动画
    UICloseScale,  //缩放动画
    UICloseMoveLeft,// 左移收回
    UICloseMoveTop,// 上移收回
    UICloseCustom = 99, //自定义动画
}

/** 全屏装饰器，当显示一个全屏View时，会隐藏其他View */
export function isFullScreen(isFullScreen: boolean) {
    return function<T extends { new(...args: any[]): UIView }>(constructor: T) {
        return class extends constructor {
            bFullScreen = isFullScreen;
        };
    };
}
/** 保持active装饰器，当被别的全屏View盖住也不会隐藏 */
export function isKeepActive(isKeepActive = true) {
    return function<T extends { new(...args: any[]): UIView }>(constructor: T) {
        return class extends constructor {
            bKeepActive: boolean = isKeepActive;
        };
    };
}
@ccclass
export class UIView extends ResKeeper {

    /** 快速关闭 */
    @property
    quickClose: boolean = false;
    /** 屏蔽点击选项 在UIConf设置屏蔽点击*/
    @property
    preventTouch: boolean = true;
    /** 缓存选项 */
    @property
    cache: boolean = false;
    @property
    mask: boolean = false;
    /** 界面显示类型 */
    // @property({ type: Enum(UIShowTypes) })
    // showType: UIShowTypes = UIShowTypes.UISingle;
    /** 界面弹出动画类型 */
    @property({ type: Enum(UIOpenType) })
    openAniType: UIOpenType = UIOpenType.UIOpenNone;
    /** 界面弹出动画类型 */
    @property({ type: Enum(UICloseType) })
    closeAniType: UICloseType = UICloseType.UICloseNone;

    /** 界面id */
    public UIid: number = 0;
    /**  静态变量，用于区分相同界面的不同实例 */
    private static uiIndex: number = 0;

    public uiLoader: UIViewLoader | null;

    public bFullScreen = false;
    public bKeepActive = false;

    public bOpen = false;
    /** 可见状态（不包含动画状态） */
    public get isOpen() {
        return this.bOpen && this.enabled;
    }
    /********************** UI的回调 ***********************/
    /**
     * 当界面被创建时回调，生命周期内只调用一次
     * @param args 可变参数
     */
    public init(...args : any): void {

    }
    
    /**
     * 当界面被打开时回调，每次调用Open时回调
     * @param fromUI 从哪个UI打开的
     * @param args 可变参数
     */
    public onOpen(fromUI: number, ...args : any): void {

    }

    /**
     * 自定义界面开关动画
     */
    public autoExecAnimation(aniName: 'open'|'close', aniOverCallback: () => void) {
    }

    /**
     * 每次界面Open动画播放完毕时回调
     */
    public onOpenAniOver(): void {
    }

    /**
     * 当界面被关闭时回调，每次调用Close时回调
     * 返回值会传递给下一个界面中的 onTop 函数
     */
    public onClose(): any {
        
    }

    /**
     * 当界面被置顶时回调，Open时并不会回调该函数
     * @param preID 前一个ui
     * @param args 可变参数，
     * 暂时废弃
     */
    public onTop(preID: number, ...args : any): void {
        
    }

    // 分解任务 避免阻塞主线程
    protected yieldToMain() {
        return new Promise<void>((resolve, reject)=> {
            this.scheduleOnce(resolve, 0.001);
        })
    }

    /** 全屏，代替widget，主要在动画打开时用到 */
    public fullScreen() {
        const widget = this.getComponent(Widget);
        if (widget) {
            widget.enabled = false;
        }
        const tran = this.getComponent(UITransform);
        tran.setContentSize(view.getVisibleSize())
    }
}
