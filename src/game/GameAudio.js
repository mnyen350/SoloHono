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
        if (this.isMusic) {
            this.adjustVolume();
            super.play();
            console.log('playing audio', this.src);
        } else {
            // if it's not music, we allow sounds to overlap
            const ga = new GameAudio(this.game, this.src);
            ga._isMusic = true; // so that it actually plays
            ga.volume = this.volume;
            ga.playbackRate = this.playbackRate;
            ga.play();
        }
    }

    pause() {
        super.pause();
        console.log('pausing audio', this.src);
    }
}