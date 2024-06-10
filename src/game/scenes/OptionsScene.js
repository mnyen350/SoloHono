import Scene from "./Scene";
import StartGameScene from "./StartGameScene";

export default class OptionsScene extends Scene {
    _bg;

    get isActive() { return super.isActive; }
    set isActive(value) {
        if (this.isActive != value) {
            const music = this.assets.sounds.startGame;
            if (value)
                music.play();
            else
                music.pause();
        }
        super.isActive = value;
    }

    constructor(game) {
        super(game);
    }

    createVolumeButtons(x, y, [p1, p2], [s1, s2], click) {
        const plus = this.createButton(x, y, p1);
        plus.addEventListener("hoverchange", (e) => plus.setAsset(plus.isHovered ? p2 : p1));
        plus.addEventListener("click", (e) => {
            click(1);
        });

        const minus = this.createButton(x + p1.width + 10, y, s1);
        minus.addEventListener("hoverchange", (e) => minus.setAsset(minus.isHovered ? s2 : s1));
        minus.addEventListener("click", (e) => {
            click(-1);
        });

        return [plus, minus];
    }

    async load() {
        //console.log(this.game.assets.images);

        const {
            bg,
            plus1,
            plus2,
            minus1,
            minus2,
            back1,
            back2
        } = this.game.assets.images.optionsMenu;

        this._bg = bg;

        // music
        this.createVolumeButtons(700, 130, [plus1, plus2], [minus1, minus2], (val) => {
            this.game.musicVolume = Math.max(0, Math.min(this.game.musicVolume + val * 0.1, 1));
            console.log(this.game.musicVolume);
        });

        // sound
        this.createVolumeButtons(700, 130 + 130, [plus1, plus2], [minus1, minus2], (val) => {
            console.log(val);
        });

        const back = this.createButton(700, 130 + 130 * 2, back1);
        back.addEventListener("hoverchange", (e) => back.setAsset(back.isHovered ? back2 : back1));
        back.addEventListener("click", (e) => {
            this.game.menuScene = new StartGameScene(this.game);
        });


        await super.load();
    }

    _draw() {
        const bg = this._bg;
        this.graphics.drawImage(bg, 0, 0, bg.width, bg.height);
        this._drawButtons();
    }

    handleMouseMoveEvent(e) {
        super.handleMouseMoveEvent(e);
    }
}