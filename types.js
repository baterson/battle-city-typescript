export var Direction;
(function (Direction) {
    Direction[Direction["Top"] = 0] = "Top";
    Direction[Direction["Bottom"] = 1] = "Bottom";
    Direction[Direction["Right"] = 2] = "Right";
    Direction[Direction["Left"] = 3] = "Left";
})(Direction || (Direction = {}));
export var TankTypes;
(function (TankTypes) {
    TankTypes[TankTypes["Default"] = 0] = "Default";
    TankTypes[TankTypes["Fast"] = 1] = "Fast";
    TankTypes[TankTypes["Armored"] = 2] = "Armored";
    TankTypes[TankTypes["Armored2"] = 3] = "Armored2";
    TankTypes[TankTypes["Armored3"] = 4] = "Armored3";
})(TankTypes || (TankTypes = {}));
export var PowerupTypes;
(function (PowerupTypes) {
    PowerupTypes[PowerupTypes["Helmet"] = 0] = "Helmet";
    PowerupTypes[PowerupTypes["Star"] = 1] = "Star";
    PowerupTypes[PowerupTypes["Stopwatch"] = 2] = "Stopwatch";
    PowerupTypes[PowerupTypes["Grenade"] = 3] = "Grenade";
    PowerupTypes[PowerupTypes["Tank"] = 4] = "Tank";
})(PowerupTypes || (PowerupTypes = {}));
export var PlayerPower;
(function (PlayerPower) {
    PlayerPower[PlayerPower["Default"] = 0] = "Default";
    PlayerPower[PlayerPower["First"] = 1] = "First";
    PlayerPower[PlayerPower["Second"] = 2] = "Second";
})(PlayerPower || (PlayerPower = {}));
export var Tiles;
(function (Tiles) {
    Tiles[Tiles["None"] = 0] = "None";
    Tiles[Tiles["Brick1"] = 1] = "Brick1";
    Tiles[Tiles["Brick2"] = 2] = "Brick2";
    Tiles[Tiles["Brick3"] = 3] = "Brick3";
    Tiles[Tiles["Brick4"] = 4] = "Brick4";
    Tiles[Tiles["Steel"] = 5] = "Steel";
    Tiles[Tiles["Ice"] = 6] = "Ice";
    Tiles[Tiles["Grass"] = 7] = "Grass";
    Tiles[Tiles["Water"] = 8] = "Water";
})(Tiles || (Tiles = {}));
export var Layers;
(function (Layers) {
    Layers[Layers["under"] = 0] = "under";
    Layers[Layers["main"] = 1] = "main";
    Layers[Layers["over"] = 2] = "over";
})(Layers || (Layers = {}));
export var ControlKeys;
(function (ControlKeys) {
    ControlKeys["ArrowUp"] = "ArrowUp";
    ControlKeys["ArrowRight"] = "ArrowRight";
    ControlKeys["ArrowDown"] = "ArrowDown";
    ControlKeys["ArrowLeft"] = "ArrowLeft";
    ControlKeys["Space"] = "Space";
})(ControlKeys || (ControlKeys = {}));
//# sourceMappingURL=types.js.map