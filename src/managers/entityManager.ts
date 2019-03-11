import * as entities from '../entities';
import { Enemy, Player, Flag, Movable } from '../entities';
import { Entities, Direction, TankTypes, PowerupTypes, Vector } from '../types';
import { checkEntityCollision } from '../utils';
import { TileMap, rigid } from '../TileMap';
import { isPlayer, isEnemy, isTank, isFlag, isPowerup } from '../entities/guards';
import { TILE_SIDE } from '../constants';

export class EntityManager {
	pool: { [key: number]: Entities };
	toRemoveQueue: Set<number>;

	constructor() {
		this.pool = {};
		this.toRemoveQueue = new Set();
	}

	spawnEntity(type: 'Player');
	spawnEntity(type: 'Flag');
	spawnEntity(type: 'Enemy', tankType: TankTypes, position: Vector);
	spawnEntity(type: 'Powerup', powerupType: PowerupTypes, position: Vector);
	spawnEntity(type: 'Bullet', position: Vector, direction: Direction, shooter: entities.Tank);
	spawnEntity(type, ...args) {
		const entity = new entities[type](...args);
		this.pool[entity.id] = entity;
	}

	toRemove = (id: number) => {
		this.toRemoveQueue.add(id);
	};

	removeFromQueue = () => {
		this.toRemoveQueue.forEach(entityId => {
			const entity = this.pool[entityId];
			const deathLeft = this._checkDeath(entity);
			if (!deathLeft) {
				delete this.pool[entityId];
				entity.deconstruct();
				this.toRemoveQueue.delete(entityId);
			}
		});
	};

	getEnemies(): Enemy[] {
		return this.entities.filter(isEnemy);
	}

	getPlayer(): Player {
		return this.entities.find(isPlayer);
	}

	getFlag(): Flag {
		return this.entities.find(isFlag);
	}

	render() {
		this.entities.forEach(entity => entity.render());
	}

	update() {
		this.entities.forEach(entity => entity.update());
	}

	checkCollisions(tileMap: TileMap) {
		const seen = new Set();
		this.entities.forEach(entity => {
			if (isPowerup(entity) || isFlag(entity)) return;

			this.checkTileCollision(entity as entities.Movable, tileMap);
			this.checkEntitiesCollision(entity, seen);
			seen.add(entity.id);
		});
	}

	checkTileCollision(entity: Movable, tileMap: TileMap) {
		if (entity.isOutOfScreen()) {
			entity.resolveEdgeCollision();
		} else {
			const [first, second] = entity.getFrontCollisionPoints();
			const tiles = tileMap.lookupRange(first, second);
			const collidable = tiles
				.filter(tile => rigid.includes(tile.type))
				.filter(tile =>
					checkEntityCollision(entity.getBoundingBox(), {
						x1: tile.position.x,
						x2: tile.position.x + TILE_SIDE,
						y1: tile.position.y,
						y2: tile.position.y + TILE_SIDE,
					})
				);

			if (collidable.length) {
				entity.resolveTileCollision(collidable, tileMap);
			}
		}
	}

	checkEntitiesCollision(entity: Entities, seen: Set<number>) {
		this.entities.forEach(other => {
			if (entity.id === other.id || seen.has(other.id)) return;

			if (this._isInteractive(other) && checkEntityCollision(entity.getBoundingBox(), other.getBoundingBox())) {
				entity.resolveEntityCollision(other);
				other.resolveEntityCollision(entity);
			}
		});
	}

	clear(clearPlayer = true) {
		if (!clearPlayer) {
			const player = this.getPlayer();
			Object.values(this.pool)
				.filter(entity => entity.id !== player.id)
				.forEach(entity => entity.deconstruct());
			this.pool = { [player.id]: player };
		} else {
			Object.values(this.pool).forEach(entity => entity.deconstruct());
			this.pool = {};
		}
		this.toRemoveQueue = new Set();
	}

	_isInteractive(entity: Entities) {
		if (isTank(entity)) {
			return !entity.timeManager.some(['spawn', 'death']);
		}
		return true;
	}

	_checkDeath(entity: Entities) {
		if (isTank(entity)) {
			return entity.timeManager.getTimer('death');
		}
	}

	get entities(): Entities[] {
		return Object.values<Entities>(this.pool);
	}
}

export const entityManager = new EntityManager();
