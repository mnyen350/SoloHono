import AssetManager from "./AssetManager";
import GameGraphics from "./GameGraphics";

class Game {
    _graphics;
    _assetManager;
    _playerLocation;
    _width;
    _height;
    _levelDesign;

    get graphics() { return this._graphics; }
    get assetManager() { return this._assetManager; }
    get width() { return this._width; }
    get height() { return this._height; }

    constructor(width, height) {
        this._graphics = new GameGraphics(width, height);
        this._assetManager = new AssetManager();
        this._width = width;
        this._height = height;
    }

    async start() {
        try {
            await this._graphics.load();
            await this._assetManager.load(this._graphics);
            this.addInputEvents();

            await this.loadLevelDesign(1);
            this._playerLocation = [1, 1];
            this.redrawBoard();

            console.log('OK');
        } catch (ex) {
            console.log('Failed to start game');
            console.error(ex);
        }
    }

    async loadLevelDesign(level) {
        console.log('loadld');
        const resp = await fetch(`/levels/${level}.txt`);

        let content = await resp.text();
        content = content.replace(/\r/g, ''); // replace all \r
        
        this._levelDesign = content.split('\n');
    }

    handleKeyDown(key) {
        if (key == 'ArrowLeft') { // left
            this._playerLocation[0]--;
        } else if (key == 'ArrowRight') { // right
            this._playerLocation[0]++;
        } else if (key == 'ArrowDown') { // down 
            this._playerLocation[1]++;
        } else if (key == 'ArrowUp') { // up
            this._playerLocation[1]--;
        }
        this.redrawBoard();
    }

    addInputEvents() {
        window.addEventListener("keydown", (e) => {
            //console.log(e);
            this.handleKeyDown(e.key);
        });
    }

    async redrawBoard() {
        const graphics = this._graphics;
        const player = this._assetManager.player;

        const tileCharacterMap = {
            '|': this._assetManager.wall,
            '-': this._assetManager.wall,
            '.': this._assetManager.floor,
            '#': this._assetManager.path,
            '+': this._assetManager.path,
            ' ': this._assetManager.blackspace
            
        };

        for (let y = 0; y < this._levelDesign.length; y++) {
            let line = this._levelDesign[y];
            for (let x = 0; x < line.length; x++) {
                let ch = line[x];
                let asset = tileCharacterMap[ch];

                if (!asset) // this should never happen
                    asset = this._assetManager.floor;

                this._graphics.drawImage(asset, x*GameGraphics.TileSize, y*GameGraphics.TileSize, asset.width, asset.height);
            }
        }
    }


}

export default Game;