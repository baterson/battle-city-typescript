import { assetsHolder } from '../utils';
import { TrackNames } from '../types';

export class SoundManager<T extends TrackNames> {
	tracks: { [key in T]?: HTMLAudioElement };

	constructor(trackNames: (string | { trackName: string; loop: boolean })[]) {
		this.setupTracks(trackNames);
	}

	setupTracks(trackNames: (string | { trackName: string; loop: boolean })[]) {
		this.tracks = trackNames.reduce((acc, track) => {
			if (typeof track === 'string') {
				acc[track] = new Audio(assetsHolder.audio[track]);
			} else {
				const { trackName, loop } = track;
				acc[trackName] = new Audio(assetsHolder.audio[trackName]);
				acc[trackName].loop = loop;
			}
			return acc;
		}, {});
	}

	play(trackName: T) {
		return this.tracks[trackName].play();
	}

	pause(trackName: T) {
		return this.tracks[trackName].pause();
	}

	pauseAll() {
		Object.values<HTMLAudioElement>(this.tracks).forEach(track => track.pause());
	}
}
