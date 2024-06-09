//import NotImplementedError from "../NotImplementedError";
import GameObject from "./GameObject";

export default class TerrainObject extends GameObject {

    static tryCreate(game, ch) {

        // char -> { asset, isMovable }
        const assets = game.assets;
        const tileCharacterMap = {
            '|': { asset: assets.images.wall, isMovable: false },
            '-': { asset: assets.images.wall, isMovable: false },
            '.': { asset: assets.images.floor, isMovable: true },
            '#': { asset: assets.images.path, isMovable: true },
            '+': { asset: assets.images.path, isMovable: true },
            ' ': { asset: assets.images.blackspace, isMovable: false }
        };

        const found = tileCharacterMap[ch];
        if (!found)
            return null;

        const obj = new TerrainObject(game, found.asset, found.isMovable);
        return obj;
    }

    _isMovable;

    get isMovable() {
        return this._isMovable;
    }

    constructor(game, asset, isMovable) {
        super(game, asset);
        this._isMovable = isMovable;
    }
}