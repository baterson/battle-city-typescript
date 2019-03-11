import { Entity } from './Entity';
import { DELTA_TIME } from '../constants';
import { TileMap } from '../TileMap';
import { Direction, Sprite, Vector, Tile } from '../types';

export class Movable extends Entity {
	direction: Direction;
	prevPosition: Vector;

	constructor(position: Vector, size: Vector, direction: Direction) {
		super(position, size);
		this.direction = direction;
		this.prevPosition = { ...position };
	}

	resolveEdgeCollision() {}

	resolveTileCollision(tiles: Tile[], tileMap: TileMap) {}

	resolveEntityCollision(other) {}

	move(velocity: number): void {
		this.prevPosition = { ...this.position };

		if (this.direction === Direction.Top) {
			this.position.y -= velocity * DELTA_TIME;
		} else if (this.direction === Direction.Bottom) {
			this.position.y += velocity * DELTA_TIME;
		} else if (this.direction === Direction.Left) {
			this.position.x -= velocity * DELTA_TIME;
		} else if (this.direction === Direction.Right) {
			this.position.x += velocity * DELTA_TIME;
		}
	}

	goBack(): void {
		this.position = { ...this.prevPosition };
	}

	animateMovement(sprites: Sprite[]): void {
		let distance;
		if (this.direction === Direction.Left || this.direction === Direction.Right) {
			distance = this.position.x;
		} else {
			distance = this.position.y;
		}
		const index = Math.floor(distance / 0.3) % sprites.length;
		sprites[index](this.position, this.size);
	}

	isOutOfScreen(): boolean {
		const box = this.getBoundingBox();
		return box.y1 < 0 || box.y2 > 600 || box.x1 < 0 || box.x2 > 600;
	}

	getFrontCollisionPoints(): Vector[] {
		const { x1, x2, y1, y2 } = this.getBoundingBox();
		if (this.direction === Direction.Top) {
			return [{ x: x1, y: y1 }, { x: x2, y: y1 }];
		} else if (this.direction === Direction.Right) {
			return [{ x: x2, y: y1 }, { x: x2, y: y2 }];
		} else if (this.direction === Direction.Bottom) {
			return [{ x: x1, y: y2 }, { x: x2, y: y2 }];
		} else if (this.direction === Direction.Left) {
			return [{ x: x1, y: y1 }, { x: x1, y: y2 }];
		}
	}
}
