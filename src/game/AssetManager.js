class AssetManager {
    _images;
    _sounds;

    get images() { return this._images; }
    get sounds() { return this._sounds; }

    constructor() {}

    async load(graphics) {
        console.log('Loading assets...');

        this._images = {
            floor: await graphics.loadImage('/assets/floor.png'),
            wall: await graphics.loadImage('/assets/wall.png'),
            path: await graphics.loadImage('/assets/path.png'),
            blackspace: await graphics.loadImage('/assets/blackspace.png'),
            player: await graphics.loadImage('/assets/player.png')
        };

        this._sounds = {
            test: new Audio('/assets/test.wav')
        };

        console.log('All assets loaded!');
    }
}

export default AssetManager;