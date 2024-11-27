// import { NodePool } from "cc";
// import { UIToast } from "./UIToast";
// import { isValid } from "cc";
// import { Prefab } from "cc";
// import { ResMgr } from "../../manager/ResMgr";
// import { instantiate } from "cc";
// import { director } from "cc";
// class _ToastCtrl {
//     private _toastList: UIToast[] = [];
//     private _toastNodePool = new NodePool('UIToast');
//     private autoPopNext(){
//         for (var i = 0; i < this._toastList.length; ++i) {
//             if(isValid(this._toastList[i])){
//                 this._toastList[i].node.active = true;
//                 this._toastList[i].play();
//                 break;
//             }
//         }
//     }

//     public async showToast(content: string, cb?) {
//         let node = null;
//         if (this._toastNodePool.size() > 0) {
//             node = this._toastNodePool.get();
//         } else {
//             let prefab: Prefab = await ResMgr.instance.load("prefab/comm/UIToast", Prefab);
//             node = instantiate(prefab);
//         }
//         node.parent = director.getScene()!.getChildByPath('Canvas/Max');
//         node.active = false;
//         let name = `@UIToast${this._toastList.length}`;
//         if(isValid(node)){
//             let uiToast: UIToast = node.getComponent(UIToast);
//             uiToast.name = name;
//             const callback = ()=>{
//                 ToastCtrl.hideToast(name);
//                 cb && cb();
//             }
//             uiToast.Param = {content, callback};
//             if(this._toastList.length == 0){
//                 node.active = true;
//                 uiToast.play();
//             }
//             this._toastList.push(uiToast);
//         }else{
//             name = ''
//         }
//         return name;
//     }

//     private lastToast: UIToast = null;
//     /**只存显示一个toast，重叠时移除上一个 */
//     public async showToastSingle(content: string, cb?) {
//         // 
//         if(this.lastToast)
//         {
//             return;
//         }
//         // 
//         let node = null;
//         if (this._toastNodePool.size() > 0) {
//             node = this._toastNodePool.get();
//         } else {
//             let prefab: Prefab = await ResMgr.instance.load("Prefab/comm/UIToast", Prefab);
//             node = instantiate(prefab);
//         }
//         node.parent = director.getScene()!.getChildByPath('Canvas/Max');
//         node.active = false;
//         let name = `@UIToast${this._toastList.length}`;
//         if(isValid(node)){
//             let uiToast: UIToast = node.getComponent(UIToast);
//             uiToast.name = name;
//             const callback = ()=>{
//                 ToastCtrl.hideToast(name);
//                 cb && cb();
//                 this.lastToast = null;
//             }
//             uiToast.Param = {content, callback};
//             if(this._toastList.length == 0){
//                 node.active = true;
//                 uiToast.play();
//             }
//             // this._toastList.push(uiToast);
//             this.lastToast = uiToast;
//         }else{
//             name = ''
//         }
//         return name;
//     }
    
//     public hideToast(name?: string){
//         let uiToast: UIToast = null;
//         if(name != undefined ){
//             for (let index = this._toastList.length - 1; index >= 0; index--) {
//                 if (this._toastList[index].name == name) {
//                     uiToast = this._toastList[index];
//                     this._toastList.splice(index, 1);
//                     break;
//                 }
//             }
//         }else{
//             uiToast = this._toastList.shift();
//         }
        
//         if (uiToast == null) {
//             return;
//         }
//         this._toastNodePool.put(uiToast.node);
//         this.autoPopNext(); 
//     }
// }

// export const ToastCtrl = new _ToastCtrl();



