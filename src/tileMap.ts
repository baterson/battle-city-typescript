import { Tiles, Layers, RawTiles, Tile, Vector } from './types';
import { TILE_SIDE } from './constants';
import { assetsHolder } from './utils';

export const rigid = [Tiles.Brick1, Tiles.Brick2, Tiles.Brick3, Tiles.Brick4, Tiles.Steel, Tiles.Water];

export const bulletThrough = [Tiles.Grass, Tiles.Water, Tiles.None];

const layesrMap = {
	[Layers.under]: [Tiles.Ice, Tiles.Water],
	[Layers.main]: [Tiles.Brick1, Tiles.Brick2, Tiles.Brick3, Tiles.Brick4, Tiles.Steel],
	[Layers.over]: [Tiles.Grass],
};

export class TileMap {
	tiles: RawTiles;

	constructor(tiles: RawTiles) {
		this.tiles = tiles.map(row => [...row]);
	}

	destroy(point: Vector): void {
		const xIndex = Math.max(0, Math.floor(point.x / TILE_SIDE));
		const yIndex = Math.max(0, Math.floor(point.y / TILE_SIDE));
		this.tiles[yIndex][xIndex] = Tiles.None;
	}

	lookup(point: Vector): Tile {
		const xIndex = Math.min(Math.max(0, Math.floor(point.x / TILE_SIDE)), 29);
		const yIndex = Math.min(Math.max(0, Math.floor(point.y / TILE_SIDE)), 29);
		return { type: this.tiles[yIndex][xIndex], position: { x: xIndex * TILE_SIDE, y: yIndex * TILE_SIDE } };
	}

	lookupRange(point1: Vector, point2: Vector): Tile[] {
		let inBetweenPoints = [];
		const rangeX = Math.abs(point1.x - point2.x);
		const rangeY = Math.abs(point1.y - point2.y);

		if (rangeX > 0 && rangeX > TILE_SIDE) {
			// Checks tile in between tank edges
			inBetweenPoints.push({ x: point1.x + TILE_SIDE, y: point1.y });
		} else if (rangeY > 0 && rangeY > TILE_SIDE) {
			inBetweenPoints.push({ x: point1.x, y: point1.y + TILE_SIDE });
		}
		return [point1, ...inBetweenPoints, point2].map(point => this.lookup(point));
	}

	renderLayer(name: Layers): void {
		this.tiles.forEach((row, y) => {
			row.forEach((tile, x) => {
				if (!layesrMap[name].includes(tile)) return;
				assetsHolder.sprites.tiles[tile]({ x: x * TILE_SIDE, y: y * TILE_SIDE }, { x: TILE_SIDE, y: TILE_SIDE });
			});
		});
	}
}
