class AssetManager {
    // images
    #terrain;
    #edge;
    #player;

    get terrain() { return this.#terrain; }
    get edge() { return this.#edge; }
    get player() { return this.#player; }

    constructor() {
        console.log('loaded assets');
    }

    async load() {
        this.#terrain = await this.#loadImage('assets/tile.png');
        this.#edge = await this.#loadImage('assets/tile2.png');
        this.#player = await this.#loadImage('assets/tile3.png');
    }

    #loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function () {
                resolve(img);
            }
            img.onerror = function (err) {
                reject(err);
            }
            img.src = src; // start the loading
        });
    }
}

window.AssetManager = AssetManager;