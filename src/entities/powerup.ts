import { Entity } from './Entity';
import { PowerupTypes, Vector } from '../types';
import { POWERUP_SIZE, POWERUP_SPAWN_CD, POWERUP_BLINK_FRAMES } from '../constants';
import { SoundManager, entityManager, TimeManager } from '../managers';
import { assetsHolder } from '../utils';
import { isPlayer } from './guards';

export class PowerupEvents {
	public observers: { [key: number]: (eventType: PowerupTypes) => void } = {};

	subscribe(entityId: number, observer: (eventType: PowerupTypes) => void) {
		this.observers[entityId] = observer;
	}

	unsubscribe(entityId: number) {
		delete this.observers[entityId];
	}

	notify(eventType: PowerupTypes) {
		Object.values(this.observers).forEach((observer: any): any => observer(eventType));
	}
}

export const powerupEvents = new PowerupEvents();

export class Powerup extends Entity {
	public type: PowerupTypes;
	public soundManager: SoundManager<'powerup'>;
	public timeManager: TimeManager<'live' | 'blink'>;

	constructor(type: PowerupTypes, position: Vector) {
		super(position, { ...POWERUP_SIZE });
		this.type = type;
		this.timeManager = new TimeManager();
		this.soundManager = new SoundManager(['powerup']);
		this.timeManager.setTimer('live', POWERUP_SPAWN_CD);
	}

	update() {
		const livesLeft = this.timeManager.getTimer('live');

		if (livesLeft === 0) {
			entityManager.toRemove(this.id);
		} else if (livesLeft === POWERUP_BLINK_FRAMES) {
			this.timeManager.setTimer('blink', POWERUP_BLINK_FRAMES);
		}
		this.timeManager.decrementTimers();
	}

	render() {
		const blinkLeft = this.timeManager.getTimer('blink');
		if (blinkLeft && blinkLeft % 50 === 0) return;
		assetsHolder.sprites.powerup[this.type](this.position, this.size);
	}

	resolveEntityCollision(other) {
		if (isPlayer(other)) {
			entityManager.toRemove(this.id);
			powerupEvents.notify(this.type);
			this.soundManager.play('powerup');
		}
	}
}
