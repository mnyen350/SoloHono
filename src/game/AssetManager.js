class AssetManager {
    // images
    _terrain;
    _edge;
    _player;

    get terrain() { return this._terrain; }
    get edge() { return this._edge; }
    get player() { return this._player; }

    constructor() {
        console.log('loaded assets');
    }

    async load(graphics) {
        this._terrain = await this._loadImage('assets/tile.png');
        this._edge = await this._loadImage('assets/tile2.png');

        // test out altering hue
        let player = await this._loadImage('assets/tile3.png');
        player = await graphics.changeImageHue(player, 45);
        this._player = player;
    }

    _loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function() {
                resolve(img);
            }
            img.onerror = function(err) {
                reject(err);
            }
            img.src = src; // start the loading
        });
    }
}

export default AssetManager;