import { _decorator } from 'cc';
import { Label } from 'cc';
import { v3 } from 'cc';
import { Tween } from 'cc';
import { XUtils } from '../../comm/XUtils';
import { Component } from 'cc';
import { easing } from 'cc';
import { tween } from 'cc';
import { UIOpacity } from 'cc';
const { ccclass, property } = _decorator;
export interface IToastParam{
    content: string,
    callback: ()=>void
}
@ccclass('UIToast')
export class UIToast extends Component {
    @property(Label)
    xLabel: Label = null;
    private _param: IToastParam = null;
    set Param(param: IToastParam){
        this._param = param;
    }

    get Param(){
        return this._param;
    }
    
    public play() {
        if(this.Param != null){
            this.xLabel.string = this.Param.content;
            Tween.stopAllByTarget(this.node);
            const opa = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity);
            opa.opacity = 255;
            new Tween(this.node)
                .set({active: true,position: v3(0, 0, 0),scale: v3(1, 1, 1),})
                .to(0.1, {scale: v3(1.2, 1.2, 1.2)})
                .to(0.1, {scale: v3(1, 1, 1)})
                .delay(2)
                .parallel(tween().to(0.2, {position: v3(0, 92, 0)}), tween().call(()=>{
                    XUtils.playOpaAction(this.node, 0, 0.2, 255);
                }))
                .call(()=>{
                    this.Param.callback && this.Param.callback();
                })
                .start();
        } 
    }
    public completeAndDestroy(){
        Tween.stopAllByTarget(this.node);
        this.Param.callback && this.Param.callback();
        this.node.destroy();
    }
}

