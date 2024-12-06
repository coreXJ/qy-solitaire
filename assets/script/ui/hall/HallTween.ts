import { Node, tween, UIOpacity, UITransform, v3, view } from "cc";

export default {
    enter(bg: Node, ndTop: Node, ndBottom: Node, ndLeft: Node, ndRight: Node, ndLevel: Node) {
        // 1.top往下进入、play和booster往上进入
        // 2.左边右边进入
        const size = view.getVisibleSize();
        const height = size.height;
        const width = size.width;
        const x = width/2;
        const y = height/2;
        const moveDistance = 160;
        const topY = height / 2;
        const bottomY = -height / 2;
        const topHeight = ndTop.getComponent(UITransform).height;
        const bottomHeight = ndBottom.getComponent(UITransform).height;
        tween(ndTop).set({position: v3(0,topY + topHeight)})
            .to(0.5, {position: v3(0,topY)},{easing: 'backOut'})
            .start();
        tween(ndBottom).set({position: v3(0,bottomY - bottomHeight)})
            .to(0.5, {position: v3(0, bottomY)},{easing: 'backOut'})
            .start();
        tween(ndLeft).set({position: v3(-x-moveDistance,0)})
            .to(0.5, {position: v3(-x,0)},{easing: 'backOut'})
            .start();
        tween(ndRight).set({position: v3(x+moveDistance,0)})
            .to(0.5, {position: v3(x,0)},{easing: 'backOut'})
            .start();
        const opLevel = ndLevel.getComponent(UIOpacity);
        tween(opLevel).set({opacity: 0})
            .to(0.5, {opacity: 255},{easing: 'fade'})
            .start();
        const bgs = bg.children;
        const startPosArr = [
            v3(-x - moveDistance, y + moveDistance),
            v3(x + moveDistance, y + moveDistance),
            v3(-x - moveDistance, -y - moveDistance),
            v3(x + moveDistance, -y - moveDistance),
        ];
        const endPosArr = [
            v3(-x, y),
            v3(x, y),
            v3(-x, -y),
            v3(x, -y),
        ];
        for (let i = 0; i < 4; i++) {
            const nd = bgs[i];
            const op = nd.getComponent(UIOpacity);
            tween(op).set({opacity:0})
                .to(0.5, {opacity: 255},{easing:'quintOut'})
                .start();
            tween(nd).set({position:startPosArr[i]})
                .to(0.5, {position: endPosArr[i]},{easing:'quintOut'})
                .start();
        }
    },

    exit(bg: Node, ndTop: Node, ndBottom: Node, ndLeft: Node, ndRight: Node, ndLevel: Node) {
        return new Promise<void>(resolve => {
            const size = view.getVisibleSize();
            const height = size.height;
            const width = size.width;
            const x = width/2;
            const y = height/2;
            const moveDistance = 160;
            const topY = height / 2;
            const bottomY = -height / 2;
            const topHeight = ndTop.getComponent(UITransform).height;
            const bottomHeight = ndBottom.getComponent(UITransform).height;
            tween(ndTop).set({position: v3(0,topY)})
                .to(0.5, {position: v3(0,topY + topHeight)},{easing: 'backIn'})
                .start();
            tween(ndBottom).set({position: v3(0,bottomY)})
                .to(0.5, {position: v3(0, bottomY - bottomHeight)},{easing: 'backIn'})
                .call(()=>resolve())
                .start();
            tween(ndLeft).set({position: v3(-x,0)})
                .to(0.5, {position: v3(-x-moveDistance,0)},{easing: 'backIn'})
                .start();
            tween(ndRight).set({position: v3(x,0)})
                .to(0.5, {position: v3(x+moveDistance,0)},{easing: 'backIn'})
                .start();
            const opLevel = ndLevel.getComponent(UIOpacity);
            tween(opLevel).set({opacity: 255})
                .to(0.5, {opacity: 0},{easing: 'fade'})
                .start();
            const bgs = bg.children;
            const startPosArr = [
                v3(-x, y),
                v3(x, y),
                v3(-x, -y),
                v3(x, -y),
            ];
            const endPosArr = [
                v3(-x - moveDistance, y + moveDistance),
                v3(x + moveDistance, y + moveDistance),
                v3(-x - moveDistance, -y - moveDistance),
                v3(x + moveDistance, -y - moveDistance),
            ];
            for (let i = 0; i < 4; i++) {
                const nd = bgs[i];
                const op = nd.getComponent(UIOpacity);
                tween(op).set({opacity:255})
                    .to(0.5, {opacity: 0},{easing:'quintIn'})
                    .start();
                tween(nd).set({position:startPosArr[i]})
                    .to(0.5, {position: endPosArr[i]},{easing:'quintIn'})
                    .start();
            }
        });
    }
}