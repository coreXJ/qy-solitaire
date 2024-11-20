import { _decorator, Node, Component, sys, EditBox} from "cc";
import { XUtils } from "../comm/XUtils";
import { Level } from "../data/GameObjects";
import UIEditor from "./UIEditor";

const { ccclass, property } = _decorator;

@ccclass('EditorPopSave')
export class EditorPopSave extends Component {

    @property(EditBox)
    private ebPoolCount: EditBox;
    
    private _view: UIEditor;
    private _level: Level;

    protected onLoad(): void {
        XUtils.bindClick(this.node, ()=>{
            this.hide();
        });
        const btnExport = this.node.getChildByName('btnExport');
        const btnImport = this.node.getChildByName('btnImport');
        XUtils.bindClick(btnExport, ()=>{
            this.exportLevel();
            this.hide();
        });
        XUtils.bindClick(btnImport, ()=>{
            console.log('import');
            this.importJson();
            this.hide();
        });
    }

    public show(view: UIEditor, level: Level) {
        this.node.active = true;
        this._view = view;
        this._level = level;
        this.ebPoolCount.string = this._level.poolCount + '';
        this.ebPoolCount.node.off('text-changed');
        this.ebPoolCount.node.on('text-changed',()=>{
            const str = this.ebPoolCount.string.trim();
            if (XUtils.isPureNumber(str)) {
                this._level.poolCount = parseInt(str);
            }
        });
    }
    public hide() {
        this.node.active = false;
    }
    private exportLevel() {
        if (sys.isBrowser) {
            this._level.tableCards = this._view.table.getCards();
            if (this._level.tableCards.length == 0) {
                return;
            }
            const content = JSON.stringify(this._level);
            const filename = `level${this._level.id}.json`;
            // 创建一个 Blob 对象
            const blob = new Blob([content], { type: 'text/plain' });
            // 创建一个临时的 URL
            const url = URL.createObjectURL(blob);
            // 创建一个隐藏的 <a> 元素
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            // 将 <a> 元素添加到 DOM 中
            document.body.appendChild(a);
            // 触发点击事件
            a.click();
            // 移除 <a> 元素
            document.body.removeChild(a);
            // 释放 URL 对象
            URL.revokeObjectURL(url);
        }
    }
    private importJson() {
        if (sys.isBrowser) {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.json';
            // 为文件输入控件添加 change 事件监听器
            fileInput.addEventListener('change', (event)=> {
                // console.log('event',event.target['files']);
                const file:File = event.target['files'][0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e)=> {
                        try {
                            const content = <string>e.target.result;
                            console.log('content',content);
                            if (content?.length > 0) {
                                const level = JSON.parse(content);
                                this._view.resumeLevel(level);
                            }
                        } catch (error) {
                            console.error('Error reading or parsing the file:', error);
                        }
                    };
                    reader.readAsText(file);
                } else {
                }
                fileInput.remove();
            });
            fileInput.click();
        }
    }
}