import { getAnimationIndex } from '../utils';
import { SCREEN_FADE_FRAMES } from '../constants';
import { assetsHolder } from '../utils';

const canvas = <HTMLCanvasElement>document.getElementById('root');
const context = canvas.getContext('2d');
context.font = '30px Arial';
context.textAlign = 'center';

export const getAnimIndex = (animationLength: number, framesLeft: number, spritesLength: number) => {
	const step = animationLength / spritesLength;
	return Math.floor(framesLeft / step);
};

export const main = {
	canvas,
	context,
	clearScreen() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.beginPath();
	},

	renderChaingingStage(left: number) {
		const index = getAnimationIndex(SCREEN_FADE_FRAMES, SCREEN_FADE_FRAMES, left);
		context.fillRect(0, 0, 600, index);
		context.fillRect(0, 600 - index, 600, index);
	},

	renderGameOver(left = 0) {
		const index = getAnimationIndex(SCREEN_FADE_FRAMES, SCREEN_FADE_FRAMES, left);
		context.fillRect(0, 0, 600, 300 - index);
		context.fillRect(0, 300 + index, 600, 300 - index);
		if (!left) {
			assetsHolder.sprites.gameOver({ x: 275, y: 275 }, { x: 50, y: 50 });
		}
	},

	renderStartScreen() {
		assetsHolder.sprites.logo({ x: 100, y: 200 }, { x: 400, y: 200 });
		context.strokeText('Press any key', 300, 500);
	},
};
