import * as entities from './entities';

export enum Direction {
	Top,
	Bottom,
	Right,
	Left,
}

export enum TankTypes {
	Default,
	Fast,
	Armored,
	Armored2,
	Armored3,
}

export enum PowerupTypes {
	Helmet,
	Star,
	Stopwatch,
	Grenade,
	Tank,
}

export enum PlayerPower {
	Default,
	First,
	Second,
}

export enum Tiles {
	None,
	Brick1,
	Brick2,
	Brick3,
	Brick4,
	Steel,
	Ice,
	Grass,
	Water,
}

export enum Layers {
	under,
	main,
	over,
}

export enum ControlKeys {
	ArrowUp = 'ArrowUp',
	ArrowRight = 'ArrowRight',
	ArrowDown = 'ArrowDown',
	ArrowLeft = 'ArrowLeft',
	Space = 'Space',
}

export type Entities =
	| entities.Tank
	| entities.Player
	| entities.Enemy
	| entities.Bullet
	| entities.Flag
	| entities.Powerup;

export type Vector = { x: number; y: number };

export type PlayerStats = { [key in PlayerPower]: { velocity: number; shotCD: number } };

export type EnemyStats = { [key in TankTypes]: { velocity: number; shotCD: number; lives: number } };

export interface BoundingBox {
	x1: number;
	x2: number;
	y1: number;
	y2: number;
}

// Assets
export type Sprite = (position: Vector | { x: number; y: number }, size: Vector | { x: number; y: number }) => void;
export type VariableSprite = { sprite: Sprite; size: Vector };
type DirectionSprites = { [key in Direction]: Sprite[] };

export interface Sprites {
	player: {
		[PlayerPower.Default]: DirectionSprites;
		[PlayerPower.First]: DirectionSprites;
		[PlayerPower.Second]: DirectionSprites;
	};
	enemy: {
		[TankTypes.Default]: DirectionSprites;
		[TankTypes.Fast]: DirectionSprites;
		[TankTypes.Armored]: {
			'1': DirectionSprites;
			'2': DirectionSprites;
			'3': DirectionSprites;
		};
	};
	bullet: DirectionSprites;
	flag: Sprite;
	flagDeath: Sprite;
	tankIcon: Sprite;
	flagIcon: Sprite;
	playerIcon: Sprite;
	numberIcons: Sprite[];
	logo: Sprite;
	tiles: Partial<{ [key in Tiles]: Sprite }>;
	gameOver: Sprite;
	powerup: { [key in PowerupTypes]: Sprite };
	invincible: Sprite[];
}

export interface VariableSprites {
	tankDestruction: VariableSprite[];
	tankSpawn: VariableSprite[];
}

export type TrackNames = 'explode' | 'hit' | 'hitdmg' | 'neutral' | 'powerup' | 'move' | 'start' | 'gameover';

export type Audio = { [key in TrackNames]: HTMLAudioElement };

// Map
export type RawTiles = number[][];
export type Tile = { type: Tiles; position: Vector };
