import { HttpMsgID } from "../data/GameConfig";
import MyFetch from "./MyFetch";

export default class HttpApi {
    public static async login(data: any): Promise<any> {
        console.log('login!!!!!!!');
        
        return await MyFetch.post<any>(HttpMsgID.login, data);
    }
}