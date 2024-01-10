import { Tank } from './Tank';
import { assetsHolder, animateVariableSprites, checkEntityCollision } from '../utils';
import { Direction, PowerupTypes, TankTypes, Vector, Tile } from '../types';
import { TANK_SIZE, SPAWN_FRAMES, DEATH_FRAMES, FREEZE_FRAMES, ENEMY_STATS } from '../constants';
import { SoundManager, TimeManager, entityManager } from '../managers';
import { powerupEvents } from './Powerup';
import { isPlayer, isEnemy, isBullet, isPowerup } from './guards';

function powerupObserver(this: Enemy, powerupType) {
	if (powerupType === PowerupTypes.Stopwatch) {
		this.timeManager.setTimer('freeze', FREEZE_FRAMES);
	} else if (powerupType === PowerupTypes.Grenade) {
		if (!this.timeManager.some(['death', 'spawn'])) this.die();
	}
}

/*
Class describing all enemy tanks 
*/
export class Enemy extends Tank {
	type: TankTypes;
	lives: number;
	// sets when entity changes the direction
	prevTile: Vector;
	timeManager: TimeManager<'spawn' | 'death' | 'freeze' | 'shotCD'>;
	soundManager: SoundManager<'explode'>;

	constructor(type: TankTypes, position: Vector) {
		super(position, { ...TANK_SIZE }, Direction.Bottom);
		this.type = type;
		this.lives = ENEMY_STATS[type].lives;
		this.prevTile = { ...position };
		this.timeManager = new TimeManager();
		this.soundManager = new SoundManager(['explode']);

		this.timeManager.setTimer('spawn', SPAWN_FRAMES);
		powerupEvents.subscribe(this.id, powerupObserver.bind(this));
	}

	update() {
		const spawn = this.timeManager.getTimer('spawn');
		const death = this.timeManager.getTimer('death');
		const freeze = this.timeManager.getTimer('freeze');
		this.timeManager.decrementTimers();

		if (spawn) {
			const isIntersecting = this.isSpawnSpotClear();
			if (isIntersecting) {
				this.timeManager.setTimer('spawn', SPAWN_FRAMES);
				return;
			}
		} else if (death || freeze) {
			return;
		} else {
			this.aiMove();
			this.shot(ENEMY_STATS[this.type].shotCD);
		}
	}

	render() {
		const spawn = this.timeManager.getTimer('spawn');
		const death = this.timeManager.getTimer('death');

		if (spawn) {
			return animateVariableSprites(this.position, assetsHolder.variableSprites.tankSpawn, SPAWN_FRAMES, spawn);
		} else if (death) {
			return animateVariableSprites(
				this.position,
				assetsHolder.variableSprites.tankDestruction,
				DEATH_FRAMES,
				death
			);
		}

		if (this.type === TankTypes.Armored) {
			this.animateMovement(assetsHolder.sprites.enemy[this.type][this.lives][this.direction]);
		} else {
			this.animateMovement(assetsHolder.sprites.enemy[this.type][this.direction]);
		}
	}

	/*
	Entity changes direction randomly after moving some distance along the x or y coordinates 
	*/
	aiMove() {
		const { velocity } = ENEMY_STATS[this.type];
		if (
			Math.abs(Math.floor(this.prevTile.x - this.position.x)) > 120 ||
			Math.abs(Math.floor(this.prevTile.y - this.position.y)) > 120
		) {
			this.prevTile = { ...this.position };
			this.setRandomDirection();
			this.move(velocity);
		} else {
			this.move(velocity);
		}
	}

	resolveEdgeCollision() {
		this.goBack();
		this.setRandomDirection();
	}

	resolveTileCollision(tiles: Tile[]) {
		if (tiles.length === 1) {
			const newPos = this.forgiveCollision(tiles[0]);
			if (newPos) {
				this.position = { ...newPos };
			} else {
				this.setRandomDirection();
				this.goBack();
			}
		} else {
			this.setRandomDirection();
			this.goBack();
		}
	}

	resolveEntityCollision(other) {
		if (isPowerup(other)) {
			return;
		} else if (isBullet(other) && isPlayer(other.shooter)) {
			if (this.lives === 1) {
				this.die();
			} else {
				this.lives -= 1;
			}
		} else if (isEnemy(other)) {
			this.goBack();
			this.setOpositeDirection();
		} else if (isPlayer(other)) {
			if (this.timeManager.getTimer('shotCD') > 10) this.setOpositeDirection();
			this.goBack();
		}
	}

	setRandomDirection() {
		const items = [Direction.Top, Direction.Right, Direction.Bottom, Direction.Left].filter(
			direction => direction !== this.direction
		);
		const index = Math.floor(Math.random() * items.length);
		this.direction = items[index];
	}

	setOpositeDirection() {
		if (this.direction === Direction.Top) {
			this.direction = Direction.Bottom;
		} else if (this.direction === Direction.Bottom) {
			this.direction = Direction.Top;
		} else if (this.direction === Direction.Right) {
			this.direction = Direction.Left;
		} else {
			this.direction = Direction.Right;
		}
	}

	/*
	Checks the position before spawning. If the spot is taken then restarts spawn timer
	*/
	isSpawnSpotClear() {
		return entityManager.entities
			.filter(entity => entity.id !== this.id && !isBullet(entity))
			.filter(entity => {
				if (isEnemy(entity)) {
					return !entity.timeManager.getTimer('spawn');
				}
				return true;
			})
			.some(entity => checkEntityCollision(entity.getBoundingBox(), this.getBoundingBox()));
	}

	deconstruct() {
		powerupEvents.unsubscribe(this.id);
	}
}
