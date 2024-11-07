import { Component, Size, Sprite, SpriteFrame, UITransform, _decorator } from "cc";
import ConfigMgr from "../manager/ConfigMgr";
import { ResMgr } from "../manager/ResMgr";

const { ccclass, property, menu } = _decorator;

@ccclass("LanguageSprite")
@menu('ui/language/LanguageSprite')
export class LanguageSprite extends Component {
    @property({ tooltip: "包名" })
    private bundleName: string = "res"

    @property({ tooltip: "资源路径（language/texture/内的相对路径）" })
    public path: string = ""

    private _sprite: Sprite;

    get Sprite() {
        if (!this._sprite) {
            this._sprite = this.getComponent(Sprite)!
        }
        return this._sprite;
    }

    set language(lang: string) {
        this.updateSprite()
    }

    start() {
        this.updateSprite()
    }

    updateSprite() {
        let self = this
        let lang = ConfigMgr.instance.current
        let path = `texture/${lang}/${this.path}/spriteFrame`
        ResMgr.instance.load<SpriteFrame>(this.bundleName, path, SpriteFrame, null, (err, frame: SpriteFrame) => {
            if (err) {
                console.error(this.bundleName + "[LanguageSprite] 资源不存在 " + path, err)
            }
            else {
                if (!self || !self.isValid || !self.node || !self.node.isValid) {
                    return
                }
                this.Sprite.spriteFrame = frame;
            }
        })
    }
}