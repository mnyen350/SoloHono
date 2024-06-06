import Scene from "./Scene";
import GameGraphics from "./GameGraphics";
import Game from "./Game";
import GameObject from "./GameObject";

export default class MainGameScene extends Scene {
    _state; // 2d array of the board objects

    _playerLocation;

    constructor(graphics, assets) {
        super(graphics, assets);
        this._playerLocation = [1, 1];
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
                    throw new Error(`Invalid character ${ch} in level design at line ${y+1}, column ${x+1}`);
                const obj = new GameObject(asset, x, y);
                row.push(obj); 
            }
            this._state.push(row);
        }
    }

    _sanityCheckLevelDesign(levelDesign)
    {
        // ensure that this is a valid level design
        
        // height is 35
        if(levelDesign.length != Game.Height)
            throw new Error(`Level design provided does not meet the height specification of Game, expected ${Game.Height} got ${levelDesign.length}`);

        // width is 79
        for(let y = 0; y < levelDesign.length; y++){
            if(levelDesign[y].length != Game.Width)
                throw new Error(`Level design provided does not meet the width specification of Game, expected ${Game.Width} got ${levelDesign[y].length} at line ${y+1}`);
        }
    }

    handleKeyDownEvent(e) {
        const key = e.key;
        if (key === 'ArrowLeft') { // left
            this._playerLocation[0]--;
            return true;
        } else if (key === 'ArrowRight') { // right
            this._playerLocation[0]++;
            return true;
        } else if (key === 'ArrowDown') { // down 
            this._playerLocation[1]++;
            this.assets.sounds.test.play();
            return true;
        } else if (key === 'ArrowUp') { // up
            this._playerLocation[1]--;
            return true;
        }
        return false;
    }

    _drawAssetAt(asset, x, y) {
        this.graphics.drawImage(asset, x * GameGraphics.TileSize, y * GameGraphics.TileSize, asset.width, asset.height);
    }

    _drawFromLevelDesign(x, y) {
        this._drawAssetAt(this._state[y][x].asset, x, y);
    }

    draw() {
        for (let y = 0; y < Game.Height; y++)
            for (let x = 0; x < Game.Width; x++)
                this._drawFromLevelDesign(x, y);

        const [px, py] = this._playerLocation;
        this._drawAssetAt(this.assets.images.player, px, py);
    }
}