import { Entity } from './Entity';
import { assetsHolder } from '../utils';
import { FLAG_SIZE, FLAG_POSITION } from '../constants';
import { isBullet } from './guards';

export class Flag extends Entity {
	isDestroyed = false;

	constructor() {
		super(FLAG_POSITION, FLAG_SIZE);
	}

	render() {
		if (this.isDestroyed) {
			assetsHolder.sprites.flagDeath(this.position, this.size);
		} else {
			assetsHolder.sprites.flag(this.position, this.size);
		}
	}

	resolveEntityCollision(other) {
		if (isBullet(other)) {
			this.isDestroyed = true;
		}
	}
}
