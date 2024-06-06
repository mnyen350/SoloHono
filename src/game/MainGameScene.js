import Scene from "./Scene";
import GameGraphics from "./GameGraphics";
import Game from "./Game";
import GameObject from "./GameObject";

export default class MainGameScene extends Scene {
    _state; // [y][x] -> a list of GameObject(asset/x/y)
    _player;

    constructor(game) {
        super(game);
    }

    async loadLevel(level) {
        const tileCharacterMap = {
            '|': this.assets.images.wall,
            '-': this.assets.images.wall,
            '.': this.assets.images.floor,
            '#': this.assets.images.path,
            '+': this.assets.images.path,
            ' ': this.assets.images.blackspace
        };

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
                const asset = tileCharacterMap[ch];
                if (!asset)
                    throw new Error(`Invalid character ${ch} in level design at line ${y + 1}, column ${x + 1}`);
                const obj = new GameObject(asset, x, y);
                row.push([obj]);
            }
            this._state.push(row);
        }

        // testing purposes
        this._player = new GameObject(this.assets.images.player, 1, 1);
        this.getObjectsAt(1, 1).push(this._player);
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
            this.moveObject(player, player.x + deltaX, player.y + deltaY);
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

    moveObject(obj, dstX, dstY) {
        //check if its legal move? (player should only move one..)

        //remvoe from old location
        const currentLocationObjs = this.getObjectsAt(obj.x, obj.y);
        const indexOfObj = currentLocationObjs.findIndex(o => o === obj);
        currentLocationObjs.splice(indexOfObj, 1);

        //add obj at new location
        obj.x = dstX;
        obj.y = dstY;
        this.getObjectsAt(dstX, dstY).push(obj);
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