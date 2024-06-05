class AssetManager {
    _images;
    _sounds;

    get images() { return this._images; }
    get sounds() { return this._sounds; }

    constructor() {}

    async load(graphics) {
        console.log('Loading assets...');

        this._images = {
            floor: await this._loadImage('/assets/floor.png'),
            wall: await this._loadImage('/assets/wall.png'),
            path: await this._loadImage('/assets/path.png'),
            blackspace: await this._loadImage('/assets/blackspace.png'),
            player: await this._loadImage('/assets/player.png')
        };

        this._sounds = {
            test: new Audio('/assets/test.wav')
        };

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