import { Tween, tween, UIOpacity, v3, Vec3, view ,Node} from "cc";
import CardView from "../ui/game/CardView";
import { POOL_OFFSET_X, POOL_VISIBLE_CARD_COUNT } from "../ui/game/ViewHand";

export namespace CardTweens {

    export const FrameUnit = 1 / 12; // 1帧=1/12秒

    export function linkTable(cardView: CardView) {
        // 0左 1右
        const bRight = cardView.vPosition.x > 0;
        cardView.vAngle = cardView.vAngle % 360 + (bRight ? -360 : 360);
        const startPos = v3(cardView.vPosition);
        const endPos = v3(0, 0);
        return tween(cardView).parallel(
            tween(cardView).to(FrameUnit * 7, {
                vPositionXY: v3(0, 0),
                vAngle: 0,
            }, {
                easing: 'quadOut',
                onUpdate(target, k) {
                    const diffX = endPos.x - startPos.x;
                    const diffY = endPos.y - startPos.y;
                    let x = startPos.x + diffX * k;
                    const k1 = easeInBackHalf(k,1.9);
                    let y = startPos.y + diffY * k1;
                    let z = 0
                    if (k < 0.5) {
                        z = k * 2 * 0.30;
                    } else {
                        z = (1 - k) * 2 * 0.30;
                    }
                    cardView.vPosition = v3(x, y, z);
                },
            }),
            tween(cardView).to(FrameUnit * 7, {
                vAngle: 0,
            }, {
                easing: 'sineOut',
            })
        );
    }
    export function propJoker(cardView: CardView) {
        const startPos = v3(cardView.vPosition);
        const endPos = v3(0, 0);
        const topY = startPos.y * 1.4;
        const topDiff = topY - startPos.y;
        console.log('propJoker',startPos);
        return tween(cardView).to(FrameUnit * 6, {
                vPositionXY: v3(0, 0),
            }, {
                easing: 'sineIn',
                onUpdate(target, k) {
                    const diffX = endPos.x - startPos.x;
                    let x = startPos.x + diffX * k;
                    let y = 0;
                    let z = 0
                    if (k < 0.5) {
                        k = easeOutCubic(k*2);
                        y = startPos.y + topDiff * k;
                        cardView.vAngle = 15 * k;
                    } else {
                        k = easeInQuad((k-0.5)*2);
                        y = topY - topY * k;
                        cardView.vAngle = 15 - k * 15;
                    }
                    cardView.vPosition = v3(x, y, z);
                },
            });
    }
    export function dealTableCard(cardView: CardView, idx: number) {
        // 起始位置在屏幕左边中间
        const startX = -view.getVisibleSize().width / 2 - CardView.WIDTH;
        const startPos = v3(startX, 0, 0.2);
        const endPos = v3(cardView.data.tPos);
        cardView.vPosition = startPos;
        cardView.vAngle = -30;
        cardView.node.active = false;
        return tween(cardView).delay(idx * 0.1)
            .call(()=>{
                cardView.node.active = true;
            }).parallel(
                tween(cardView).to(FrameUnit * 10, {
                    vPositionXY: endPos,
                    vAngle: cardView.data.tAngle,
                }, {
                    easing: 'quadOut',
                }),
                tween(cardView).to(FrameUnit * 10, {
                    z: 0,
                }, {
                    easing: 'quadIn',
                }),
            )
    }

    export function addPoolCard(cardView: CardView, idx: number, total: number) {
        const startX = -CardView.WIDTH * 0.5;
        const num = Math.min(total - idx, POOL_VISIBLE_CARD_COUNT) - 1;
        const x = startX + num * POOL_OFFSET_X;
        let startPos = v3(x + 50, -200); // 屏幕下方中间
        let endPos = v3(x, 0, 0);
        let z = 0.2;
        let angle = 15;
        cardView.z = z;
        cardView.node.active = false;
        cardView.vPositionXY = startPos;
        cardView.vAngle = angle;
        return tween(cardView)
            .delay(idx * 0.1)
            .call(()=>{
                cardView.node.active = true;
            })
            .to(FrameUnit * 8, {
                // z: 0,
                vPositionXY:endPos
            }, {
                easing: 'backOut',
                onUpdate(target, ratio) {
                    cardView.z = z - ratio * z;
                    let r1 = Math.min(1, ratio / 0.5);
                    cardView.vAngle = angle - easeOutBackHalf(r1, 1.9) * angle;
                    // let x = startPos.x + (endPos.x - startPos.x) * easeOutBack(ratio);
                    // let y = startPos.y + (endPos.y - startPos.y) * easeOutBack(ratio);
                    // cardView.vPositionXY = v3(x, y);
                },
            });
    }
    /**table表面卡缓动 */
    export function shake(cardView: CardView, bTop = false) {
        const startAngle = cardView.data.tAngle;
        cardView.vAngle = startAngle;
        Tween.stopAllByTarget(cardView);
        if (bTop) {
            // FrameUnit*2 放大0.15
            // delay FrameUnit*2
            // FrameUnit*2 缩小0.15
            tween(cardView)
                .to(FrameUnit * 2, {z: 0.15}, {easing: 'cubicOut'})
                .delay(FrameUnit * 2)
                .to(FrameUnit * 2, {z: 0}, {easing: 'cubicIn'})
                .start();
            return tween(cardView)
                .by(FrameUnit, {vAngle: 15})
                .by(FrameUnit, {vAngle: -30})
                .by(FrameUnit, {vAngle: 25})
                .by(FrameUnit, {vAngle: -15})
                .by(FrameUnit, {vAngle: 10})
                .by(FrameUnit, {vAngle: -5})
                .start();
        } else {
            return tween(cardView)
                .by(FrameUnit, {vAngle: 7.5})
                .by(FrameUnit, {vAngle: -15})
                .by(FrameUnit, {vAngle: 12.5})
                .by(FrameUnit, {vAngle: -7.5})
                .by(FrameUnit, {vAngle: 5})
                .by(FrameUnit, {vAngle: -2.5})
                .start();
        }
    }
    export function fadeOut(cardView: CardView) {
        const op = cardView.getComponent(UIOpacity) || cardView.addComponent(UIOpacity);
        return tween(op).to(FrameUnit * 4, {
            opacity: 0,
        }, {
            easing: 'fade',
        });
    }
    export function fadeIn(cardView: CardView) {
        const op = cardView.getComponent(UIOpacity) || cardView.addComponent(UIOpacity);
        return tween(op).to(FrameUnit * 4, {
            opacity: 255,
        }, {
            easing: 'fade',
        });
    }
    export function popTaskAwardCard(cardView: CardView) {
        return tween(cardView)
            .set({
                z: -0.8,
                vAngle: -5
            })
            .to(FrameUnit * 3, {
                z: 0,
            }, {
                easing: 'backOut',
            }).delay(FrameUnit * 3);
    }
    export function movePoolCard(cardView: CardView, x: number) {
        return tween(cardView).to(FrameUnit * 6, {
            vPosition: v3(x, 0, 0),
            vAngle: 0
        }, { easing: 'cubicOut' });
    }
    export function moveTaskAwardPoolCard(cardView: CardView, x: number) {
        return tween(cardView)
            // .delay(idx * FrameUnit * 2)
            .to(FrameUnit * 6, {
                vPosition: v3(x, CardView.HEIGHT / 2, 0),
                vAngle: 5,
            }, { easing: 'quadOut' })
            .to(FrameUnit * 4, {
                vPosition: v3(x, 0, 0),
                vAngle: 0,
            }, { easing: 'sineIn' });
    }

    export function fall(cardView: CardView, layer: number) {
        const vAngle = cardView.vAngle <= 0 ? -15 : 15;
        const y = cardView.vWorldPosition.y;
        return tween(cardView)
            .delay(FrameUnit * layer * 2)
            .parallel(
                tween(cardView).by(FrameUnit * 10, {
                    vWorldPosition: v3(0, -y - CardView.HEIGHT, 0),
                    vAngle
                }, { easing: 'cubicIn' }),
                tween(cardView).to(FrameUnit * 10, {
                    z: 0.2
                }, { easing: 'cubicOut' }),
            )
    }

    export function fadeOutTop(cardView: CardView, addMs: number, onBefore: Function) {
        const x = cardView.vPositionXY.x;
        const op = cardView.getComponent(UIOpacity) || cardView.addComponent(UIOpacity);
        return tween(cardView)
            // .delay(FrameUnit * 2 * idx)
            .call(()=>{
                op.opacity = 255;
            })
            .delay(FrameUnit * 1.5 + addMs)
            .call(()=>{
                // call callback
                onBefore();
                tween(op)
                    .delay(FrameUnit * 2)
                    .to(FrameUnit * 2, {
                        opacity: 0
                    }, { easing: 'fade' })
                    .start();
            })
            .to(FrameUnit * 4, {
                vPositionXY: v3(x, CardView.HEIGHT / 3)
            }, { easing: 'cubicOut' });
    }
    export function fadeOutWinPoolGold(nd: Node) {
        const toPos = v3(nd.position).add(v3(0, CardView.HEIGHT / 3, 0));
        nd.active = false;
        return tween(nd)
            .delay(FrameUnit * 2)
            .set({active: true})
            .call(()=>{
                const op = nd.getComponent(UIOpacity) || nd.addComponent(UIOpacity);
                tween(op)
                    .delay(FrameUnit * 4)
                    .to(FrameUnit * 8, {
                        opacity: 0
                    }, { easing: 'cubicOut' }).start();
            }).to(FrameUnit * 8, {
                position: toPos
            }, { easing: 'cubicOut' })
            .delay(FrameUnit * 4)
    }
    export function fadeOutNode(nd: Node) {
        const op = nd.getComponent(UIOpacity) || nd.addComponent(UIOpacity);
        return tween(op).to(FrameUnit * 4, {
            opacity: 0
        }, { easing: 'fade' });
    }

    function easeInOutBack(x: number): number {
        const c1 = 1.70158;
        const c2 = c1 * 1.525;
        return x < 0.5
            ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
            : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
    }
    function easeInBackHalf(x: number, c1 = 1.70158)  {
        const c2 = c1 * 1.8;
		x = x / 2
        return (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2))
    }
    function easeOutBackHalf(x: number, c1 = 1.70158)  {
        const c2 = c1 * 1.8;
		x = 0.5 + x / 2
        return (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
    }
    function easeInBack(x: number, c1 = 1.70158): number {
        const c3 = c1 + 1;
        return c3 * x * x * x - c1 * x * x;
    }
    function easeOutBack(x: number, c1 = 1.70158): number {
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }
    
    function easeOutQuad(x: number): number {
        return 1 - (1 - x) * (1 - x);
    }
    function easeInQuad(x: number): number {
        return x * x;
    }
    function easeOutCubic(x: number): number {
        return 1 - Math.pow(1 - x, 3);
    }
    function easeInCubic(x: number): number {
        return x * x * x;
    }
    function easeOutCirc(x: number): number {
        return Math.sqrt(1 - Math.pow(x - 1, 2));
    }
    
}