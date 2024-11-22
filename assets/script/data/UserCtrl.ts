
/**
 * 玩家业务模块
 * 处理登录，玩家数据持久化。
 * 可以考虑把事件上报队列放这里。
 */

import HttpApi from "../net/HttpApi";
import MyFetch from "../net/MyFetch";
import { LoginTypeID } from "./GameConfig";

class UserCtrl {
    // 服务端sessionId
    private sessionId: string;
    private timeoutLogin: any;
    public async login() {
        clearTimeout(this.timeoutLogin);
        HttpApi.login({
            openId: 123, // 设备id
            platform: LoginTypeID.Guest,
            token: '',
            version: 0
        }).then(res=>{
            console.log('### HttpApi.login res:',res);
            if (res?.code == 0) {
                this.onLogin(res.data);
            } else {
                this.retryLogin();
            }
        }).catch(err=>{
            console.log('### HttpApi.login err:',err);
            this.retryLogin();
        });
    }

    private retryLogin() {
        this.timeoutLogin = setTimeout(() => {
            this.login();
        }, 60 * 1000); // 每60s尝试一次登录
    }

    private onLogin(data: any) {
        console.log('###登录成功###');
        this.sessionId = data.sessionId;
        MyFetch.setSessionId(this.sessionId);
        // 开始上报打点队列
    }

    public get isLogin() {
        return !!this.sessionId;
    }
}

export default new UserCtrl();