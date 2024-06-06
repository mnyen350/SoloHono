export default class GameObject
{
    _asset;
    _x;
    _y;

    get asset() { return this._asset; }
    
    get x() { return this._x; };
    set x(value) { this._x = value; }

    get y() { return this._y; }
    set y(value) { this._y = value; }

    constructor(asset, x, y) {
        this._asset = asset;
        this._x = x;
        this._y = y;
    }
}