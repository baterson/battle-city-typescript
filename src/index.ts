import sprite from '../assets/sprites.png';
import explode from '../assets/audio/explode.flac';
import hit from '../assets/audio/hit.flac';
import hitdmg from '../assets/audio/hitdmg.flac';
import neutral from '../assets/audio/neutral.flac';
import powerup from '../assets/audio/powerup.flac';
import move from '../assets/audio/move.flac';
import start from '../assets/audio/start.flac';
import gameover from '../assets/audio/gameover.flac';
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
