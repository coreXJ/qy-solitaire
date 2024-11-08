import { _decorator, Component } from "cc";
const { ccclass, property } = _decorator;

@ccclass('ViewTop')
export default class ViewTop extends Component {

    protected onLoad(): void {
        
    }

    protected start(): void {
        console.log('ViewTop start');
        
    }
}