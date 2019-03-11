export class TimeManager<T extends string = any> {
	timers: { [key in T]?: number } = {};

	setTimer(timerName: T, frameLength) {
		this.timers[timerName] = frameLength;
	}

	getTimer(timerName: T) {
		return this.timers[timerName];
	}

	some(timers: T[]) {
		return Object.entries(this.timers).some(entry => timers.includes(entry[0] as T) && entry[1] >= 0);
	}

	decrementTimers() {
		const toRemove = Object.entries(this.timers).filter(entry => entry[1] === 0);
		if (toRemove.length) {
			toRemove.forEach(entry => {
				delete this.timers[entry[0]];
			});
		}

		Object.keys(this.timers).forEach(key => {
			this.timers[key] -= 1;
		});
	}
}
