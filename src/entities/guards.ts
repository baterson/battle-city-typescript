import { Entities } from '../types';
import { Player, Enemy, Powerup, Flag, Tank, Movable, Bullet } from './';

export function isTank(entity: Entities): entity is Tank {
	return entity instanceof Tank;
}

export function isPlayer(entity: Entities): entity is Player {
	return entity instanceof Player;
}

export function isEnemy(entity: Entities): entity is Enemy {
	return entity instanceof Enemy;
}

export function isBullet(entity: Entities): entity is Bullet {
	return entity instanceof Bullet;
}

export function isFlag(entity: Entities): entity is Flag {
	return entity instanceof Flag;
}

export function isPowerup(entity: Entities): entity is Powerup {
	return entity instanceof Powerup;
}
