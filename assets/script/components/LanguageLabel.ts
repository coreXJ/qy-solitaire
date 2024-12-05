import { CCString, Component, error, Label, RichText, warn, _decorator } from "cc";
import { EDITOR } from "cc/env";
import ConfigMgr from "../manager/ConfigMgr";

const { ccclass, property, menu } = _decorator;

@ccclass("LanguageLabel")
@menu('ui/language/LanguageLabel')
export class LanguageLabel extends Component {
    @property({ serializable: true })
    private _dataID: string = ""
    @property({ type: CCString, serializable: true })
    get dataID(): string {
        return this._dataID || ""
    }
    set dataID(value: string) {
        this._dataID = value
        if (!EDITOR) {
            this._needUpdate = true
        }
    }

    get string(): string {
        let _string = ConfigMgr.getLangTextByID(this._dataID)
        if (!_string) {
            console.warn("[LanguageLabel] 未找到语言标识，使用dataID替换")
            _string = this._dataID
        }
        return _string
    }

    set language(lang: string) {
        this._needUpdate = true
    }

    private _needUpdate: boolean = false

    onLoad() {
        this._needUpdate = true
        if (!this.getComponent(Label) && !this.getComponent(RichText)) {
            error(this.node.name, this._dataID)
            return
        }
    }

    /**
     * 默认文本的系统字体名字
     */
    public getLabelFont(lang: string): string {
        switch (lang) {
            case "zh":
            case "tr": {
                return "SimHei";
            }
        }
        return "Helvetica";
    }

    update() {
        if (this._needUpdate) {
            this.updateLabel()
            this._needUpdate = false;
        }
    }

    updateLabel() {
        do {
            if (!this._dataID) {
                break;
            }

            let spcomp: any = this.getComponent(Label)
            if (!spcomp) {
                spcomp = this.getComponent(RichText)
                if (!spcomp) {
                    warn("[LanguageLabel], 该节点没有cc.Label || cc.RichText组件")
                    break
                }
            }
            spcomp.string = this.string
        }
        while (false)
    }
}
