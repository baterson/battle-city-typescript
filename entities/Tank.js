import { Movable } from './Movable';
import { BULLET_SIZE, DEATH_FRAMES, TILE_SIDE } from '../constants';
import { entityManager } from '../managers';
import { Direction } from '../types';
export class Tank extends Movable {
    constructor(position, size, direction) {
        super(position, size, direction);
    }
    shot(cd) {
        const shotCD = this.timeManager.getTimer('shotCD');
        if (shotCD)
            return;
        let bulletPosition;
        const { x: width, y: height } = BULLET_SIZE;
        if (this.direction === Direction.Top) {
            bulletPosition = { x: this.size.x / 2 + this.position.x - width / 2, y: this.position.y - height };
        }
        else if (this.direction === Direction.Right) {
            bulletPosition = { x: this.size.x + this.position.x, y: this.size.y / 2 + this.position.y - height / 2 };
        }
        else if (this.direction === Direction.Bottom) {
            bulletPosition = { x: this.size.x / 2 + this.position.x - width / 2, y: this.size.y + this.position.y };
        }
        else {
            bulletPosition = { x: this.position.x - width, y: this.size.y / 2 + this.position.y - height / 2 };
        }
        entityManager.spawnEntity('Bullet', bulletPosition, this.direction, this);
        this.timeManager.setTimer('shotCD', cd);
    }
    die() {
        this.timeManager.setTimer('death', DEATH_FRAMES);
        this.soundManager.play('explode');
        entityManager.toRemove(this.id);
    }
    forgiveCollision(tile) {
        const [point1, point2] = this.getFrontCollisionPoints();
        const tilePos = tile.position;
        let diff, destination = { x: this.prevPosition.x, y: this.prevPosition.y };
        if (this.direction === Direction.Top || this.direction === Direction.Bottom) {
            if (tilePos.x > point1.x) {
                diff = tilePos.x - point2.x;
                destination.x = tilePos.x - this.size.x;
            }
            else {
                diff = tilePos.x + TILE_SIDE - point1.x;
                destination.x = tilePos.x + TILE_SIDE;
            }
        }
        else if (this.direction === Direction.Left || this.direction === Direction.Right) {
            if (tilePos.y > point1.y) {
                diff = tilePos.y - point2.y;
                destination.y = tilePos.y - this.size.y;
            }
            else {
                diff = tilePos.y + TILE_SIDE - point1.y;
                destination.y = tilePos.y + TILE_SIDE;
            }
        }
        if (Math.abs(diff) < 5) {
            return destination;
        }
        return;
    }
}
//# sourceMappingURL=Tank.js.map