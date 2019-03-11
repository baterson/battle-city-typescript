import { Player, Enemy, Powerup, Flag, Tank, Bullet } from './';
export function isTank(entity) {
    return entity instanceof Tank;
}
export function isPlayer(entity) {
    return entity instanceof Player;
}
export function isEnemy(entity) {
    return entity instanceof Enemy;
}
export function isBullet(entity) {
    return entity instanceof Bullet;
}
export function isFlag(entity) {
    return entity instanceof Flag;
}
export function isPowerup(entity) {
    return entity instanceof Powerup;
}
//# sourceMappingURL=guards.js.map