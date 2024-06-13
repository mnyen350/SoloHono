//import NotImplementedError from "../NotImplementedError";
import GameObject from "./GameObject";
import ObjectType from "./ObjectType";

export default class TerrainObject extends GameObject {

    _isMovable;

    get isMovable() {
        return this._isMovable;
    }

    constructor(game, ch) {

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
            throw new Error(`Invalid TerrainObject character ${ch}`);

        super(game, found.asset, ObjectType.terrain);
        this._isMovable = found.isMovable;
    }
}