import { UIMgr } from './UIMgr';

/**
 * 自动弹窗管理
 */
export class AutoPopViewMgr {
    public static readonly instance: AutoPopViewMgr = new AutoPopViewMgr(); 
    private autoPopViews: any[] = [];

    has(viewId: number): boolean {
        for (let index = 0; index < this.autoPopViews.length; index++) {
            const element = this.autoPopViews[index];
            if (viewId == element['uiId']) {
                return true;
            }
        }
        return false;
    }

    addViewID(viewId: number, ...args : any) {
        if(!this.has(viewId)){
            let viewInfo: any = {};
            viewInfo['uiId'] = viewId;
            viewInfo['type'] = 1; //独立窗口
            viewInfo['bShow'] = true; //是否需要弹窗
            viewInfo['uiId'] = viewId;
            viewInfo['args'] = args;
            // viewInfo['zOrder'] = UserModel.instance.pop_up_seq[viewId] ? UserModel.instance.pop_up_seq[viewId] : 0;
            this.autoPopViews.push(viewInfo);
            this.autoPopViews.sort((a, b)=>{
                return a['zOrder'] - b['zOrder'];
            })
        }
    }

    getViewByID(viewId: number){
        for (var i = 0; i < this.autoPopViews.length; ++i) {
            if(this.autoPopViews[i]['uiId'] == viewId){
                return this.autoPopViews[i];
            }
        }
        return null;
    }

    removeViewID(viewId: number){
        for (var i = 0; i < this.autoPopViews.length; ++i) {
            if(this.autoPopViews[i]['uiId'] == viewId){
                this.autoPopViews.splice(i, 1);
                break;
            }
        }
    }

    popView(){
        console.log('#### this.autoPopViews ===========',this.autoPopViews);
        for (var i = 0; i < this.autoPopViews.length; ++i) {
            if(this.autoPopViews[i]['bShow']){
                if(this.autoPopViews[i]['type'] == 1){
                    UIMgr.instance.open(this.autoPopViews[i]['uiId'], ...this.autoPopViews[i]['args']);
                }
                this.autoPopViews[i]['bShow'] = false;
                break;
            }
        }
    }

    clearAll(){
        this.autoPopViews = [];
    }

    isPopViews(): boolean {
        for (let index = 0; index < this.autoPopViews.length; index++) {
            if(this.autoPopViews[index]['bShow']){
                return true;
            }
        }
        return false;
    }

}


