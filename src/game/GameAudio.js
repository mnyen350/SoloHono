export default class GameAudio extends Audio {
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

    adjustVolume() {
        this.volume = this.isMusic ? this.game.musicVolume : this.game.soundVolume;
    }

    play() {
        this.adjustVolume();
        super.play();
        console.log('playing audio', this.src);
    }

    pause() {
        super.pause();
        console.log('pausing audio', this.src);
    }
}