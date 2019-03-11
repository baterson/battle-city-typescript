import { assetsHolder } from '../utils';
export class SoundManager {
    constructor(trackNames) {
        this.setupTracks(trackNames);
    }
    setupTracks(trackNames) {
        this.tracks = trackNames.reduce((acc, track) => {
            if (typeof track === 'string') {
                acc[track] = assetsHolder.audio[track].cloneNode();
            }
            else {
                const { trackName, loop } = track;
                acc[trackName] = assetsHolder.audio[trackName].cloneNode();
                acc[trackName].loop = loop;
            }
            return acc;
        }, {});
    }
    play(trackName) {
        return this.tracks[trackName].play();
    }
    pause(trackName) {
        return this.tracks[trackName].pause();
    }
    pauseAll() {
        Object.values(this.tracks).forEach(track => track.pause());
    }
}
//# sourceMappingURL=SoundManager.js.map