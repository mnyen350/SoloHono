class AssetManager {
    // images
    _floor;
    _wall;
    _player;
    _path;
    _blackspace;

    get floor() { return this._floor; }
    get wall() { return this._wall; }
    get player() { return this._player; }
    get path() { return this._path; }
    get blackspace() { return this._blackspace; }

    constructor() {}

    async load(graphics) {
        console.log('Loading assets...');

        this._floor = await this._loadImage('assets/floor.png');
        this._wall = await this._loadImage('assets/wall.png');
        this._path = await this._loadImage('assets/path.png');
        this._blackspace = await this._loadImage('assets/blackspace.png');

        // test out altering hue
        let player = await this._loadImage('assets/player.png');
        player = await graphics.changeImageHue(player, 45);
        this._player = player;

        console.log('All assets loaded!');
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