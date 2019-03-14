import { maps, tanks as tanksConfig } from './stageConfig';
import { DELTA_TIME, SCREEN_FADE_FRAMES } from './constants';
import { TileMap } from './TileMap';
import { Stage } from './Stage';
import { main as mainScreen, dashboard } from './screens';
import { TimeManager, SoundManager, entityManager } from './managers';

export class Game {
	isStartScreen: boolean;
	isLost: boolean;
	stage: Stage;
	timeManager: TimeManager<'screenFade'>;
	soundManager: SoundManager<'gameover'>;

	constructor() {
		this.isStartScreen = true;
		this.isLost = false;
		this.timeManager = new TimeManager();
		this.soundManager = new SoundManager(['gameover']);
	}

	createLoop() {
		let accumulatedTime = 0;
		let lastTime = 0;

		const loop = time => {
			accumulatedTime += (time - lastTime) / 1000;
			while (accumulatedTime > DELTA_TIME) {
				this.update();
				accumulatedTime -= DELTA_TIME;
			}
			this.render();
			lastTime = time;
			requestAnimationFrame(loop);
		};
		loop(0);
	}

	update() {
		this.timeManager.decrementTimers();
		const sreenFadeLeft = this.timeManager.getTimer('screenFade');
		if (this.isLost || this.isStartScreen || sreenFadeLeft) return;

		this.stage.update();
		entityManager.update();
		entityManager.checkCollisions(this.stage.map);
		entityManager.removeFromQueue();

		const player = entityManager.getPlayer();
		const flag = entityManager.getFlag();
		if (!player || flag.isDestroyed) {
			entityManager.clear();
			return this.gameOver();
		}
		if (this.stage.isFinish()) {
			this.toNextStage();
		}
	}

	render() {
		mainScreen.clearScreen();
		dashboard.clearScreen();

		if (this.isStartScreen) {
			mainScreen.renderStartScreen();
		} else {
			this.renderGame();
		}
	}

	renderGame() {
		const sreenFadeLeft = this.timeManager.getTimer('screenFade');
		this.stage.render();

		if (this.isLost) {
			mainScreen.renderGameOver(sreenFadeLeft);
		} else if (sreenFadeLeft) {
			mainScreen.renderChaingingStage(sreenFadeLeft);
		} else {
			const player: any = entityManager.getPlayer();
			dashboard.render(player.lives, this.stage.screenNum, this.stage.tanks);
		}
	}

	gameOver() {
		this.soundManager.play('gameover');
		this.timeManager.setTimer('screenFade', SCREEN_FADE_FRAMES);
		this.isLost = true;
	}

	isWaitingForRestart() {
		const gameOverTime = this.timeManager.getTimer('screenFade');
		return !gameOverTime && this.isLost;
	}

	getNextStageNum() {
		let newNum = this.stage.number + 1;
		if (newNum > maps.length - 1) {
			newNum = 0;
		}
		return newNum;
	}

	toNextStage() {
		this.timeManager.setTimer('screenFade', SCREEN_FADE_FRAMES);
		entityManager.clear(false);
		const stageNum = this.getNextStageNum();
		const player: any = entityManager.getPlayer();
		this.stage = new Stage(stageNum, new TileMap(maps[stageNum]), tanksConfig[stageNum]);
		player.respawn();
	}

	play() {
		this.isStartScreen = false;
		entityManager.spawnEntity('Player');
		this.timeManager.setTimer('screenFade', SCREEN_FADE_FRAMES);
		this.stage = new Stage(0, new TileMap(maps[0]), tanksConfig[0]);
	}

	restart() {
		this.isLost = false;
		entityManager.clear();
		this.play();
	}
}
