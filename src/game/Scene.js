import NotImplementedError from "./NotImplementedError";

export default class IScene {
    _graphics;
    _assets;

    get graphics() { return this._graphics; }
    get assets() { return this._assets; }

    constructor(graphics, assets) {
        this._graphics = graphics;
        this._assets = assets;
    }

    draw() { throw new NotImplementedError(); }
    handleKeyDownEvent(e) {}
}