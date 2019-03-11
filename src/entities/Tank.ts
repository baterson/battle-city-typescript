import { Movable } from './Movable';
import { BULLET_SIZE, DEATH_FRAMES, TILE_SIDE } from '../constants';
import { TimeManager, SoundManager, entityManager } from '../managers';
import { Direction, Vector, Tile } from '../types';

export class Tank extends Movable {
	public timeManager: TimeManager<'spawn' | 'death' | 'shotCD'>;
	public soundManager: SoundManager<'explode'>;

	constructor(position: Vector, size: Vector, direction: Direction) {
		super(position, size, direction);
	}

	shot(cd: number) {
		const shotCD = this.timeManager.getTimer('shotCD');
		if (shotCD) return;

		let bulletPosition;
		const { x: width, y: height } = BULLET_SIZE;
		if (this.direction === Direction.Top) {
			bulletPosition = { x: this.size.x / 2 + this.position.x - width / 2, y: this.position.y - height };
		} else if (this.direction === Direction.Right) {
			bulletPosition = { x: this.size.x + this.position.x, y: this.size.y / 2 + this.position.y - height / 2 };
		} else if (this.direction === Direction.Bottom) {
			bulletPosition = { x: this.size.x / 2 + this.position.x - width / 2, y: this.size.y + this.position.y };
		} else {
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

	forgiveCollision(tile: Tile): Vector | undefined {
		const [point1, point2] = this.getFrontCollisionPoints();
		const tilePos = tile.position;

		if (this.direction === Direction.Top || this.direction === Direction.Bottom) {
			const diffPoint = Math.min(Math.abs(tilePos.x - point1.x), Math.abs(tilePos.x - point2.x));
			if (diffPoint > 0 && diffPoint < 5) {
				const destination = this.position.x > tilePos.x ? tilePos.x + TILE_SIDE : tilePos.x - this.size.x;
				return { x: destination, y: this.prevPosition.y };
			}
		} else if (this.direction === Direction.Left || this.direction === Direction.Right) {
			const diffPoint = Math.min(Math.abs(tilePos.y - point1.y), Math.abs(tilePos.y - point2.y));
			if (diffPoint > 0 && diffPoint < 5) {
				const destination = this.position.y > tilePos.y ? tilePos.y + TILE_SIDE : tilePos.y - this.size.y;
				return { x: this.prevPosition.x, y: destination };
			}
		}
		return;
	}
}
