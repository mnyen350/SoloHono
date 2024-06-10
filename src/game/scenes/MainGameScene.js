import Scene from "./Scene";
import GameGraphics from "../GameGraphics";
import Game from "../Game";
import GameObject from "../objects/GameObject";
import TerrainObject from "../objects/TerrainObject";
import EnemyObject from "../objects/EnemyObject";

export default class MainGameScene extends Scene {
    _state; // [y][x] -> a list of GameObject(asset/x/y)
    _player;
    _enemies;
    _levelDesign;

    get isActive() { return super.isActive; }
    set isActive(value) {
        if (this.isActive != value) {
            const music = this.assets.sounds.mainGame;
            if (value)
                music.play();
            else
                music.pause();
        }
        super.isActive = value;
    }

    constructor(game) {
        super(game);
    }

    async loadLevelDesign(level) {
        const resp = await fetch(`/levels/${level}.txt`);

        let content = await resp.text();
        content = content.replace(/\r/g, ''); // replace all \r

        const levelDesign = content.split('\n');
        this._levelDesign = levelDesign;

        // sanity check the level design
        this._sanityCheckLevelDesign(levelDesign);

        this._state = [];
        this._enemies = [];
        this._player = null;

        for (let y = 0; y < Game.Height; y++) {
            const line = levelDesign[y];
            const row = []; // row of GameObject
            for (let x = 0; x < Game.Width; x++) {
                const ch = line[x];
                const obj = TerrainObject.tryCreate(this.game, ch);
                if (!obj)
                    throw new Error(`Invalid character ${ch} in level design at line ${y + 1}, column ${x + 1}`);
                obj.x = x;
                obj.y = y;
                row.push([obj]);
            }
            this._state.push(row);
        }
    }

    async load() {
        this._spawnPlayer();
        this._spawnEnemies();
    }

    async unload() {}


    isMovable(x, y, empty) {
        if (x < 0 || y < 0)
            return false;
        else if (x >= Game.Width || y >= Game.Height)
            return false;

        const destinationObjs = this.getObjectsAt(x, y);
        //console.log(destinationObjs);

        if (!destinationObjs) // this should never actually happen
            return false;
        else if (empty && destinationObjs.length > 1) // if we need empty, and only the terrain object exists
            return false;
        else if (destinationObjs.find(o => !o.isMovable)) // check if any of the destinationObjs are not isMovable
            return false;


        return true;
    }

    _findAvailableLocation() {
        const LIMIT = 10000;
        for (let i = 0; i < 10000; i++) {
            const rx = this.random.nextInt(0, Game.Width);
            const ry = this.random.nextInt(0, Game.Height);

            //console.log('findAvailableLocation', [rx, ry]);
            if (this.isMovable(rx, ry, true))
                return [rx, ry];
        }
        throw new Error(`Unable to find available location within ${LIMIT} tries`);
    }

    _spawnPlayer() {
        const [rx, ry] = this._findAvailableLocation();
        this._player = new GameObject(this.game, this.assets.images.player);
        this.tryMoveObject(this._player, rx, ry);

        //console.log('spawned player at', [ok, px, py]);
        //console.log([this._player.x, this._player.y]);
    }

    _spawnEnemies() {
        for (let i = 0; i < 5; i++) {
            const [rx, ry] = this._findAvailableLocation();
            const enemy = EnemyObject.tryCreate(this.game, EnemyObject.TYPE_TEST);
            if (!enemy)
                throw new Error(`Failed to create enemy`);

            this._enemies.push(enemy);
            this.tryMoveObject(enemy, rx, ry);
        }
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
            if (res) {
                // next turn
                for (const e of this.getAllObjects())
                    e.nextTurn();

                // redraw
                this.redraw();
            }
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
        if (!this.isMovable(dstX, dstY)) {
            return false;
        }

        //remvoe from old location
        if (obj.x > 0 && obj.y > 0) {
            const currentLocationObjs = this.getObjectsAt(obj.x, obj.y);
            const indexOfObj = currentLocationObjs.findIndex(o => o === obj);
            if (indexOfObj > -1)
                currentLocationObjs.splice(indexOfObj, 1);
        }

        //add obj at new location
        obj.x = dstX;
        obj.y = dstY;
        this.getObjectsAt(dstX, dstY).push(obj);

        return true;
    }

    getAllObjects() {
        const objs = [];
        for (let y = 0; y < Game.Height; y++)
            for (let x = 0; x < Game.Width; x++)
                for (const obj of this.getObjectsAt(x, y))
                    objs.push(obj);
        return objs;
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