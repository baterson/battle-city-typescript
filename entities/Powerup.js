import { Entity } from './Entity';
import { POWERUP_SIZE, POWERUP_SPAWN_CD, POWERUP_BLINK_FRAMES } from '../constants';
import { SoundManager, entityManager, TimeManager } from '../managers';
import { assetsHolder } from '../utils';
import { isPlayer } from './guards';
export class PowerupEvents {
    constructor() {
        this.observers = {};
    }
    subscribe(entityId, observer) {
        this.observers[entityId] = observer;
    }
    unsubscribe(entityId) {
        delete this.observers[entityId];
    }
    notify(eventType) {
        Object.values(this.observers).forEach((observer) => observer(eventType));
    }
}
export const powerupEvents = new PowerupEvents();
export class Powerup extends Entity {
    constructor(type, position) {
        super(position, Object.assign({}, POWERUP_SIZE));
        this.type = type;
        this.timeManager = new TimeManager();
        this.soundManager = new SoundManager(['powerup']);
        this.timeManager.setTimer('live', POWERUP_SPAWN_CD);
    }
    update() {
        const livesLeft = this.timeManager.getTimer('live');
        if (livesLeft === 0) {
            entityManager.toRemove(this.id);
        }
        else if (livesLeft === POWERUP_BLINK_FRAMES) {
            this.timeManager.setTimer('blink', POWERUP_BLINK_FRAMES);
        }
        this.timeManager.decrementTimers();
    }
    render() {
        const blinkLeft = this.timeManager.getTimer('blink');
        if (blinkLeft && blinkLeft % 50 === 0)
            return;
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
//# sourceMappingURL=Powerup.js.map