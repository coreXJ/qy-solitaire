import { Node, tween, UIOpacity } from "cc";

export namespace CommTweens {

    export function fadeOut(node: Node, duration = 0.3) {
        const op = node.getComponent(UIOpacity) || node.addComponent(UIOpacity);
        return tween(op)
        .set({ opacity: 255 })
        .to(duration, {
            opacity: 0,
        }, {
            easing: 'fade',
        });
    }
    export function fadeIn(node: Node, duration = 0.3) {
        const op = node.getComponent(UIOpacity) || node.addComponent(UIOpacity);
        return tween(op)
        .set({ opacity: 0 })
        .to(duration, {
            opacity: 255,
        }, {
            easing: 'fade',
        });
    }
    export function fadeTo(node: Node, opacity:number, duration = 0.5) {
        const op = node.getComponent(UIOpacity) || node.addComponent(UIOpacity);
        return tween(op)
        .to(duration, {
            opacity,
        }, {
            easing: 'fade',
        });
    }

}