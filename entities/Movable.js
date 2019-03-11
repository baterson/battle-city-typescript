import { Entity } from './Entity';
import { DELTA_TIME } from '../constants';
import { Direction } from '../types';
export class Movable extends Entity {
    constructor(position, size, direction) {
        super(position, size);
        this.direction = direction;
        this.prevPosition = Object.assign({}, position);
    }
    resolveEdgeCollision() { }
    resolveTileCollision(tiles, tileMap) { }
    resolveEntityCollision(other) { }
    move(velocity) {
        this.prevPosition = Object.assign({}, this.position);
        if (this.direction === Direction.Top) {
            this.position.y -= velocity * DELTA_TIME;
        }
        else if (this.direction === Direction.Bottom) {
            this.position.y += velocity * DELTA_TIME;
        }
        else if (this.direction === Direction.Left) {
            this.position.x -= velocity * DELTA_TIME;
        }
        else if (this.direction === Direction.Right) {
            this.position.x += velocity * DELTA_TIME;
        }
    }
    goBack() {
        this.position = Object.assign({}, this.prevPosition);
    }
    animateMovement(sprites) {
        let distance;
        if (this.direction === Direction.Left || this.direction === Direction.Right) {
            distance = this.position.x;
        }
        else {
            distance = this.position.y;
        }
        const index = Math.floor(distance / 0.3) % sprites.length;
        sprites[index](this.position, this.size);
    }
    isOutOfScreen() {
        const box = this.getBoundingBox();
        return box.y1 < 0 || box.y2 > 600 || box.x1 < 0 || box.x2 > 600;
    }
    getFrontCollisionPoints() {
        const { x1, x2, y1, y2 } = this.getBoundingBox();
        if (this.direction === Direction.Top) {
            return [{ x: x1, y: y1 }, { x: x2, y: y1 }];
        }
        else if (this.direction === Direction.Right) {
            return [{ x: x2, y: y1 }, { x: x2, y: y2 }];
        }
        else if (this.direction === Direction.Bottom) {
            return [{ x: x1, y: y2 }, { x: x2, y: y2 }];
        }
        else if (this.direction === Direction.Left) {
            return [{ x: x1, y: y1 }, { x: x1, y: y2 }];
        }
    }
}
//# sourceMappingURL=Movable.js.map