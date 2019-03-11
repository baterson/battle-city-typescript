export class TimeManager {
    constructor() {
        this.timers = {};
    }
    setTimer(timerName, frameLength) {
        this.timers[timerName] = frameLength;
    }
    getTimer(timerName) {
        return this.timers[timerName];
    }
    some(timers) {
        return Object.entries(this.timers).some(entry => timers.includes(entry[0]) && entry[1] >= 0);
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
//# sourceMappingURL=TimeManager.js.map