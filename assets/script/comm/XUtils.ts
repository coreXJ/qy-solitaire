
import { UITransform, Vec3, v3, view, Node } from "cc";
import { sp } from "cc";
import { isValid } from "cc";
import { UIOpacity } from "cc";
import { Tween } from "cc";
import { Button } from "cc";
import AudioMgr from "../manager/AudioMgr";
import { director } from "cc";
import { Layers } from "cc";
import { Vec2 } from "cc";
import { sys } from "cc";
import { EButtonSoundType, UIID } from "../data/GameConfig";
import { AutoPopViewMgr } from "../manager/AutoPopViewMgr";
// import { NetMgr } from "../manager/NetMgr";
import { UIMgr } from "../manager/UIMgr";
import LocalMgr from "../manager/LocalMgr";
// import { NativeHelper } from "../NativeApi/NativeHelper";
export namespace XUtils{
    /**
     * 三维空间下 计算线段是否与平面矩形相交
     * 例如点击检测，传相机的世界坐标和点击的世界坐标
     * @param point0 世界坐标
     * @param point1 世界坐标
     * @param rect 
     */
    export function lineIntersectsRect(point0: Vec3, point1: Vec3, rect: UITransform): boolean {
        const dotProduct = (a: Vec3, b: Vec3) => {
            return a.x * b.x + a.y * b.y + a.z * b.z;
        }
        const winSize = view.getVisibleSize();
        const convertPos = (p: Vec3) => {
            return v3(p.x - winSize.width / 2, p.y - winSize.height / 2, p.z);
        }
        point0 = convertPos(point0);
        point1 = convertPos(point1);
        // 默认矩形法线为(0, 0, 1)
        const normal = v3(0, 0, 1);
        // 计算线段的方向向量
        const dir = v3(point1.x - point0.x, point1.y - point0.y, point1.z - point0.z);
        // 判断线段是否与矩形所在的平面平行，如果是则无法相交
        if (dotProduct(dir, normal) === 0) return false;
        // 计算线段与矩形平面的交点
        let pointRect = convertPos(rect.node.worldPosition);
        const t = -(dotProduct(point0, normal) - dotProduct(pointRect, normal)) / dotProduct(dir, normal);
        const intersectionPoint = [point0.x + t * dir.x, point0.y + t * dir.y, point0.z + t * dir.z];
        // 检查交点是否在矩形内部
        const minX = pointRect.x - rect.width / 2;
        const maxX = pointRect.x + rect.width / 2;
        const minY = pointRect.y - rect.height / 2;
        const maxY = pointRect.y + rect.height / 2;
        const minZ = pointRect.z - (rect.height || 0) / 2; // z轴的厚度可能要改下
        const maxZ = pointRect.z + (rect.height || 0) / 2;
        return (intersectionPoint[0] >= minX && intersectionPoint[0] <= maxX) &&
            (intersectionPoint[1] >= minY && intersectionPoint[1] <= maxY) &&
            (intersectionPoint[2] >= minZ && intersectionPoint[2] <= maxZ);
    }

    /**
     * 深度拷贝
     *  基本类型和 null 判断: 如果 obj 不是对象（即是基本类型）或是 null，直接返回它，因为基本类型本身就是深拷贝的。
        数组处理: 如果 obj 是数组，创建一个新的数组并递归地深拷贝数组中的每一项。
        日期处理: 如果 obj 是 Date 对象，创建一个新的 Date 对象并用原始日期的时间戳初始化它。
        正则表达式处理: 如果 obj 是 RegExp 对象，创建一个新的 RegExp 对象并用原始正则表达式的源和标志初始化它。
        对象处理: 如果 obj 是普通对象，创建一个新的对象并递归地深拷贝对象的每一个属性
     * @param obj 待拷贝对象
     * @returns 新对象
     */
    export function deepClone<T>(obj: T): T {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
    
        if (Array.isArray(obj)) {
            const arrCopy = [] as unknown as T;
            for (let i = 0; i < obj.length; i++) {
                arrCopy[i] = deepClone(obj[i]);
            }
            return arrCopy;
        }
    
        if (obj instanceof Date) {
            return new Date(obj.getTime()) as unknown as T;
        }
    
        if (obj instanceof RegExp) {
            return new RegExp(obj.source, obj.flags) as unknown as T;
        }
    
        const objCopy = {} as T;
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                objCopy[key] = deepClone(obj[key]);
            }
        }
    
        return objCopy;
    }

    /**
     * * 播放骨骼动画
    */
    export function playSpineAnimation(skeleto: sp.Skeleton, animation: string, loop: boolean, onComplete: () => void = null, onEvent: (x: sp.spine.TrackEntry, ev: sp.spine.Event | number) => void = null) {
        if(!isValid(skeleto))
            return;
        skeleto.node.active = true;
        skeleto.clearTracks();
        // skeleto.loop = loop;
        if(onEvent){
            skeleto.setEventListener((x: sp.spine.TrackEntry, ev: sp.spine.Event | number) => {
                skeleto.scheduleOnce(() => {
                    onEvent(x, ev);
                });
            })
        }else{
            skeleto.setEventListener(null);
        }
        if(!loop && onComplete){
            skeleto.setCompleteListener(() => {
                skeleto.scheduleOnce(() => {
                    onComplete();
                });
            })
        }else{
            skeleto.setCompleteListener(null);
        }
        // skeleto.animation = animation;
        skeleto.setAnimation(0, animation, loop);
    }

    /**
     * * 停止骨骼动画
    */
    export function stopSpineAnimation(skeleto: sp.Skeleton) {
        if(!isValid(skeleto))
            return;
        skeleto.clearTracks();
        skeleto.node.active = false;
    }

     /**
     * * 播放透明度变化
    */
     export function playOpaAction(node: Node, dstOpa: number, time?: number, srcOpa?: number, callback?) {
        if(!isValid(node))
            return;
        time = time != undefined ? time : 0.3;
        srcOpa = srcOpa != undefined ? srcOpa : 255;
        let opa = node.getComponent(UIOpacity) || node.addComponent(UIOpacity);
        Tween.stopAllByTarget(opa);
        new Tween(opa)
            .set({opacity: srcOpa})
            .to(time, {opacity: dstOpa}, { easing: 'fade' })
            .call(callback)
            .start();
    }

    /**
     * * 停止透明度变化
    */
    export function stopOpaAction(node: Node) {
        if(!isValid(node))
            return;
        let opa = node.getComponent(UIOpacity) || node.addComponent(UIOpacity);
        Tween.stopAllByTarget(opa);
    }

    // /* 绑定按钮点击事件
    // * @param node 按钮节点
    // * @param listener 监听方法
    // * @param thisArg this实例
    // * 必须先关闭事件，否则有可能多次注册点击事件
    // */
    // export function onButtonClick(node: Node, listener: Function, thisArg: any = null, soundType: EButtonSoundType = EButtonSoundType.COMMON, playAnimation = true, ...args) {
    //     const button = XUtils.bindClick(node, listener, thisArg, soundType, ...args)
    //     if(playAnimation){
    //         button.transition = Button.Transition.SCALE;
    //         button.zoomScale = 0.95;
    //         button.duration = 0.06;
    //     }
    //     return button;
    // }

    /**
     * 没点击反馈的点击事件
     */
    export function bindClick(node: Node, listener: Function, target = null, ...args:any[]) {
        node.off('click');
        node.on('click', (btn:Button) => {
            console.log('click',btn);
            if (!btnClickValid()) {
                return;
            }
            listener.apply(target, args)
            // AudioMgr.instance.playButtonSound(soundType);
            if (btn) {
                setLastClickPosition(btn.node.getWorldPosition());
            }
        }, target);
        return node.getComponent(Button) || node.addComponent(Button);
    }
    export function unbindClick(node: Node) {
        node.off('click');
    }
    
    let LastClickPosition: Vec3;
    export function getLastClickPosition(){
        return LastClickPosition;
    }

    export function setLastClickPosition(point: Vec3){
        LastClickPosition  = point;
    }

    let LastClickTime = 0;
    //防止用户连续点击
    export function btnClickValid(intervalTime?: number) {
        let time = 100;
        if (intervalTime) {
            time = intervalTime;
        }
        let cur = new Date().getTime()
        if (cur - LastClickTime < time) {
            return false;
        } else {
            LastClickTime = cur;
            return true
        }
    }

    /**
     * 格式化文本
     * @param content formatLanText('hello {0}, 你好 {1}', 'world', 世界)；==》hello world, 你好 世界
     * @param rep 
     * @returns 
     */
    export function formatLanText(content: string, ...rep: string[]): string {
        return content.replace(/{(\d+)}/g, function (match, number) {
            return rep[number] || match;
        });
    }

    export function formatMoney(cash: number, symbol = false): string {
        let regex = /(?!^)(?=(\d{2})+\d{3}$)|(?!^)(?=\d{3}$)/g;
        let strMoney = cash.toString().replace(regex, ',');
        if (symbol) {
            strMoney = 'Rs ' + strMoney  ;
        } else if (cash < 0) {
            strMoney = strMoney.replace('-,', '-');
        }
        return strMoney;
    }

    export function formatTime(totalSeconds: number): string {
        const secondsInDay = 86400; // 24小时 * 60分钟 * 60秒
        const secondsInHour = 3600; // 60分钟 * 60秒
        const secondsInMinute = 60;
    
        if (totalSeconds >= secondsInDay * 2) {
            // 大于2天，则显示天时
            const days = Math.floor(totalSeconds / secondsInDay);
            const hours = Math.ceil((totalSeconds % secondsInDay) / secondsInHour);
            return `${days}D ${hours}H`;
        } else if (totalSeconds <= secondsInHour * 48 && totalSeconds >= secondsInMinute * 120) {
            // 小于48小时，则显示时分
            const hours = Math.floor(totalSeconds / secondsInHour);
            const minutes = Math.floor((totalSeconds % secondsInHour) / secondsInMinute);
            return `${hours}H ${minutes}M`;
        } else{
            // 小于90分钟，则显示分秒
            const minutes = Math.floor(totalSeconds / secondsInMinute);
            const seconds = totalSeconds % secondsInMinute;
            return `${minutes}M ${seconds}S`;
        }
    }
    /**
     * 将时间戳转为字符串 yyyy-MM-dd HH:mm:ss
     * @param time 时间戳
     * @param format yyyy-MM-dd HH:mm:ss
     */
    export function formatDateToSimple(time: number,format = 'yyyy-MM-dd HH:mm:ss') {
        const date = new Date(time);
        const pad = (num: number, size: number = 2): string => {
            let str = num.toString();
            while (str.length < size) {
                str = '0' + str;
            }
            return str;
        };
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());
        return format
            .replace('yyyy', year.toString())
            .replace('MM', month)
            .replace('dd', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    }

    //金币缩写形式 
    export function formatMoneyClamp(cash: number, useFloor:boolean = true): string {
        if (cash >= 1e3 && cash < 1e5)
            return `${useFloor?Math.floor(cash / 1e3):(cash / 1e3)}` + 'K';
        else if (cash >= 1e5 && cash < 1e7)
            return `${useFloor?Math.floor(cash / 1e5):(cash / 1e5)}` + 'L';
        else if (cash >= 1e7 && cash < 1e10)
            return `${useFloor?Math.floor(cash / 1e7):(cash / 1e7)}` + 'CR';
        else if (cash >= 1e10 && cash < 1e12)
            return `${useFloor?Math.floor(cash / 1e10):(cash / 1e10)}` + 'KCR';
        else if (cash >= 1e12)
            return `${useFloor?Math.floor(cash / 1e12):(cash / 1e12)}` + 'LCR';
        return cash.toString();
    }

    export function pixelPos2worldPos<T>(pos: Vec3|Vec2) {
        const height0 = view.getVisibleSize().height;
        const height1 = view.getVisibleSizeInPixel().height;
        const rate = height0 / height1;
        pos.x = pos.x * rate;
        pos.y = pos.y * rate;
        return <T>pos;
    }

    /**
     * 获取节点距离设计分辨率下的边距
     * @param item 
     * @returns 
     */
    export function getItemOffsetX(item: Node){
        return view.getDesignResolutionSize().width / 2 - Math.abs(item.position.x);
    }

    /**
     * 获取节点距离设计分辨率下的边距
     * @param item 
     * @returns 
     */
    export function getRightPX(item: Node){
        return view.getVisibleSize().width / 2 - getItemOffsetX(item) -  sys.getSafeAreaRect().x; 
    }

    export function getLeftPX(item: Node){
        return -view.getVisibleSize().width / 2 + getItemOffsetX(item) +  sys.getSafeAreaRect().x; 
    }

    export function loginOut() {
        AutoPopViewMgr.instance.clearAll();
        UIMgr.instance.closeAll();
        LocalMgr.instance.clearItes();
        // NativeAPI.appleLoginOut();
        // NativeApi.googleLoginOut();
        // NativeApi.appleLoginOut();
    }
    export function isInteger(str: string): boolean {
        return /^-?\d+$/.test(str);
    }
    export function hexEncode(data: string): string {
        const encoder = new TextEncoder(); // 创建一个文本编码器
        const uintArray = encoder.encode(data); // 将字符串转换为 Uint8Array
        let hex = '';
        for (let i = 0; i < uintArray.length; i++) {
            hex += ('0' + uintArray[i].toString(16)).slice(-2);
        }
        return hex;
    }
    export function hexDecode(hex: string): string {
        const decoder = new TextDecoder(); // 创建一个文本解码器
        const byteArray = new Uint8Array(hex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []);
        return decoder.decode(byteArray);
    }

    // 过滤掉中文和表情符号的函数
    export function filterText(text: string): string {
        return text.replace(/[^\x00-\x7F\u0900-\u097F]/g, '');
    }
}