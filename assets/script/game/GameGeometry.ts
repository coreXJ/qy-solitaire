import { Node, UITransform } from 'cc';
export namespace GameGeometry {
    
    interface Rect {
        x: number;
        y: number;
        width: number;
        height: number;
        angle: number; // 旋转角度，单位为度
    }
        
    function rotatePoint(x: number, y: number, cx: number, cy: number, angle: number): [number, number] {
        const radian = (angle * Math.PI) / 180;
        const cos = Math.cos(radian);
        const sin = Math.sin(radian);
        const nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
        const ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        return [nx, ny];
    }

    function getRectVertices(rect: Rect): [number, number][] {
        const { x, y, width, height, angle } = rect;
        const vertices = [
            [x, y],
            [x + width, y],
            [x + width, y + height],
            [x, y + height]
        ];

        return vertices.map(([vx, vy]) => rotatePoint(vx, vy, x + width / 2, y + height / 2, angle));
    }

    function isPointInRect(px: number, py: number, rect: Rect): boolean {
        const vertices = getRectVertices(rect);
        const [x1, y1] = vertices[0];
        const [x2, y2] = vertices[1];
        const [x3, y3] = vertices[2];
        const [x4, y4] = vertices[3];

        const ax = Math.min(x1, x2, x3, x4);
        const bx = Math.max(x1, x2, x3, x4);
        const ay = Math.min(y1, y2, y3, y4);
        const by = Math.max(y1, y2, y3, y4);

        return px >= ax && px <= bx && py >= ay && py <= by;
    }
    export function node2rect(node: Node): Rect {
        const trans = node.getComponent(UITransform);
        return {
            x: node.position.x,
            y: node.position.y,
            width: trans.width,
            height: trans.height,
            angle: node.angle
        };
    }
    export function doNodesIntersect(node1: Node, node2: Node): boolean {
        return doRectsIntersect(node2rect(node1), node2rect(node2));
    }

    export function doRectsIntersect(rect1: Rect, rect2: Rect): boolean {
        console.log('doRectsIntersect',rect1,rect2);
        const vertices1 = getRectVertices(rect1);
        const vertices2 = getRectVertices(rect2);

        for (const [px, py] of vertices1) {
            if (isPointInRect(px, py, rect2)) {
                return true;
            }
        }

        for (const [px, py] of vertices2) {
            if (isPointInRect(px, py, rect1)) {
                return true;
            }
        }

        return false;
    }
}