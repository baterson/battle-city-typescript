import { Movable } from './Movable';
import { Tiles, PlayerPower } from '../types';
import { BULLET_VELOCITY, BULLET_SIZE } from '../constants';
import { SoundManager, entityManager } from '../managers/';
import { bulletThrough } from '../TileMap';
import { isPlayer, isEnemy, isPowerup } from './guards';
import { assetsHolder } from '../utils';
export class Bullet extends Movable {
    constructor(position, direction, shooter) {
        super(position, Object.assign({}, BULLET_SIZE), direction);
        this.direction = direction;
        this.shooter = shooter;
        this.soundManager = new SoundManager(['hit', 'hitdmg']);
    }
    update() {
        this.move(BULLET_VELOCITY);
    }
    render() {
        this.animateMovement(assetsHolder.sprites.bullet[this.direction]);
    }
    resolveEdgeCollision() {
        entityManager.toRemove(this.id);
    }
    resolveTileCollision(tiles, tileMap) {
        if (tiles.every(tile => bulletThrough.includes(tile.type)))
            return;
        entityManager.toRemove(this.id);
        const canDestroySteel = isPlayer(this.shooter) && this.shooter.power === PlayerPower.Second;
        const hasSteel = tiles.some(tile => tile.type === Tiles.Steel);
        if (hasSteel) {
            this.soundManager.play('hit');
        }
        else {
            this.soundManager.play('hitdmg');
        }
        tiles.forEach(tile => {
            if (bulletThrough.includes(tile.type) || (tile.type === Tiles.Steel && !canDestroySteel))
                return;
            tileMap.destroy(tile.position);
        });
    }
    resolveEntityCollision(other) {
        if (isPowerup(other))
            return;
        if (isPlayer(this.shooter) && isEnemy(other) && other.type >= 1) {
            this.soundManager.play('hit');
        }
        entityManager.toRemove(this.id);
    }
}
//# sourceMappingURL=Bullet.js.map