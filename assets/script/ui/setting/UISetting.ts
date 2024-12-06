import { _decorator, Node, Label, instantiate, Sprite, view, tween, v3, UITransform, UIOpacity } from "cc";
import { isFullScreen, UIView } from "../../base/UIView";
import { UIID } from "../../data/GameConfig";
import { XUtils } from "../../comm/XUtils";
import { UIMgr } from "../../manager/UIMgr";
import { MySwitch } from "../../components/MySwitch";
import LocalValues from "../../data/LocalValues";
const { ccclass, property } = _decorator;

@ccclass('UISetting')
export default class UISetting extends UIView {

    @property(Node)
    private btnClose: Node;
    @property(Node)
    private btnHelp: Node;
    @property(Node)
    private btnCopyright0: Node;
    @property(Node)
    private btnCopyright1: Node;
    @property(MySwitch)
    private switchMusic: MySwitch;
    @property(MySwitch)
    private switchVoice: MySwitch;
    @property(MySwitch)
    private switchShake: MySwitch;

    protected start(): void {
        XUtils.bindButton(this.btnClose, ()=>{
            UIMgr.instance.close(UIID.UISetting);
        });
        XUtils.bindButton(this.btnHelp, ()=>{
            console.log('help');
        });
        XUtils.bindButton(this.btnCopyright0, ()=>{
            console.log('btnCopyright0');
        });
        XUtils.bindButton(this.btnCopyright1, ()=>{
            console.log('btnCopyright1');
        });
        this.switchMusic.setOnChange(()=>{
            let bool = this.switchMusic.isChecked;
            LocalValues.setMusic(bool);
            console.log('music:', bool);
        });
        this.switchVoice.setOnChange(()=>{
            let bool = this.switchVoice.isChecked;
            LocalValues.setSound(bool);
            console.log('sound:', bool);
        });
        this.switchShake.setOnChange(()=>{
            let bool = this.switchShake.isChecked;
            LocalValues.setShake(bool);
            console.log('shake:', bool);
        });
        this.switchMusic.isChecked = LocalValues.getMusic();
        this.switchVoice.isChecked = LocalValues.getSound();
        this.switchShake.isChecked = LocalValues.getShake();
    }

}