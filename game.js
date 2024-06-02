class Game {
    #canvas;
    #assetManager;

    #playerLocation;

    get ctx() { return this.#canvas.getContext("2d"); }
    get assetManager() { return this.#assetManager; }

    constructor() {
        this.#canvas = document.getElementById("myCanvas");
        this.#assetManager = new AssetManager();
    }

    async start() {
        await this.#assetManager.load();
        console.log('asset manager loaded');
        this.addInputEvents();
        console.log('added input event handlers');

        this.#playerLocation = [1,1];
        this.redrawBoard();

        console.log('OK');
    }

    handleKeyDown(keyCode) {
        console.log(keyCode);
        if (keyCode == 37) { // left
            this.#playerLocation[0]--;
        }
        else if (keyCode == 39) { // right
            this.#playerLocation[0]++;
        }
        else if (keyCode == 40) { // down 
            this.#playerLocation[1]++;
        }
        else if (keyCode == 38) {  // up
            this.#playerLocation[1]--;
        }
        this.redrawBoard();
    }

    addInputEvents() {
        window.addEventListener("keydown", (e) => {
            //console.log(e);
            this.handleKeyDown(e.keyCode);
        });
    }

    redrawBoard() {        
        const ctx = this.ctx;
        const terrain = this.#assetManager.terrain;
        const edge = this.#assetManager.edge;
        const player = this.#assetManager.player;

        // set default terrain tile
        for (let h = 0; h < this.#canvas.height; h += terrain.height) {
            for (let w = 0; w < this.#canvas.width; w += terrain.width) {
                ctx.drawImage(terrain, w, h, terrain.width, terrain.height);
            }
        }
        
        // draw edges
        // left and right
        for (let h = 0; h < this.#canvas.height; h += edge.height) {
            ctx.drawImage(edge, 0, h, edge.width, edge.height);
            ctx.drawImage(edge, this.#canvas.width - edge.width, h, edge.width, edge.height);
        }
        // top and bottom
        for (let w = 0; w < this.#canvas.width; w += edge.width){
            ctx.drawImage(edge, w, 0, edge.width, edge.height);
            ctx.drawImage(edge, w, this.#canvas.height - edge.height, edge.width, edge.height);
        }

        // draw player
        ctx.drawImage(player, this.#playerLocation[0] * terrain.width, this.#playerLocation[1] * terrain.height, player.width, player.height);
    }


}

(function () {
    const game = new Game();
    window.GAME = game;

    game.start();
})();