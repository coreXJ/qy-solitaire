import { _decorator, Component } from "cc";
import GameLoader from "../../game/GameLoader";
const { ccclass, property } = _decorator;

@ccclass('ViewTable')
export default class ViewTable extends Component {

    protected onLoad(): void {
        
    }

    protected start(): void {
        console.log('ViewTable start');
        const card = GameLoader.addCard()
        card.parent = this.node;
        console.log(card);
        
    }

}