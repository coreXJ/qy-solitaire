import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EventMgr')
export class EventMgr {
    public static readonly instance: EventMgr = new EventMgr(); 
    private handles = {};
    dispatch(eventName: string, ...data:any) {
        // console.log('dispatch',eventName,...data);
        const returns = [];
        const handlers = this.handles[eventName];
        if (!handlers) return returns;
        for (const { callback, target } of handlers) {
            const length = data.length;
            const args = length === 0 ? [] : Array.from(data).slice(0, length);
            const returnValue = callback.apply(target, args);
            returns.push(returnValue);
        }
        return returns;
    }
    has(eventName: string, callback: Function): boolean {
        if (!this.handles[eventName]) {
            return false;
        }
        return this.handles[eventName].some(item => item.callback === callback);
    }
    on(eventName: string, callback: Function, target: any) {
        if (!this.handles[eventName]) {
            this.handles[eventName] = [];
        }
        const data = { callback, target };
        const existingIndex = this.handles[eventName].findIndex(item => item.callback === callback && item.target === target);
        if (existingIndex === -1) {
            this.handles[eventName].push(data);
        } else {
            this.handles[eventName][existingIndex] = data;
            // console.log("重复注册事件:", eventName);
        }
    }
    offAll(eventName: string) {
        if (this.handles[eventName]) {
            delete this.handles[eventName];
        }
    }

    mulOn(eventName: string, callback: Function, target) {
        if (!this.handles[eventName]) {
            this.handles[eventName] = [];
        }
        let data = {
            "callback": callback,
            "target": target
        }
        this.handles[eventName].push(data)
    }
    off(eventName: string, callback: Function, target?: any) {
        if (!this.handles[eventName]) {
            return;
        }
        const itemsToRemove = this.handles[eventName].filter(item => {
            if (!target) {
                return item.callback === callback;
            } else {
                return item.callback === callback && item.target === target;
            }
        });
        for (const item of itemsToRemove) {
            const index = this.handles[eventName].indexOf(item);
            if (index !== -1) {
                this.handles[eventName].splice(index, 1);
            }
        }
    }
    clearAll() {
        this.handles = {};
    }
}


