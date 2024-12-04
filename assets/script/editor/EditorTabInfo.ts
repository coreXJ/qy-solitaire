import { _decorator, Node, Component, EditBox} from "cc";
import { XUtils } from "../comm/XUtils";
import UIEditor from "./UIEditor";
import { Level } from "../data/GameObjects";

const { ccclass, property } = _decorator;

@ccclass('EditorTabInfo')
export class EditorTabInfo extends Component {

    private infos = [
        'tableComboRange',
        'minBreakDiff',
        'ascProb',
        'minGuarantee',
        'maxComboRedProb',
        'breakSwitchProb',
    ];

    public init(view: UIEditor, level: Level) {
        // const ebMap: { [key: string]: EditBox } = {};
        for (const info of this.infos) {
            const nd = this.node.getChildByName(info);
            if (info == 'tableComboRange') {
                const ebs = nd.getComponentsInChildren(EditBox);
                const eb0 = ebs[0];
                const eb1 = ebs[1];
                eb0.string = level[info][0] + '';
                eb1.string = level[info][1] + '';
                eb0.node.off('text-changed');
                eb0.node.on('text-changed', () => {
                    const str = eb0.string.trim();
                    if (XUtils.isPureNumber(str)) {
                        level[info][0] = parseInt(str);
                    }
                });
                eb1.node.off('text-changed');
                eb1.node.on('text-changed', () => {
                    const str = eb1.string.trim();
                    if (XUtils.isPureNumber(str)) {
                        level[info][1] = parseInt(str);
                        console.log('xxxxxj',level);
                    }
                });
            } else {
                const eb = nd.getComponentInChildren(EditBox);
                eb.string = level[info] + '';
                eb.node.off('text-changed');
                eb.node.on('text-changed', () => {
                    const str = eb.string.trim();
                    if (XUtils.isPureNumber(str)) {
                        level[info] = parseInt(str);
                        console.log('xxxxxj',level);
                    }
                });
            }
        }
    }

}