import { Node, UITransform } from 'cc';
import { Card } from '../data/GameObjects';
import CardView from '../ui/game/CardView';
// export namespace GameGeometry {
    
//     function rotatePoint(x: number, y: number, cx: number, cy: number, angle: number): [number, number] {
//         const radian = (angle * Math.PI) / 180;
//         const cos = Math.cos(radian);
//         const sin = Math.sin(radian);
//         const nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
//         const ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
//         return [nx, ny];
//     }
    
//     export function getRectVertices(rect: GameRect): [number, number][] {
//         const { x, y, width, height, angle } = rect;
//         const halfWidth = width / 2;
//         const halfHeight = height / 2;
    
//         const vertices = [
//             [x - halfWidth, y - halfHeight], // 左下角
//             [x + halfWidth, y - halfHeight], // 右下角
//             [x + halfWidth, y + halfHeight], // 右上角
//             [x - halfWidth, y + halfHeight]  // 左上角
//         ];
    
//         return vertices.map(([vx, vy]) => rotatePoint(vx, vy, x, y, angle));
//     }
    
//     export function isPointInRect(px: number, py: number, rect: GameRect): boolean {
//         const vertices = getRectVertices(rect);
//         const [x1, y1] = vertices[0];
//         const [x2, y2] = vertices[1];
//         const [x3, y3] = vertices[2];
//         const [x4, y4] = vertices[3];
    
//         const ax = Math.min(x1, x2, x3, x4);
//         const bx = Math.max(x1, x2, x3, x4);
//         const ay = Math.min(y1, y2, y3, y4);
//         const by = Math.max(y1, y2, y3, y4);
    
//         return px >= ax && px <= bx && py >= ay && py <= by;
//     }
    
//     export function doRectsIntersect(rect1: GameRect, rect2: GameRect): boolean {
//         console.log('doRectsIntersect',rect1,rect2);
        
//         const vertices1 = getRectVertices(rect1);
//         const vertices2 = getRectVertices(rect2);
//         console.log('判断A的4个顶点是否在B内');
//         for (const [px, py] of vertices1) {
//             let result = isPointInRect(px, py, rect2)
//             console.log('isPointInRect',px,py,rect2);
//             console.log('result',result);
//             if (isPointInRect(px, py, rect2)) {
//                 return true;
//             }
//         }
//         console.log('判断B的4个顶点是否在B内');
//         for (const [px, py] of vertices2) {
//             let result = isPointInRect(px, py, rect1)
//             console.log('isPointInRect',px,py,rect1);
//             console.log('result',result);
//             if (isPointInRect(px, py, rect1)) {
//                 return true;
//             }
//         }
    
//         return false;
//     }
// }

export namespace GameGeometry {
    /**带旋转角度的Rect */
    export interface IRect {
        x: number; // 矩形的中心点 x 坐标
        y: number; // 矩形的中心点 y 坐标
        width: number;
        height: number;
        angle: number; // 旋转角度，单位为度
    }
    export function getRectVertices(rect: IRect): [number, number][] {
        const { x, y, width, height, angle } = rect;
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        const radian = (angle * Math.PI) / 180;
    
        const cos = Math.cos(radian);
        const sin = Math.sin(radian);
    
        return [
            [x + halfWidth * cos - halfHeight * sin, y + halfWidth * sin + halfHeight * cos],
            [x - halfWidth * cos - halfHeight * sin, y - halfWidth * sin + halfHeight * cos],
            [x - halfWidth * cos + halfHeight * sin, y - halfWidth * sin - halfHeight * cos],
            [x + halfWidth * cos + halfHeight * sin, y + halfWidth * sin - halfHeight * cos]
        ];
    }
    
    function project(vertices: [number, number][], axis: [number, number]): [number, number] {
        let min = Infinity;
        let max = -Infinity;
        for (const vertex of vertices) {
            const projection = vertex[0] * axis[0] + vertex[1] * axis[1];
            if (projection < min) min = projection;
            if (projection > max) max = projection;
        }
        return [min, max];
    }
    
    function isSeparated(projectionA: [number, number], projectionB: [number, number]): boolean {
        return projectionA[1] < projectionB[0] || projectionB[1] < projectionA[0];
    }
    
    function normalize(axis: number[]): [number, number] {
        const length = Math.sqrt(axis[0] ** 2 + axis[1] ** 2);
        return [axis[0] / length, axis[1] / length];
    }
    
    export function doRectsIntersect(rect1: IRect, rect2: IRect): boolean {
        const vertices1 = getRectVertices(rect1);
        const vertices2 = getRectVertices(rect2);
    
        const axes1 = [
            [vertices1[1][0] - vertices1[0][0], vertices1[1][1] - vertices1[0][1]],
            [vertices1[3][0] - vertices1[0][0], vertices1[3][1] - vertices1[0][1]]
        ];
    
        const axes2 = [
            [vertices2[1][0] - vertices2[0][0], vertices2[1][1] - vertices2[0][1]],
            [vertices2[3][0] - vertices2[0][0], vertices2[3][1] - vertices2[0][1]]
        ];
    
        for (const axis of [...axes1, ...axes2]) {
            const normalizedAxis = normalize(axis);
            const projection1 = project(vertices1, normalizedAxis);
            const projection2 = project(vertices2, normalizedAxis);
    
            if (isSeparated(projection1, projection2)) {
                return false;
            }
        }
    
        return true;
    }
    export function node2rect(node: Node): IRect {
        const trans = node.getComponent(UITransform);
        return {
            x: node.position.x,
            y: node.position.y,
            width: trans.width,
            height: trans.height,
            angle: node.angle
        };
    }
    export function card2rect(card: Card): IRect {
        return {
            x: card.tPos?.x || 0,
            y: card.tPos?.y || 0,
            width: CardView.WIDTH,
            height: CardView.HEIGHT,
            angle: card.tAngle || 0,
        }
    }
    export function doNodesIntersect(node1: Node, node2: Node): boolean {
        return doRectsIntersect(node2rect(node1), node2rect(node2));
    }
    export function doCardsIntersect(card1: Card, card2: Card): boolean {
        return doRectsIntersect(card2rect(card1), card2rect(card2));
    }
    export function isPointInRect(point: [number, number], rect: IRect): boolean {
        const { x, y, width, height, angle } = rect;
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        const radian = (angle * Math.PI) / 180;
    
        const cos = Math.cos(radian);
        const sin = Math.sin(radian);
    
        const dx = point[0] - x;
        const dy = point[1] - y;
    
        const localX = dx * cos + dy * sin;
        const localY = -dx * sin + dy * cos;
    
        return Math.abs(localX) <= halfWidth && Math.abs(localY) <= halfHeight;
    }
}