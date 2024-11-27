import { director, instantiate, Prefab, Node} from "cc";
import { ResMgr } from "../manager/ResMgr";
import { XUtils } from "../comm/XUtils";
import { UIGM } from "./UIGM";



class GMCtrl {

    private _btn: Node = null;
    private view: UIGM;
    private _topCardCountArr: number[] = [];

    public async init() {
        let prefab = await ResMgr.instance.load("prefab/GM/GMBtn", Prefab);
        let node = instantiate(prefab);
        node.parent = director.getScene()!.getChildByPath('Canvas/Max');
        XUtils.bindClick(node, this.show, this);
        this._btn = node;
        // view
        prefab = await ResMgr.instance.load("prefab/GM/UIGM", Prefab);
        node = instantiate(prefab);
        node.parent = director.getScene()!.getChildByPath('Canvas/Mid');
        this.view = node.getComponent(UIGM);
        this.view.hide();
    }

    public showBtn() {
        this._btn.active = true;
    }

    public show() {
        this._btn.active = false;
        this.view.show();
    }

    public addTopCardCount(count: number) {
        console.log('addTopCardCount',count);
        this._topCardCountArr.push(count);
    }
    public getTopCardAverage() {
        if (!this._topCardCountArr.length) {
            return '-';
        }
        let sum = 0;
        for (let i = 0; i < this._topCardCountArr.length; i++) {
            sum += this._topCardCountArr[i];
        }
        return (sum / this._topCardCountArr.length).toFixed(2);
    }
    public clearTopCardCount() {
        this._topCardCountArr = [];
    }
}
export default new GMCtrl();