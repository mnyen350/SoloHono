function createAudio(src, options) {
    const audio = new Audio(src);
    for (const key in options)
        audio[key] = options[key];
    return audio;
}

export default class GameAssets {
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
            player: await graphics.loadImage('/assets/player.png'),
            enemy: await graphics.loadImage('/assets/enemy.png')
        };

        this._sounds = {
            test: createAudio('/assets/sounds/test.wav'),
            startGame: createAudio('/assets/sounds/rf2shop.mp3', { loop: true }),
            mainGame: createAudio('/assets/sounds/rf3bmg.mp3', { loop: true })
        };

        console.log('All assets loaded!');
    }
}