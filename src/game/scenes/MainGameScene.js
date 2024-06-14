import Scene from "./Scene";
import GameGraphics from "../GameGraphics";
import Game from "../Game";
import PlayerObject from "../objects/PlayerObject";
import TerrainObject from "../objects/TerrainObject";
import EnemyObject from "../objects/EnemyObject";
import EnemyType from "../objects/EnemyType";
import ObjectType from "../objects/ObjectType";
import DoorObject from "../objects/DoorObject";

export default class MainGameScene extends Scene {
    _state; // [y][x] -> a list of GameObject(asset/x/y/...)
    _player;
    _enemies;

    _level;
    _levelDesign;

    _selectedEnemy;
    _attackButton;

    get player() { return this._player; }

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

        this._player = null;

        this._attackButton = this.createButton(100, 100, this.assets.images.attackButton);
        this._attackButton.isVisible = false;
        this._attackButton.addEventListener("click", (e) => this.attackButtonClick(e));
    }

    async loadLevelDesign(level) {
        const resp = await fetch(`/levels/${level}.txt`);

        let content = await resp.text();
        content = content.replace(/\r/g, ''); // replace all \r

        const levelDesign = content.split('\n');
        this._levelDesign = levelDesign;
        this._level = level;

        // sanity check the level design
        this._sanityCheckLevelDesign(levelDesign);

        this._state = [];
        this._enemies = [];

        for (let y = 0; y < Game.Height; y++) {
            const line = levelDesign[y];
            const row = []; // row of GameObject
            for (let x = 0; x < Game.Width; x++) {
                const ch = line[x];
                const obj = new TerrainObject(this.game, ch);
                obj.x = x;
                obj.y = y;
                row.push([obj]);
            }
            this._state.push(row);
        }

        this._spawnPlayer();
        this._spawnEnemies();
        this._spawnDoor();
    }

    async load() {
        await super.load();
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

    _spawnDoor() {
        const [rx, ry] = this._findAvailableLocation();
        const door = new DoorObject(this.game);
        this.tryMoveObject(door, rx, ry);
    }

    _spawnPlayer() {
        if (!this._player)
            this._player = new PlayerObject(this.game);

        const [rx, ry] = this._findAvailableLocation();
        this.tryMoveObject(this._player, rx, ry);
    }

    _spawnEnemies() {
        for (let i = 0; i < 5; i++) {
            const [rx, ry] = this._findAvailableLocation();
            const enemy = new EnemyObject(this.game, EnemyType.test);
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

    attackButtonClick(e) {
        if (!this._selectedEnemy) return;
        if (this._selectedEnemy.isDead) return;
        if (!this.game.isAdjacentObjects(this._player, this._selectedEnemy)) return;

        console.log('attack button clicked');
        console.log('attacking', this._selectedEnemy);

        this._player.attack(this._selectedEnemy);

        console.log('new enemy hp: ', this._selectedEnemy.health);

        // trigger the next turn since the player took an action
        this.nextTurn();
    }

    handleMouseMoveEvent(e) {
        super.handleMouseMoveEvent(e);

        const x = Math.floor(this.mouse.x / GameGraphics.TileSize);
        const y = Math.floor(this.mouse.y / GameGraphics.TileSize);
        const obj = this.getTopObjectAt(x, y);
        if (!obj) return;

        if (obj.objectType == ObjectType.enemy) {
            if (this.game.isAdjacentObjects(this._player, obj)) {
                this._showPointer = true;
            }
        } else if (obj.objectType == ObjectType.player) {
            this._showPointer = true;
        }
    }

    handleContextMenu(e) {
        this._attackButton.isVisible = false;
        this.redraw();
    }

    handleClickEvent(e) {
        super.handleClickEvent(e);

        this._selectedEnemy = null;
        this._attackButton.isVisible = false;

        // only if a button wasn't clicked
        if (!this._buttons.find(b => b.isVisible && b.isOverlap(e.offsetX, e.offsetY))) {
            const x = Math.floor(this.mouse.x / GameGraphics.TileSize);
            const y = Math.floor(this.mouse.y / GameGraphics.TileSize);
            const obj = this.getTopObjectAt(x, y);

            if (obj) {
                if (obj.objectType == ObjectType.enemy) {

                    if (this.game.isAdjacentObjects(this._player, obj)) {
                        this._selectedEnemy = obj;
                        this._attackButton.isVisible = true;
                        this.redraw();

                        console.log('enemy selected', obj);
                    }

                } else if (obj.objectType == ObjectType.player) {
                    console.log('player');
                }
            }
        }


        this.redraw();
    }

    nextTurn() {
        // next turn
        for (const e of this.getAllObjects())
            e.nextTurn();

        // redraw
        this.redraw();
    }

    async handleMovePlayer(key) {
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
                const objs = this.getObjectsAt(player.x, player.y);
                const door = objs.find(o => o.objectType == ObjectType.door);
                if (!door) {
                    this.nextTurn();
                } else { // stepped onto door, advance to next level

                    if (this._level == 3) {
                        console.log('game completed.');
                    } else {
                        await this.loadLevelDesign(this._level + 1);
                        this.redraw();
                    }
                }
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

    deleteObject(obj) {
        const currentLocationObjs = this.getObjectsAt(obj.x, obj.y);
        if (!currentLocationObjs) return;

        const indexOfObj = currentLocationObjs.findIndex(o => o === obj);
        if (indexOfObj == -1) return;

        currentLocationObjs.splice(indexOfObj, 1);
        this.redraw();
    }

    tryMoveObject(obj, dstX, dstY) {
        //check if its legal move? (player should only move one..)
        if (!this.isMovable(dstX, dstY)) {
            return false;
        }

        //remvoe from old location
        this.deleteObject(obj);

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
        if (x < 0 || y < 0) return [];
        else if (x >= Game.Width || y >= Game.Height) return [];
        return this._state[y][x];
    }

    getTopObjectAt(x, y) {
        let objs = this.getObjectsAt(x, y);
        return objs[objs.length - 1];
    }

    async _draw() {
        for (let y = 0; y < Game.Height; y++)
            for (let x = 0; x < Game.Width; x++)
                this._drawFromState(x, y);

        this._drawButtons();

        let info =
            `Level: ${this._level}`.padEnd(15, ' ') +
            `HP: ${this._player.health}`.padEnd(15, ' ') +
            `Gold: ${this._player.gold}`.padEnd(15, ' ');

        await this.graphics.drawText(info, "14px serif", "white", 0, 0);
    }
}