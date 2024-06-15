export default class Damage {
    _asset;
    _x;
    _y;

    firstDrawTime;

    get asset() { return this._asset; }
    get x() { return this._x; }
    get y() { return this._y; }

    constructor(game, amount, x, y) {
        const asset = game.assets.images.damage[amount];
        if (!asset)
            throw new Error(`No asset found for damage ${amount}`);
        this._asset = asset;
        this._x = x;
        this._y = y;
    }
}