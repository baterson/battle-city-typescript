export class Entity {
    constructor(position, size) {
        this.id = Entity.numberGen;
        this.position = position;
        this.size = size;
        Entity.numberGen += 1;
    }
    update() { }
    render() { }
    resolveEntityCollision(other) { }
    getBoundingBox() {
        const { x, y } = this.position;
        const { x: width, y: height } = this.size;
        return {
            x1: x,
            x2: x + width,
            y1: y,
            y2: y + height,
        };
    }
    deconstruct() { }
}
Entity.numberGen = 0;
//# sourceMappingURL=Entity.js.map