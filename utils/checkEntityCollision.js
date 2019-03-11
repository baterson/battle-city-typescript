function checkEntityCollision(box1, box2) {
    return box1.x1 < box2.x2 && box1.x2 > box2.x1 && box1.y1 < box2.y2 && box1.y2 > box2.y1;
}
export { checkEntityCollision };
//# sourceMappingURL=checkEntityCollision.js.map