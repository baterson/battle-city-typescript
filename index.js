import sprite from '../assets/sprites.png';
import explode from '../assets/audio/explode.wav';
import hit from '../assets/audio/hit.wav';
import hitdmg from '../assets/audio/hitdmg.wav';
import neutral from '../assets/audio/neutral.wav';
import powerup from '../assets/audio/powerup.wav';
import move from '../assets/audio/move.wav';
import start from '../assets/audio/start.wav';
import gameover from '../assets/audio/gameover.wav';
import { assetsHolder } from './utils/assetsHolder';
import { keyboard } from './keyboard';
import { Game } from './Game';
async function main() {
    assetsHolder.runPreloader();
    await Promise.all([
        assetsHolder.loadSprite(sprite),
        assetsHolder.loadAudio({ explode, hit, hitdmg, neutral, powerup, move, start, gameover }),
    ]);
    assetsHolder.stopPreloader();
    const game = new Game();
    keyboard.listenToEvents(game);
    return game.createLoop();
}
main();
//# sourceMappingURL=index.js.map