import { ControlKeys } from './types';
import { Game } from './Game';

export class Keyboard {
	queue: Set<ControlKeys>;

	constructor() {
		this.queue = new Set();
	}

	handleEvent(event: KeyboardEvent, game: Game) {
		const { code, type } = event;
		if (game.isWaitingForRestart()) {
			return game.restart();
		}
		if (game.isStartScreen) {
			return game.play();
		}
		if (!ControlKeys[code]) return;

		if (type === 'keydown') {
			this.queue.add(ControlKeys[code]);
		} else {
			this.queue.delete(ControlKeys[code]);
		}
	}

	getKey() {
		return Array.from(this.queue).pop();
	}

	listenToEvents(game: Game) {
		['keydown', 'keyup'].forEach(eventName => {
			window.addEventListener(eventName, (event: KeyboardEvent) => {
				this.handleEvent(event, game);
			});
		});
	}
}

export const keyboard = new Keyboard();
