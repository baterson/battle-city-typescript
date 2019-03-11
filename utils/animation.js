export function getAnimationIndex(animationLength, framesTotal, framesLeft) {
    const step = framesTotal / animationLength;
    return Math.floor(framesLeft / step);
}
export function animateVariableSprites(position, animation, framesTotal, framesLeft) {
    const index = Math.min(getAnimationIndex(animation.length, framesTotal, framesLeft), animation.length - 1);
    const { sprite, size } = animation[index];
    return sprite(position, size);
}
//# sourceMappingURL=animation.js.map