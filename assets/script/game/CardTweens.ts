import { tween, v3 } from "cc";
import CardView from "../ui/game/CardView";

export namespace CardTweens {

    const FrameUnit = 1 / 12; // 1帧=1/12秒

    export function linkTable(cardView: CardView) {
        // 0左 1右
        const bRight = cardView.vPosition.x > 0;
        cardView.vAngle = cardView.vAngle % 360 + (bRight ? -360 : 360);
        const startPos = v3(cardView.vPosition);
        const endPos = v3(0, 0);
        return tween(cardView).to(FrameUnit * 7, {
            vPosition: v3(0, 0),
            vAngle: 0,
        }, {
            easing: easeOutCubic,
            onUpdate(target, k) {
                const diffX = endPos.x - startPos.x;
                const diffY = endPos.y - startPos.y;
                let x = startPos.x + diffX * k;
                const k1 = easeInBackHalf(k,1.9);
                let y = startPos.y + diffY * k1;
                let z = 0
                if (k < 0.5) {
                    z = k * 2 * 0.35;
                } else {
                    z = (1 - k) * 2 * 0.35;
                }
                cardView.vPosition = v3(x, y, z);
            },
        });
    }

    export function dealTableCard(cardView: CardView) {
        
    }

    
    function easeInBackHalf(x: number, c1 = 1.70158)  {
        const c2 = c1 * 1.8;
		x = x / 2
        return (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2))
    }

    function easeOutQuad(x: number): number {
        return 1 - (1 - x) * (1 - x);
    }
    function easeOutCubic(x: number): number {
        return 1 - Math.pow(1 - x, 3);
    }
    function easeOutCirc(x: number): number {
        return Math.sqrt(1 - Math.pow(x - 1, 2));
    }
    
}