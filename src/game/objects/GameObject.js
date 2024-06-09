import NotImplementedError from "../NotImplementedError";

export default class GameObject {
    _game;
    _asset;
    _x;
    _y;

    get game() { return this._game; }
    get asset() { return this._asset; }

    get x() { return this._x; };
    set x(value) { this._x = value; }

    get y() { return this._y; }
    set y(value) { this._y = value; }

    get isMovable() { throw new NotImplementedError(); }

    constructor(game, asset) {
        if (!game)
            throw new Error(`Cannot make game object with null "game"`);
        if (!asset)
            throw new Error(`Cannot make game object with null "asset"`);
        this._game = game;
        this._asset = asset;
        this._x = -1;
        this._y = -1;
    }

    nextTurn() {

    }
}