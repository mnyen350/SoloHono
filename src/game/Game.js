import AssetManager from "./AssetManager";
import GameGraphics from "./GameGraphics";

class Game {
    _graphics;
    _assetManager;
    _playerLocation;

    get graphics() { return this._graphics; }
    get assetManager() { return this._assetManager; }

    constructor() {
        this._graphics = new GameGraphics();
        this._assetManager = new AssetManager();
    }

    async start() {
        try {
            await this._graphics.load();
            await this._assetManager.load(this._graphics);
            this.addInputEvents();

            this._playerLocation = [1, 1];
            this.redrawBoard();

            console.log('OK');
        } catch (ex) {
            console.log('Failed to start game');
            console.error(ex);
        }
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
        const terrain = this._assetManager.terrain;
        const edge = this._assetManager.edge;
        const player = this._assetManager.player;

        // set default terrain tile
        for (let h = 0; h < graphics.height; h += terrain.height) {
            for (let w = 0; w < graphics.width; w += terrain.width) {
                graphics.drawImage(terrain, w, h, terrain.width, terrain.height);
            }
        }

        // draw edges
        // left and right
        for (let h = 0; h < graphics.height; h += edge.height) {
            graphics.drawImage(edge, 0, h, edge.width, edge.height);
            graphics.drawImage(edge, graphics.width - edge.width, h, edge.width, edge.height);
        }
        // top and bottom
        for (let w = 0; w < graphics.width; w += edge.width) {
            graphics.drawImage(edge, w, 0, edge.width, edge.height);
            graphics.drawImage(edge, w, graphics.height - edge.height, edge.width, edge.height);
        }

        // draw player
        graphics.drawImage(player, this._playerLocation[0] * terrain.width, this._playerLocation[1] * terrain.height, player.width, player.height);
    }


}

export default Game;