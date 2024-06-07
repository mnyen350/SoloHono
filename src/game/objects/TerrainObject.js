import NotImplementedError from "../NotImplementedError";
import GameObject from "./GameObject";

export default class TerrainObject extends GameObject {
    
    static tryCreate(assets, ch, x, y) {

        // char -> { asset, isMovable }
        const tileCharacterMap = {
            '|': { asset: assets.images.wall, isMovable: false },
            '-': { asset: assets.images.wall, isMovable: false },
            '.': { asset: assets.images.floor, isMovable: true }, 
            '#': { asset: assets.images.path, isMovable: true },
            '+': { asset: assets.images.path, isMovable: true },
            ' ': { asset: assets.images.blackspace, isMovable: false}
        };

        const found = tileCharacterMap[ch];
        if (!found)
            return null;

        let obj = new TerrainObject(found.asset, x, y, found.isMovable);
        return obj;
    }

    _isMovable;

    get isMovable(){
        return this._isMovable;
    }

    constructor(asset, x, y, isMovable) {
        super(asset, x, y);
        this._isMovable = isMovable;
    }
}