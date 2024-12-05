import { _decorator, Component, EditBox, Label, Node} from 'cc';
import { UIView } from '../base/UIView';
import GMCtrl from './GMCtrl';
import { XUtils } from '../comm/XUtils';
import { Dialog } from '../components/Dialog';
import NativeHelper from '../comm/NativeHelper';
import UserModel from '../data/UserModel';
import { Toast } from '../components/Toast';
import { BoosterID, PropID } from '../data/GameObjects';
import GameCtrl from '../game/GameCtrl';
const { ccclass, property } = _decorator;

@ccclass('UIGM')
export class UIGM extends Component {
    @property(Node)
    private btnClearAccount: Node;
    @property(Node)
    private btnLevel: Node;
    @property(Node)
    private btnWinTimes: Node;
    @property(Node)
    private btnGold: Node;
    @property(Node)
    private btnPropJoker: Node;
    @property(Node)
    private btnPropUndo: Node;
    @property(Node)
    private btnPropAddCard: Node;
    @property(Node)
    private btnBoosterHook: Node;
    @property(Node)
    private btnBoosterBlow: Node;
    @property(Node)
    private btnBoosterJoker: Node;
    @property(Node)
    private btnStraightWin: Node;
    @property(Node)
    private btnReplay: Node;
    @property(Label)
    private lbCardNum: Label;

    @property(Node)
    private popInputNumber: Node;

    protected start(): void {
        XUtils.bindClick(this.node, this.hide, this);
        console.log('UIGM node',this.node);
    }

    public show() {
        this.node.active = true;
        this.bindClick();
        this.fullContent();
    }
    private bindClick() {
        XUtils.bindClick(this.btnClearAccount, this.onClickClearAccount, this);
        XUtils.bindClick(this.btnGold, this.onClickGold, this);
        XUtils.bindClick(this.btnLevel, this.onClickLevel, this);
        XUtils.bindClick(this.btnWinTimes, this.onClickWinTimes, this);
        XUtils.bindClick(this.btnPropJoker, this.onClickPropJoker, this);
        XUtils.bindClick(this.btnPropAddCard, this.onClickPropAddCard, this);
        XUtils.bindClick(this.btnPropUndo, this.onClickPropUndo, this);
        XUtils.bindClick(this.btnBoosterHook, this.onClickBoosterHook, this);
        XUtils.bindClick(this.btnBoosterBlow, this.onClickBoosterBlow, this);
        XUtils.bindClick(this.btnBoosterJoker, this.onClickBoosterJoker, this);
        XUtils.bindClick(this.btnStraightWin, this.onClickStraightWin, this);
        XUtils.bindClick(this.btnReplay, this.onClickReplay, this);
    }
    private fullContent() {
        // 填充当前关卡
        this.btnLevel.getComponentInChildren(Label).string = '关卡:'+UserModel.curLevelId.toString();
        // 填充当前连胜
        this.btnWinTimes.getComponentInChildren(Label).string = '连胜:'+UserModel.winCombo.toString();
        // 填充当前金币
        this.btnGold.getComponentInChildren(Label).string = '金币\n'+UserModel.gold.toString();
        // 填充PropJoker
        this.btnPropJoker.getComponentInChildren(Label).string = 'Prop小丑\n'+UserModel.getPropCount(PropID.PropJoker).toString();
        // 填充PropUndo
        this.btnPropUndo.getComponentInChildren(Label).string = 'Prop撤回\n'+UserModel.getPropCount(PropID.PropUndo).toString();
        // 填充PropAddCard
        this.btnPropAddCard.getComponentInChildren(Label).string = 'Prop补牌\n'+UserModel.getPropCount(PropID.PropAdd).toString();
        // 填充BoosterHook
        this.btnBoosterHook.getComponentInChildren(Label).string = 'Booster消除\n'+UserModel.getBoosterCount(BoosterID.hook).toString();
        // 填充BoosterBlow
        this.btnBoosterBlow.getComponentInChildren(Label).string = 'Booster老虎\n'+UserModel.getBoosterCount(BoosterID.blow).toString();
        // 填充BoosterJoker
        this.btnBoosterJoker.getComponentInChildren(Label).string = 'Booster小丑\n'+UserModel.getBoosterCount(BoosterID.joker).toString();

        this.lbCardNum.string = '平均显示牌数\n' + GMCtrl.getTopCardAverage();
    }
    public hide() {
        this.node.active = false;
        GMCtrl.showBtn();
    }
    //============基础============
    //清除帐号
    public onClickClearAccount() {
        // 清楚localStorage，并重启游戏
        Dialog.show({
            content: 'Are you sure want to clear your account?',
            onConfirm: () => {
                UserModel.clearUserData();
                NativeHelper.restart();
            }
        });
    }
    //编辑金币
    public onClickGold() {
        this.editNumber(UserModel.gold).then(([num]) => {
            UserModel.setGold(num);
            this.fullContent();
        }).catch(()=>{});
    }
    public onClickLevel() {
        this.editNumber(UserModel.curLevelId).then(([num]) => {
            const bool = UserModel.setLevelId(num);
            if (bool) {
                this.fullContent();
            } else {
                Toast.show('Level is not exist');
            }
        }).catch(()=>{});
    }
    public onClickWinTimes() {
        this.editNumber(UserModel.winCombo).then(([num]) => {
            UserModel.setWinTimes(num);
            this.fullContent();
        }).catch(()=>{});
    }
    public onClickPropJoker() {
        this.editNumber(UserModel.getPropCount(PropID.PropJoker)).then(([num]) => {
            UserModel.setProp(PropID.PropJoker,num);
            this.fullContent();
        }).catch(()=>{});
    }
    public onClickPropAddCard() {
        this.editNumber(UserModel.getPropCount(PropID.PropAdd)).then(([num]) => {
            UserModel.setProp(PropID.PropAdd,num);
            this.fullContent();
        }).catch(()=>{});
    }
    public onClickPropUndo() {
        this.editNumber(UserModel.getPropCount(PropID.PropUndo)).then(([num]) => {
            UserModel.setProp(PropID.PropUndo,num);
            this.fullContent();
        }).catch(()=>{});
    }
    public onClickBoosterHook() {
        this.editNumber(UserModel.getBoosterCount(BoosterID.hook),true).then(([num,min]) => {
            UserModel.setBooster(BoosterID.hook,num);
            UserModel.setBoosterFreeTime(BoosterID.hook,min * 60 * 1000);
            this.fullContent();
        }).catch(()=>{});
    }
    public onClickBoosterBlow() {
        this.editNumber(UserModel.getBoosterCount(BoosterID.blow),true).then(([num,min]) => {
            UserModel.setBooster(BoosterID.blow,num);
            UserModel.setBoosterFreeTime(BoosterID.blow,min * 60 * 1000);
            this.fullContent();
        }).catch(()=>{});
    }
    public onClickBoosterJoker() {
        this.editNumber(UserModel.getBoosterCount(BoosterID.joker),true).then(([num,min]) => {
            UserModel.setBooster(BoosterID.joker,num);
            UserModel.setBoosterFreeTime(BoosterID.joker,min * 60 * 1000);
            this.fullContent();
        }).catch(()=>{});
    }
    public onClickStraightWin() {
        if (GameCtrl.isGaming) {
            GameCtrl.onGameEnd(true);
        } else {
            Toast.show('没有在游戏中');
        }
    }
    public onClickReplay() {
        if (GameCtrl.isGaming) {
            GameCtrl.replay();
        } else {
            Toast.show('没有在游戏中');
        }
    }
    //===============================
    private editNumber(curValue: number,bTime = false) {
        this.popInputNumber.active = true;
        const ebNumber = this.popInputNumber.getChildByName('ebNumber').getComponent(EditBox);
        const ebTime = this.popInputNumber.getChildByName('ebTime').getComponent(EditBox);
        ebNumber.string = curValue.toString();
        ebTime.node.active = bTime;
        ebTime.string = '0';
        const btnConfirm = this.popInputNumber.getChildByName('btnConfirm');
        return new Promise<[number,number?]>((resolve, reject) => {
            XUtils.bindClick(btnConfirm, ()=>{
                let numStr = ebNumber.string.trim();
                if (!XUtils.isPureNumber(numStr)) {
                    Toast.show('请输入数字');
                    return;
                }
                let secStr = ebTime.string.trim();
                if (bTime) {
                    if (!XUtils.isPureNumber(numStr)) {
                        Toast.show('请输入分钟数');
                        return;
                    }
                    
                }
                const result:[number,number?] = [parseInt(numStr),0];
                if (bTime) {
                    result[1] = parseInt(secStr);
                }
                this.popInputNumber.active = false;
                resolve(result);
            });
            XUtils.bindClick(this.popInputNumber, () => {
                this.popInputNumber.active = false;
                reject();
            });
        });
    }
}