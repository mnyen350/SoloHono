import Scene from "./Scene";
import GameGraphics from "./GameGraphics";
import Game from "./Game";
import GameObject from "./objects/GameObject";
import TerrainObject from "./objects/TerrainObject";

export default class MainGameScene extends Scene {
    _state; // [y][x] -> a list of GameObject(asset/x/y)
    _player;

    constructor(game) {
        super(game);
    }

    async loadLevel(level) {
        const resp = await fetch(`/levels/${level}.txt`);

        let content = await resp.text();
        content = content.replace(/\r/g, ''); // replace all \r

        const levelDesign = content.split('\n');

        // sanity check the level design
        this._sanityCheckLevelDesign(levelDesign);

        this._state = [];
        for (let y = 0; y < levelDesign.length; y++) {
            const line = levelDesign[y];
            const row = []; // row of GameObject
            for (let x = 0; x < line.length; x++) {
                const ch = line[x];
                const obj = TerrainObject.tryCreate(this.assets, ch, x, y);
                if (!obj)
                    throw new Error(`Invalid character ${ch} in level design at line ${y + 1}, column ${x + 1}`);
                row.push([obj]);
            }
            this._state.push(row);
        }

        // testing purposes
        this._player = new GameObject(this.assets.images.player, 3, 3);
        this.getObjectsAt(this._player.x, this._player.y).push(this._player);
    }

    _sanityCheckLevelDesign(levelDesign) {
        // ensure that this is a valid level design

        // height is 35
        if (levelDesign.length != Game.Height)
            throw new Error(`Level design provided does not meet the height specification of Game, expected ${Game.Height} got ${levelDesign.length}`);

        // width is 79
        for (let y = 0; y < levelDesign.length; y++) {
            if (levelDesign[y].length != Game.Width)
                throw new Error(`Level design provided does not meet the width specification of Game, expected ${Game.Width} got ${levelDesign[y].length} at line ${y + 1}`);
        }
    }

    handleMovePlayer(key) {
        const player = this._player;
        let deltaX = 0;
        let deltaY = 0;

        if (key === 'ArrowLeft') deltaX--;
        else if (key === 'ArrowRight') deltaX++;
        else if (key === 'ArrowDown') deltaY++;
        else if (key === 'ArrowUp') deltaY--;

        if (deltaX != 0 || deltaY != 0) {
            let res = this.tryMoveObject(player, player.x + deltaX, player.y + deltaY);
            if(res)
                this.redraw();
        }
    }

    handleKeyDownEvent(e) {
        const key = e.key;
        this.handleMovePlayer(key);
    }

    _drawAssetAt(asset, x, y) {
        this.graphics.drawImage(asset, x * GameGraphics.TileSize, y * GameGraphics.TileSize, asset.width, asset.height);
    }

    _drawFromState(x, y) {
        this._drawAssetAt(this.getTopObjectAt(x, y).asset, x, y);
    }

    tryMoveObject(obj, dstX, dstY) {
        //check if its legal move? (player should only move one..)
        const destinationObjs = this.getObjectsAt(dstX, dstY);
        if(!destinationObjs) // this should never actually happen
            return false;
        else if (destinationObjs.find(o => !o.isMovable)) // check if any of the destinationObjs are not isMovable
            return false;
        
        //remvoe from old location
        const currentLocationObjs = this.getObjectsAt(obj.x, obj.y);
        const indexOfObj = currentLocationObjs.findIndex(o => o === obj);
        currentLocationObjs.splice(indexOfObj, 1);

        //add obj at new location
        obj.x = dstX;
        obj.y = dstY;
        destinationObjs.push(obj);

        return true;
    }

    getObjectsAt(x, y) {
        return this._state[y][x];
    }

    getTopObjectAt(x, y) {
        let objs = this.getObjectsAt(x, y);
        return objs[objs.length - 1];
    }

    _draw() {
        for (let y = 0; y < Game.Height; y++)
            for (let x = 0; x < Game.Width; x++)
                this._drawFromState(x, y);
    }
}