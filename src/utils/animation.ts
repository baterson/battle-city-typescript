import { Vector, VariableSprite } from '../types';

export function getAnimationIndex(animationLength: number, framesTotal: number, framesLeft: number) {
	const step = framesTotal / animationLength;
	return Math.floor(framesLeft / step);
}

export function animateVariableSprites(
	position: Vector,
	animation: VariableSprite[],
	framesTotal: number,
	framesLeft: number
) {
	const index = Math.min(getAnimationIndex(animation.length, framesTotal, framesLeft), animation.length - 1);
	const { sprite, size } = animation[index];
	return sprite(position, size);
}
