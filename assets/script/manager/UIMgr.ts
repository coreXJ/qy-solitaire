import { _decorator, Component, Node, director, UITransform, instantiate, isValid, Prefab, Tween, Vec3, UIOpacity, v3, view, tween, NodePool } from 'cc';
import { AutoPopViewMgr } from './AutoPopViewMgr';
import LocalConfigMgr from './ConfigMgr';
import { UICloseType, UIOpenType, UIView } from '../base/UIView';
import { ResMgr } from './ResMgr';
import { GameConfig, IUiConf, MASK_OPACITY, UIID } from '../data/GameConfig';
import { js } from 'cc';
import { UIViewLoader } from '../base/UIViewLoader';
import { EventTouch } from 'cc';

const { ccclass, property } = _decorator;

/**
 * UIMgr.instance界面管理类
 *
 * 1.打开界面，根据配置自动加载界面、调用初始化、播放打开动画、隐藏其他界面、屏蔽下方界面点击
 * 2.关闭界面，根据配置自动关闭界面、播放关闭动画、恢复其他界面
 * 3.切换界面，与打开界面类似，但是是将当前栈顶的界面切换成新的界面（先关闭再打开）
 * 4.提供界面缓存功能
 * 
 */

/** UI栈结构体 */
export interface IUiInfo {
    uiId: number;
    uiView: UIView | null;
    uiArgs: UIArgs;
    preventNode?: Node | null;
    isClose?: boolean;
    uiOpenCompteletCallBack?: (uiview: UIView)=>void;
    unfoldFromPos?: Vec3;
  
    // resToClear?: string[];
    // resCache?: string[];
}

type UIArgs = {
    [key: string]: any,
    [index: number]: any,
    /** 界面打开动画 */
    openAniType?: UIOpenType,
    /** 界面关闭动画 */
    closeAniType?: UICloseType
} | number | string | boolean;

export type UIOpenBeforeCallback = (uiId: number, preUIId: number) => void;
export type UIOpenCallback = (uiId: number, preUIId: number) => void;
export type UICloseCallback = (uiId: number) => void;


@ccclass('UIMgr')
export class UIMgr extends Component {
    public static readonly instance: UIMgr = new UIMgr();
    /** 是否正在关闭UI */
    private isClosing = false;
    /** 是否正在打开UI */
    private isOpening = false;

    /** UI界面缓存（key为UIId，value为UIView节点）*/
    private UICache: { [UIId: number]: UIView } = {};
    /** UI界面栈（{UIID + UIView + UIArgs}数组）*/
    private UIStack: IUiInfo[] = [];
    /** UI待打开列表 */
    private UIOpenQueue: IUiInfo[] = [];
    /** UI待关闭列表 */
    private UICloseQueue: number[] = [];
    /** UI配置 */
    private UIConf: { [key: number]: IUiConf } = {};

    /** UI打开前回调 */
    public uiOpenBeforeDelegate: UIOpenBeforeCallback | null = null;
    /** UI打开回调 */
    public uiOpenDelegate: UIOpenCallback | null = null;
    /** UI关闭回调 */
    public uiCloseDelegate: UICloseCallback | null = null;
    /**
     * 初始化所有UI的配置对象
     * @param conf 配置对象
     */
    public initUIConf(conf: { [key: number]: IUiConf }): void {
        this.UIConf = conf;
    }

    /**
     * 设置或覆盖某uiId的配置
     * @param uiId 要设置的界面id
     * @param conf 要设置的配置
     */
    public setUIConf(uiId: number, conf: IUiConf): void {
        this.UIConf[uiId] = conf;
    }

    /****************** 私有方法，UIMgr.instance内部的功能和基础规则 *******************/

    /**
     * 添加防触摸层
     */
    private async preventTouch(uiInfo: IUiInfo, cb) {
        let viewNode = director.getScene()!.getChildByPath('Canvas/Low');
        if(!isValid(viewNode)){
            throw new Error(`uiview ${uiInfo.uiId} is no valid.`);
        }
        const prefab = GameConfig.UIMaskPrefab || await ResMgr.instance.load('prefab/comm/UIMask',Prefab); 
        const node = instantiate(prefab);
        node.name = `preventTouch${uiInfo.uiId}`;
        node.targetOff(Node.EventType.TOUCH_START);
        node.targetOff(Node.EventType.TOUCH_END);
        node.parent = viewNode;
        const opa = node.getComponent(UIOpacity) || node.addComponent(UIOpacity);
        opa.opacity = uiInfo.uiView.mask ? MASK_OPACITY : 0;
        node.on(Node.EventType.TOUCH_START, (event: EventTouch) => {
            event.preventSwallow = !uiInfo.uiView.preventTouch;
        }, node); 
        node.on(Node.EventType.TOUCH_END, (event: EventTouch) => {
            event.preventSwallow = !uiInfo.uiView.preventTouch;
            if(uiInfo.uiView.quickClose){
                // AudioMgr.instance.playButtonSound(EButtonSoundType.CLOSE);
                this.close(uiInfo.uiId);
            }
        }, node);    
        node.setSiblingIndex(uiInfo.uiView.node.getSiblingIndex());
        uiInfo.preventNode = node;
        node.active = false;
        cb();
    }

    /** 自动执行下一个待关闭或待打开的界面 */
    private autoExecNextUI() {
        // 逻辑上是先关后开
        console.log('#### autoExecNextUI ',this.UICloseQueue)
        if (this.UICloseQueue.length > 0) {
            let uiId = this.UICloseQueue[0];
            this.UICloseQueue.splice(0, 1);
            this.close(uiId);
        } else if (this.UIOpenQueue.length > 0) {
            let uiQueueInfo = this.UIOpenQueue[0];
            this.UIOpenQueue.splice(0, 1);
            this.open(uiQueueInfo.uiId, uiQueueInfo.uiArgs, uiQueueInfo.uiOpenCompteletCallBack);
        }
    }

    /**
     * 自动检测动画组件以及特定动画，如存在则播放动画，无论动画是否播放，都执行回调
     * @param aniName 动画名
     * @param aniOverCallback 动画播放完成回调
     */
    private autoExecAnimation(uiInfo: IUiInfo, aniName: string, aniOverCallback: () => void) {
        let target = uiInfo.uiView.node;
        target.active = true;
        let visibleSize = view.getVisibleSize();
        // 动画播放的逻辑
        if (aniName == "uiOpen"){
            let mask = uiInfo.preventNode;
            if (mask && mask.active == false) {
                mask.active = true;
            }
            if (uiInfo.uiView.openAniType || uiInfo.uiView.closeAniType) {
                // 当有动画时，禁用根节点的widget，避免动画失效
                uiInfo.uiView.fullScreen();
            }
            switch(uiInfo.uiView.openAniType){
                case UIOpenType.scale:
                    tween(target)
                        .set({ scale: new Vec3(0.8, 0.8, 1)})
                        .to(0.2, { scale: new Vec3(1.1 , 1.1, 1) }, { easing: "backOut" })
                        .to(0.1, { scale: new Vec3(1 , 1, 1) })
                        .call(aniOverCallback)
                        .start();
                    let op = target.getComponent(UIOpacity) || target.addComponent(UIOpacity);
                    tween(op).set({opacity: 0})
                        .to(0.2, { opacity: MASK_OPACITY }).start();
                    if (mask) {
                        let op = mask.getComponent(UIOpacity) || mask.addComponent(UIOpacity);
                        tween(op).set({opacity: 0})
                            .to(0.2, { opacity: MASK_OPACITY }).start();
                    }
                    break;
                case UIOpenType.UIOpenMoveLeft: 
                    //此动画必须所有节点加到bg节点上 否则无效
                    const bg = target.getChildByName('bg');
                    if(isValid(bg)){
                        const width = bg.getComponent(UITransform).contentSize.width;
                        if (mask) {
                            let opUI = mask.getComponent(UIOpacity) || mask.addComponent(UIOpacity);
                            tween(opUI).set({ opacity: 0 }).to(0.2,{opacity:MASK_OPACITY}).start();
                        }
                        new Tween(bg).set({position: v3(-view.getVisibleSize().width / 2 - width, 0, 0),active: true}).to(0.2,{position: v3(-view.getVisibleSize().width / 2, 0, 0)}, { easing: "quintOut" }).call(aniOverCallback).start();
                    }else{
                        aniOverCallback();
                    }               
                    break
                case UIOpenType.UIOpenMoveTop: 
                    target.position = v3(0,visibleSize.height,0);
                    if (mask) {
                        let opUI = mask.getComponent(UIOpacity) || mask.addComponent(UIOpacity);
                        tween(opUI).set({ opacity: 0 }).to(0.2,{opacity:MASK_OPACITY}).start();
                    }
                    new Tween(target).to(0.2, { position: v3(0,0,0) }, { easing: "quintOut" }).call(aniOverCallback).start();
                break
                case UIOpenType.UIOpenCustom:
                    uiInfo.uiView.autoExecAnimation('open',aniOverCallback);
                break;
                default:
                    aniOverCallback();
                    break;
            }
        } else if (aniName == 'uiClose') {
            let mask = uiInfo.preventNode;
            switch(uiInfo.uiView.closeAniType){
                case UICloseType.scale : {
                    target.active = false;
                    if (mask) {
                        let opUI = mask.getComponent(UIOpacity) || mask.addComponent(UIOpacity);
                        tween(opUI).set({ opacity: MASK_OPACITY }).to(0.2,{opacity:0}).call(aniOverCallback).start();
                    }     
                    break;
                }
                case UICloseType.UICloseMoveLeft:
                    //此动画必须所有节点加到bg节点上 否则无效
                    const bg = target.getChildByName('bg');
                    if(isValid(bg)){
                        const width = bg.getComponent(UITransform).contentSize.width;
                        if (mask) {
                            let opUI = mask.getComponent(UIOpacity) || mask.addComponent(UIOpacity);
                            tween(opUI).set({ opacity: MASK_OPACITY }).to(0.2,{opacity:0}).call(aniOverCallback).start();
                        }
                        new Tween(bg).to(0.13, { position: v3(-visibleSize.width / 2 - width,0,0) }, { easing: "quintIn" }).set({active: false}).start();
                    }else{
                        aniOverCallback();
                    }
                    break;  
                case UICloseType.UICloseMoveTop:
                    target.position = v3(0,0,0);
                    if (mask) {
                        let opUI = mask.getComponent(UIOpacity) || mask.addComponent(UIOpacity);
                        tween(opUI).set({ opacity: MASK_OPACITY }).to(0.2,{opacity:0}).start();
                    }
                    new Tween(target).to(0.13, { position: v3(0,visibleSize.height,0) }, { easing: "quintIn" }).call(aniOverCallback).start();
                    break
                case UICloseType.UICloseCustom:
                    uiInfo.uiView.autoExecAnimation('close',aniOverCallback);
                    break;  
                default:
                    aniOverCallback();
                    break;
            }
        } else {
            aniOverCallback();
        }
    }

    /**
     * 自动检测资源预加载组件，如果存在则加载完成后调用completeCallback，否则直接调用
     * @param completeCallback 资源加载完成回调
     */
    private autoLoadRes(uiView: UIView, completeCallback: () => void) {
        // 检查组件
        let uiLoader = uiView.node.getComponent(UIViewLoader);
        if (!isValid(uiLoader)) {
            const className = `${js.getClassName(uiView)}Loader`;
            const cls = js.getClassByName(className);
            if(isValid(cls)){
                uiLoader = uiView.node.addComponent(className) as UIViewLoader;
                uiView.uiLoader = uiLoader;
                uiLoader.preLoadRes(completeCallback);
            }else{
                completeCallback();
            }
        }else{
            uiView.uiLoader = uiLoader;
            uiLoader.preLoadRes(completeCallback);
        }
    }

    /**
     * 异步加载一个UI的prefab，成功加载了一个prefab之后
     * @param uiId 界面id
     * @param completeCallback 加载完成回调
     * @param uiArgs 初始化参数
     */
    private getOrCreateUI(uiId: number, completeCallback: (uiView: UIView | null) => void, uiArgs: any): void {
        // 如果找到缓存对象，则直接返回
        let uiView: UIView | null = this.UICache[uiId];
        // 添加到场景中
        let child = director.getScene()!.getChildByPath('Canvas/Low');
        if (uiView) {
            console.log(`${uiId} is exit...`);
            uiView.node.parent = child;
            completeCallback(uiView);
            return;
        }

        // 找到UI配置
        let uiPath = this.UIConf[uiId].prefab;
        if (null == uiPath) {
            console.log(`getOrCreateUI ${uiId} faile, prefab conf not found!`);
            completeCallback(null);
            return;
        }
        let bundle = this.UIConf[uiId].bundle;
        ResMgr.instance.load(bundle, uiPath, (err, prefab: Prefab) => {
            // 检查加载资源错误
            if (err) {
                console.log(`getOrCreateUI loadRes ${uiId} faile, path: ${uiPath} error: ${err}`);
                completeCallback(null);
                return;
            }
            // 检查实例化错误
            let uiNode: Node = instantiate(prefab);
            if (null == uiNode) {
                console.log(`getOrCreateUI instantiate ${uiId} faile, path: ${uiPath}`);
                completeCallback(null);
                prefab.decRef();
                return;
            }
            // 检查组件获取错误
            uiView = uiNode.getComponent(UIView);
            if (null == uiView) {
                console.log(`getOrCreateUI getComponent ${uiId} faile, path: ${uiPath}`);
                uiNode.destroy();
                completeCallback(null);
                prefab.decRef();
                return;
            }
            // 异步加载UI预加载的资源
            this.autoLoadRes(uiView, () => {
                uiNode.parent = child;
                uiView!.init(uiArgs);
                completeCallback(uiView);
                uiView!.cacheAsset(prefab);
            })
        });
    }

    /**
     * UI被打开时回调，对UI进行初始化设置，刷新其他界面的显示，并根据
     * @param uiId 哪个界面被打开了
     * @param uiView 界面对象
     * @param uiInfo 界面栈对应的信息结构
     * @param uiArgs 界面初始化参数
     */
    private onUIOpen(uiId: number, uiView: UIView, uiInfo: IUiInfo, uiArgs: any, completeCallback:(m: UIView) => void = null) {
        console.log('onUIOpen 11111');
        if (null == uiView) {
            completeCallback(null);
            return;
        }
        console.log('onUIOpen 2222');
        // 激活界面
        uiInfo.uiView = uiView;
        uiView.node.active = true;
        let uiCom = uiView.getComponent(UITransform);
        if(!uiCom) {
            uiCom = uiView.addComponent(UITransform);
        }
        if (typeof(uiInfo.uiArgs) == 'object') {
            if (typeof(uiInfo.uiArgs?.openAniType) == 'number') {
                uiInfo.uiView.openAniType = uiInfo.uiArgs?.openAniType;
            }
            if (typeof(uiInfo.uiArgs?.closeAniType) == 'number') {
                uiInfo.uiView.closeAniType = uiInfo.uiArgs?.closeAniType;
            }
        }
        // 刷新界面栈的active
        this.refreshStackActive(); 
        let show = ()=>{
            // 从那个界面打开的
            let fromUIID = 0;
            if (this.UIStack.length > 1) {
                fromUIID = this.UIStack[this.UIStack.length - 2].uiId
            }

            // 打开界面之前回调
            if (this.uiOpenBeforeDelegate) {
                this.uiOpenBeforeDelegate(uiId, fromUIID);
            }
            
            // 执行onOpen回调
            // this.resetExecAnimation(uiView);
            console.log('onUIOpen 5555');
            uiView.onOpen(fromUIID, uiArgs);
            this.autoExecAnimation(uiInfo, "uiOpen", () => {
                uiView.onOpenAniOver();
                uiView.bOpen = true;
                if (this.uiOpenDelegate) {
                    this.uiOpenDelegate(uiId, fromUIID);
                } 
                this.isOpening = false; 
                this.autoExecNextUI();
                completeCallback && completeCallback(uiView); 
            });
        }
        if(uiView.preventTouch || uiView.quickClose|| uiView.mask){
            console.log('onUIOpen 3333');
            this.preventTouch(uiInfo,show);
        }else{
            console.log('onUIOpen 4444');
            show();
        }
    }
    /** 刷新View栈的active */
    private refreshStackActive() {
        // console.log('refreshStackActive');
        const stack = [...this.UIStack].reverse();
        let full = false;
        for (const uiInfo of stack) {
            const uiView = uiInfo.uiView;
            if (uiView?.node && uiView?.node.isValid) {
                if (!full) {
                    uiView.node.active = true;
                    full = uiView.bFullScreen;
                } else if (uiView.bKeepActive) {
                    uiView.node.active = true;
                } else {
                    uiView.node.active = false;
                }
                // console.log(uiView.name,uiView.node.active);
            }
        }
    }
    public preCache(uiId: UIID, uiArgs: UIArgs = null, completeCallback:(m: UIView) => void = null) {
        console.log('cache uiId ', uiId, UIID[uiId]);
        this.getOrCreateUI(uiId, (uiView: UIView | null): void => {
            console.log(`getOrCreateUI cb!!!!`, uiId)
            if (uiView?.node) {
                this.UICache[uiId] = uiView;
                uiView.node.removeFromParent();
            }
            if (completeCallback) {
                completeCallback(uiView);
            }
        }, uiArgs);
    }
    /** 
     * 打开界面并添加到界面栈中
     * @param uiId 界面id
     * @param uiArgs 附带参数，openAniType和closeAniType会优先作用
     * @param completeCallback 完成回调
     */
    public open(uiId: number, uiArgs: UIArgs = null, completeCallback:(m: UIView) => void = null): void {
        let uiInfo: IUiInfo = {
            uiId: uiId,
            uiArgs: uiArgs,
            uiView: null,
            uiOpenCompteletCallBack: completeCallback
        };
        if (this.isOpening || this.isClosing) {
            this.UIOpenQueue.push(uiInfo);
            return;
        }
        console.log('open uiId ', uiId, UIID[uiId]);
        let uiIndex = this.getUIIndex(uiId);
        if (-1 != uiIndex) {
            // 重复打开了同一个界面，直接回到该界面
            let reopen = !this.isTopUI(uiId);
            this.closeToUI(uiId, uiArgs, reopen, completeCallback);
            return;
        }

        // 设置UI的zOrder
        this.isOpening = true;
        this.UIStack.push(uiInfo);
        // 预加载资源，并在资源加载完成后自动打开界面
        this.getOrCreateUI(uiId, (uiView: UIView | null): void => {
            console.log(`getOrCreateUI cb!!!!`, uiId)
            // 如果界面已经被关闭或创建失败
            if (uiInfo.isClose || null == uiView) {
                console.log(`getOrCreateUI ${uiId} faile!
                        close state : ${uiInfo.isClose} , uiView : ${uiView}`);
                this.isOpening = false;
                // 回收屏蔽层
                if (uiInfo.preventNode) {
                    uiInfo.preventNode.destroy();
                    uiInfo.preventNode = null;
                }
                return;
            }

            // 打开UI，执行配置
            this.onUIOpen(uiId, uiView, uiInfo, uiArgs,completeCallback);
        }, uiArgs);
    }

    /** 
     * 替换栈顶元素
    */
    public replace(uiId: number, uiArgs: any = null, completeCallback:(m: UIView) => void = null) {
        this.close(this.UIStack[this.UIStack.length - 1].uiId!);
        this.open(uiId, uiArgs, completeCallback);
    }

    /**
     * 关闭当前界面
     * @param uiId 要关闭的界面
     * @param bFlag 是否上一个界面界面
     */
    public close(uiId?: number,bFlag?: boolean) {
        let uiCount = this.UIStack.length;
        console.log('### close==> ', uiCount, this.isClosing , this.isOpening)
        if (uiCount < 1 || this.isClosing || this.isOpening) {
            if (typeof uiId == 'number') {
                // 插入待关闭队列
                this.UICloseQueue.push(uiId);
            }
            return;
        }

        let uiInfo: IUiInfo = null;
        if(uiId != undefined ){
            for (let index = this.UIStack.length - 1; index >= 0; index--) {
                if (this.UIStack[index].uiId === uiId) {
                    uiInfo = this.UIStack[index];
                    this.UIStack.splice(index, 1);
                    break;
                }
            }
        }else{
            uiInfo = this.UIStack.pop();
        }
        
        if (uiInfo === null) {
            return;
        }

        // 关闭当前界面
        let uiView = uiInfo.uiView;
        uiInfo.isClose = true;

        if (!uiView) {
            return;
        }
        this.isClosing = true;
        // if(LocalConfigMgr.instance.isInPopUpSeq(uiInfo.uiId)){
        //     AutoPopViewMgr.instance.popView(); 
        // }
        let preUIInfo = this.UIStack[uiCount - 2];
        // 处理显示模式
        let closecb = () => {
            this.isClosing = false;
            // 回收遮罩层
            if (uiInfo.preventNode) {
                uiInfo.preventNode.destroy();
                uiInfo.preventNode = null;
            }
            // 显示之前的界面
            if (preUIInfo && preUIInfo.uiView && this.isTopUI(preUIInfo.uiId)) {
                // 如果之前的界面弹到了最上方（中间有肯能打开了其他界面）
                // preUIInfo.uiView.node.active = true
                // 回调onTop
                preUIInfo.uiView.onTop(uiId, uiView!.onClose());
            } else {
                uiView!.onClose();
            }
            if (this.uiCloseDelegate) {
                this.uiCloseDelegate(uiId);
            }
            if (uiView!.cache) {
                this.UICache[uiId] = uiView!;
                uiView!.node.removeFromParent();
                console.log(`uiView removeFromParent ${uiInfo!.uiId}`);
            } else {
                uiView!.releaseAssets();
                uiView!.node.destroy();
                console.log(`uiView destroy ${uiInfo!.uiId}`);
            }
            this.autoExecNextUI();
        }
        // 执行关闭动画
        this.autoExecAnimation(uiInfo, "uiClose", closecb);
        uiView.bOpen = false;
        // 刷新界面栈的active
        this.refreshStackActive();
    }

    /**关闭已经在栈中的UI */
    public closeExistUI(uiId?: number) {
        if (this.getUIIndex(uiId) >= 0) {
            if (this.UICloseQueue.indexOf(uiId) == -1) {
                this.close(uiId);
            }
        }
    }

    /** 关闭所有界面 */
    public closeAll() {
        // 不播放动画，也不清理缓存
        for (const uiInfo of this.UIStack) {
            uiInfo.isClose = true;
            // 回收屏蔽层
            if (uiInfo.preventNode) {
                uiInfo.preventNode.destroy();
                uiInfo.preventNode = null;
            }
            // if (uiInfo.uiView) {
            //     uiInfo.uiView.onClose();
            //     uiInfo.uiView.releaseAssets();
            //     uiInfo.uiView.node.destroy();
            // }

            if (uiInfo.uiView) {
                uiInfo.uiView.onClose()
                if (uiInfo.uiView.cache) {
                    this.UICache[uiInfo.uiId] = uiInfo.uiView;
                    uiInfo.uiView.node.removeFromParent();
                } else {
                    uiInfo.uiView.releaseAssets();
                    uiInfo.uiView.node.destroy();
                }
            }
        }
        this.UIOpenQueue = [];
        this.UICloseQueue = [];
        this.UIStack = [];
        this.isOpening = false;
        this.isClosing = false;
    }

    /**
     * 关闭界面，一直关闭到顶部为uiId的界面，为避免循环打开UI导致UI栈溢出
     * @param uiId 要关闭到的uiId（关闭其顶部的ui）
     * @param uiArgs 打开的参数
     */
    public closeToUI(uiId: number, uiArgs: any, bOpenSelf = true, completeCallback: (m: UIView) => void = null): void {
        let idx = this.getUIIndex(uiId);
        if (-1 == idx) {
            return;
        }

        idx = bOpenSelf ? idx : idx + 1;
        for (let i = this.UIStack.length - 1; i >= idx; --i) {
            let uiInfo = this.UIStack.pop();
            if (!uiInfo) {
                continue;
            }

            let uiId = uiInfo.uiId;
            let uiView = uiInfo.uiView;
            uiInfo.isClose = true

            // 回收屏蔽层
            if (uiInfo.preventNode) {
                uiInfo.preventNode.destroy();
                uiInfo.preventNode = null;
            }

            if (this.uiCloseDelegate) {
                this.uiCloseDelegate(uiId);
            }

            if (uiView) {
                uiView.onClose()
                if (uiView.cache) {
                    this.UICache[uiId] = uiView;
                    uiView.node.removeFromParent();
                } else {
                    uiView.releaseAssets();
                    uiView.node?.destroy();
                }
            }
        }

        this.UIOpenQueue = [];
        this.UICloseQueue = [];
        bOpenSelf && this.open(uiId, uiArgs, completeCallback);
        // 刷新界面栈的active
        this.refreshStackActive();
    }

    /** 清理界面缓存 */
    public clearCache(): void {
        for (const key in this.UICache) {
            let ui = this.UICache[key];
            if (isValid(ui.node)) {
                if (isValid(ui)) {
                    ui.releaseAssets();
                }
                ui.node.destroy();
            }
        }
        this.UICache = {};
    }

    /******************** UI的便捷接口 *******************/
    public isTopUI(uiId: number): boolean {
        if (this.UIStack.length == 0) {
            return false;
        }
        return this.UIStack[this.UIStack.length - 1].uiId == uiId;
    }
    public isTopFullUI(uiId: number): boolean {
        if (this.UIStack.length == 0) {
            return false;
        }
        const info = [...this.UIStack].reverse().find(e=> e.uiView?.bFullScreen);
        return info?.uiId == uiId;
    }

    public getUI(uiId: number): UIView | null {
        const info = this.UIStack.find((e) => { return e.uiId == uiId });
        return info?.uiView;
    }

    public getTopUI(): UIView | null{
        if (this.UIStack.length > 0) {
            return this.UIStack[this.UIStack.length - 1].uiView;
        }
        return null;
    }

    public getTopUIID(): number | null{
        if (this.UIStack.length > 0) {
            return this.UIStack[this.UIStack.length - 1].uiId;
        }
        return null;
    }

    public getUIIndex(uiId: number): number {
        // for (let index = 0; index < this.UIStack.length; index++) {
        //     const element = this.UIStack[index];
        //     if (uiId == element.uiId) {
        //         return index;
        //     }
        // }
        // return -1;
        // 改成findIndex
        return this.UIStack.findIndex((e) => { return e.uiId == uiId });
    }

    //************************************* 公共弹窗 ******************************* */
    // public Toast(text: string, blong?: boolean,callback?: Function){
    //     let parent = director.getScene()!.getChildByPath('Canvas/Max');
    //     if (parent) {
    //         let cb = (node)=>{
    //             node.getComponent(UIToast).show(text,blong,callback);
    //         }
    //         let node = parent.getChildByName("@toast_tip_label");
    //         if (node) {
    //             cb(node);
    //         } else {
    //             ResMgr.instance.load("prefabs/UIToast",Prefab, (err,prefab)=>{
    //                 // 检查加载资源错误
    //                 if (err) {
    //                     console.warn("load UIToast error:", err)
    //                     return;
    //                 }
    //                 let node = ResUtil.instantiate(prefab);
    //                 node.parent = parent;
    //                 node.name = "@toast_tip_label";
    //                 cb(node);
    //             })     
    //         }    
    //     }
    // }

    // public removeConfimDialog(name: string){
    //     let parent = director.getScene()!.getChildByPath('Canvas/Mid');
    //     let node = parent.getChildByName(name);
    //     if (isValid(node)) {
    //         this._confirmDialogPool.put(node);
    //     }
    // }

    //清除Max子节点
    // public removeConfimMax(){
    //     let parent = director.getScene()!.getChildByPath('Canvas/Max');
    //     if (isValid(parent)) {
    //         parent.removeAllChildren(); 
    //     }
    // }

    // //只显示确认按钮
    // public async showConfimDialog(content: string, confirmCallback?: Function, cancelCallback?: Function, title?: string) {
    //     let parent = director.getScene()!.getChildByPath('Canvas/Mid');
    //     if (parent) {
    //         let cb = (node)=>{
    //             node.getComponent(UIDialog).showConfimDialog(content,confirmCallback,cancelCallback,title);
    //             return node.name;
    //         }
    //         if(this._confirmDialogPool.size() > 0){
    //             let node =  this._confirmDialogPool.get();
    //             node.parent = parent;
    //             return cb(node);
    //         }else {
    //             let prefab = await ResMgr.instance.load<Prefab>('prefabs/UIDialog');
    //             // 检查加载资源错误
    //             if (prefab) {
    //                 let node = ResUtil.instantiate(prefab);
    //                 node.parent = parent;
    //                 node.name = "@dialog_tip_label" + this._confirmDialogUid;
    //                 this._confirmDialogUid++;
    //                 return cb(node);
    //             }
    //         }    
    //     }
    //     return '@dialog_tip_label';
    // }

    // //默认显示两个按钮，左边为取消，右边为确定
    // public async showCancelConfirmDialog(content: string, confirmCallback?: Function, cancelCallback?: Function, title?: string) {
    //     let parent = director.getScene()!.getChildByPath('Canvas/Mid');
    //     if (parent) {
    //         let cb = (node)=>{
    //             node.getComponent(UIDialog).showCancelConfirmDialog(content,confirmCallback,cancelCallback,title);
    //             return node.name;
    //         }
    //         if(this._confirmDialogPool.size() > 0){
    //             let node =  this._confirmDialogPool.get();
    //             node.parent = parent;
    //             return cb(node);
    //         }else {
    //             let prefab = await ResMgr.instance.load<Prefab>('prefabs/UIDialog');
    //             // 检查加载资源错误
    //             if (prefab) {
    //                 let node = ResUtil.instantiate(prefab);
    //                 node.parent = parent;
    //                 node.name = '@dialog_tip_label' + this._confirmDialogUid;
    //                 this._confirmDialogUid++;
    //                 return cb(node);
    //             }
    //         } 
    //     }
    //     return '@dialog_tip_label';   
    // }

    // showNetPrompt(bshow: boolean){
    //     let parent = director.getScene()!.getChildByPath('Canvas/Max');
    //     if (parent) {
    //         let cb = (node)=>{
    //             node.active = bshow;
    //             if(bshow){
    //                 Tween.stopAllByTarget(node);
    //                 tween(node).delay(7).call(()=>{
    //                     node.active = false;
    //                 }).start()
    //             }
    //         }
    //         let node = parent.getChildByName("@net_prompt_label");
    //         if (node) {
    //             cb(node);
    //         } else {
    //             ResMgr.instance.load("prefabs/UINetPrompt",Prefab, (err,prefab)=>{
    //                 // 检查加载资源错误
    //                 if (err) {
    //                     console.warn("load UINetPrompt error:", err)
    //                     return;
    //                 }
    //                 let node = ResUtil.instantiate(prefab);
    //                 node.parent = parent;
    //                 node.name = "@net_prompt_label";
    //                 cb(node);
    //             })     
    //         }    
    //     }
    // }

    // async showNetReconnect(bshow: boolean, cb?:(bool:boolean)=>void){
    //     let parent = director.getScene()!.getChildByPath('Canvas/Max');
    //     const name = 'UIConnectDialog';
    //     if (parent) {
    //         let node = parent.getChildByName(name);
    //         if (bshow) {
    //             if (isValid(node)) {
    //                 node.parent = parent;
    //                 return node;
    //             }
    //             let prefab = await ResMgr.instance.load<Prefab>('prefabs/UIReconnectDialog');
    //             if (prefab) {
    //                 let node = ResUtil.instantiate(prefab);
    //                 node.parent = parent;
    //                 node.name = name;
    //                 Utility.instance.onButtonClick(node.getChildByPath('bg/confirmButton'),()=>{
    //                     node.removeFromParent();
    //                     node.destroy();
    //                     cb && cb(true);
    //                 });
    //                 Utility.instance.onButtonClick(node.getChildByPath('bg/btnClose'),()=>{
    //                     node.removeFromParent();
    //                     node.destroy();
    //                     cb && cb(false);
    //                 });
    //                 return node;
    //             }
    //         } else if (node && node.isValid) {
    //             node.removeFromParent();
    //             node.destroy();
    //         }
    //     }
    // }
}


