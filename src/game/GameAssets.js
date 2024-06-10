class GameAudio extends Audio {
    _game;
    _isMusic;

    get game() { return this._game; }
    get isMusic() { return this._isMusic; }

    constructor(game, src, options) {
        super(src);

        if (options) {
            for (const key in options)
                this[key] = options[key];
        }

        this._game = game;
    }

    play() {
        this.volume = this.isMusic ? this.game.musicVolume : this.game.soundVolume;
        super.play();
        console.log('playing audio', this.src);
    }

    pause() {
        super.pause();
        console.log('pausing audio', this.src);
    }
}

export default class GameAssets {
    _images;
    _sounds;
    _game;

    get game() { return this._game; }
    get images() { return this._images; }
    get sounds() { return this._sounds; }

    constructor(game) {
        this._game = game;
    }

    async load() {
        console.log('Loading assets...');
        const graphics = this.game.graphics;

        this._images = {
            floor: await graphics.loadImage('/assets/floor.png'),
            wall: await graphics.loadImage('/assets/wall.png'),
            path: await graphics.loadImage('/assets/path.png'),
            blackspace: await graphics.loadImage('/assets/blackspace.png'),
            player: await graphics.loadImage('/assets/player.png'),
            enemy: await graphics.loadImage('/assets/enemy.png')
        };

        this._sounds = {
            test: new GameAudio(this.game, '/assets/sounds/test.wav'),
            startGame: new GameAudio(this.game, '/assets/sounds/mainmenu.mp3', { loop: true }),
            mainGame: new GameAudio(this.game, '/assets/sounds/gamebgm.mp3', { loop: true })
        };

        console.log('All assets loaded!');
    }
}