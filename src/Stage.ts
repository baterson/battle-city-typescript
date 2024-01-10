import { PowerupTypes, Layers } from './types';
import { POWERUP_SPAWN_CD, ENEMY_SPAWN_CD, ENEMY_SPAWN_POSITION } from './constants';
import { TimeManager, SoundManager, entityManager } from './managers';
import { randomInt } from './utils';
import { TileMap } from './TileMap';

/*
Represents a stage of the game with information on available enemies, power-ups, and map reference 
*/
export class Stage {
	number: number;
	map: TileMap;
	tanks: number[];
	powerupsAvailable: number;
	timeManager: TimeManager<'enemySpawnCD' | 'powerupSpawnCD'>;
	soundManager: SoundManager<'start'>;

	constructor(number: number, map: TileMap, tanks: number[]) {
		this.number = number;
		this.map = map;
		this.tanks = [...tanks];
		this.powerupsAvailable = 5;
		this.timeManager = new TimeManager();
		this.soundManager = new SoundManager(['start']);

		this.timeManager.setTimer('powerupSpawnCD', POWERUP_SPAWN_CD);
		this.soundManager.play('start');
		entityManager.spawnEntity('Flag');
	}

	update() {
		this.timeManager.decrementTimers();
		this.spawnEnemy();
		this.spawnPowerup();
	}

	isFinish() {
		const enemies = entityManager.getEnemies();
		return !this.tanks.length && !enemies.length;
	}

	spawnEnemy() {
		const enemySpawnCD = this.timeManager.getTimer('enemySpawnCD');
		const enemies = entityManager.getEnemies();
		if (!this.tanks.length || enemies.length > 4 || enemySpawnCD) return;

		const index = randomInt(2);
		this.timeManager.setTimer('enemySpawnCD', ENEMY_SPAWN_CD);
		entityManager.spawnEntity('Enemy', this.tanks.pop(), { ...ENEMY_SPAWN_POSITION[index] });
	}

	spawnPowerup() {
		const powerupSpawnCD = this.timeManager.getTimer('powerupSpawnCD');
		if (powerupSpawnCD || !this.powerupsAvailable) return;

		const index = randomInt(Object.keys(PowerupTypes).length / 2);
		entityManager.spawnEntity('Powerup', PowerupTypes[PowerupTypes[index]], {
			x: randomInt(500),
			y: randomInt(500),
		});
		this.timeManager.setTimer('powerupSpawnCD', POWERUP_SPAWN_CD);
		this.powerupsAvailable -= 1;
	}

	render() {
		this.map.renderLayer(Layers.under);
		this.map.renderLayer(Layers.main);
		entityManager.render();
		this.map.renderLayer(Layers.over);
	}

	get screenNum() {
		return this.number + 1;
	}
}
