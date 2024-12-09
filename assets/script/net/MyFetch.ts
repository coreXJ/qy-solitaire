/**
 * fetch简单封装
 */

import { HttpMsgID } from "../data/GameConfig";

class MyFetch {
    private static baseUrl: string = 'http://solitaire.test.woohooslots.com:8080/';
    private static sessionId: string = '';
    public static setSessionId(sessionId: string) {
        this.sessionId = sessionId;
    }
    private static async handleResponse(response: Response): Promise<any> {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    public static async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
        const url = new URL(this.baseUrl + endpoint);
        if (params) {
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        }
        const response = await fetch(url.toString());
        return this.handleResponse(response);
    }

    // public static async post<T>(endpoint: string, body: Record<string, any>): Promise<T> {
    //     const response = await fetch(this.baseUrl + endpoint, {
    //         method: 'POST',
    //         headers: {
    //         'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(body)
    //     });
    //     return this.handleResponse(response);
    // }
    public static async post<T>(MSG_ID: HttpMsgID, data: any): Promise<IResp<T>> {
        const body: Record<string, any> = {
            c: MSG_ID, // 消息ID[MSG_ID]
            k: JSON.stringify(data), // API参数序列化字符串(pbuf需要转base64)
            s: this.sessionId, // SessionId 登录后有
            f: 'json', // 消息格式[json|pbuf]
        }
        const formData = this.objectToFormData(body);
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });

        return this.handleResponse(response);
    }
    private static objectToFormData(params: Record<string, any>): string {
        return Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
    }
}

export default MyFetch;


export interface IResp<T> {
    code: number;
    data: T;
    msg: string;
}