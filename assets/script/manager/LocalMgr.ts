import { _decorator, Component, Node, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LocalMgr')
export default class LocalMgr {
    public static readonly instance: LocalMgr = new LocalMgr(); 

    public setNumber(key: string, data: number) {
        try {
            sys.localStorage.setItem(key, data.toString());
        } catch (error) {
            console.warn(key, error);
        }
    }

    public getNumber(key: string, defaultValue?: number) {
        try {
            let value = sys.localStorage.getItem(key);
            if (value == null || value == "" || value == undefined) {
                if (defaultValue != null) {
                    return defaultValue;
                }
                return null;
            }
            return Number(value);
        } catch (error) {
            console.warn(key, error);
        }
    }

    public setString(key: string, data: String) {
        try {
            sys.localStorage.setItem(key, data.toString());
        } catch (error) {
            console.warn(key, error);
        }
    }

    public getString(key: string, defaultValue?: string): string {
        try {
            let value = sys.localStorage.getItem(key);
            if (value == null || value == "" || value == undefined) {
                if (defaultValue != null) {
                    return defaultValue;
                }
            }
            return value;
        } catch (error) {
            console.warn(key, error);
        }
    }

    public setBoolean(key: string, data: boolean) {
        try {
            localStorage.setItem(key, data ? '1' : '0');
        } catch (error) {
            console.warn(key, error);
        }
    }

    public getBoolean(key: string, defaultValue?: boolean): boolean {
        try {
            let value = sys.localStorage.getItem(key);
            if (value == null || value == "" || value == undefined) {
                if (defaultValue != null) {
                    return defaultValue;
                }
            }
            return value == '1';
        } catch (error) {
            console.warn(key, error);
        }
    }

    public setJson(key: string, data: JSON) {
        try {
            sys.localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.warn(key, error);
        }
    }

    public getJson(key: string) {
        try {
            let value = sys.localStorage.getItem(key);
            if (value == null || value == "" || value == undefined) {
                return null;
            }
            return JSON.parse(value);
        } catch (error) {
            console.warn(key, error);
        }
    }

    public setItem(key: string, data: any) {
        try {
            sys.localStorage.setItem(key, data);
        } catch (error) {
            console.warn(key, error);
        }
    }

    public getItem(key: string): any {
        try {
            return sys.localStorage.getItem(key);
        } catch (error) {
            console.warn(key, error);
        }
    }

    public hasItem(key: string) {
        let str = sys.localStorage.getItem(key);
        return str != null;
    }

    public removeItem(key: string) {
        sys.localStorage.removeItem(key);
    }

    public clearItes() {
        sys.localStorage.clear();
    }
}



